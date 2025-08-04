import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInApi, getMyInfoApi, refreshTokenApi } from "@/lib/data/auth";
import { setCookie, getCookie, deleteCookie } from "@/lib/cookies";
import type { UserResponse } from "@/api-client/models";
import type { AuthUser, AuthCredentials, TokenCredentials } from "@/types/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: AuthCredentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const tokenResponse = await signInApi({
            email: credentials.email,
            password: credentials.password,
          });

          if (!tokenResponse?.accessToken) {
            return null;
          }

          const user = await getMyInfoApi(tokenResponse.accessToken);

          if (!user) {
            return null;
          }

          if (tokenResponse.refreshToken) {
            await setCookie('refresh_token', tokenResponse.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60,
              path: '/',
            });
          }

          return {
            id: String(user.id || 0),
            email: user.email || "",
            name: user.name || "",
            accessToken: tokenResponse.accessToken,
            roles: user.roles,
            status: user.status,
            avatarUrl: user.avatarUrl,
            dob: user.dob,
            gender: user.gender,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "token-login",
      name: "token-login",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        cookiesToClear: { label: "Cookies to Clear", type: "text" }
      },
      async authorize(credentials: TokenCredentials | undefined) {
        if (!credentials?.accessToken) {
          return null;
        }

        try {
          const user = await getMyInfoApi(credentials.accessToken);

          if (!user) {
            return null;
          }

          if (credentials.refreshToken) {
            await setCookie('refresh_token', credentials.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60,
              path: '/',
            });
          }

          let cookiesToClear: string[] = [];
          if (credentials.cookiesToClear) {
            try {
              cookiesToClear = JSON.parse(credentials.cookiesToClear);
            } catch (error) {
              console.error('Error parsing cookiesToClear:', error);
            }
          }

          return {
            id: String(user.id || 0),
            email: user.email || "",
            name: user.name || "",
            accessToken: credentials.accessToken,
            cookiesToClear,
            roles: user.roles,
            status: user.status,
            avatarUrl: user.avatarUrl,
            dob: user.dob,
            gender: user.gender,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          console.error("Token authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as unknown as AuthUser;
        token.accessToken = authUser.accessToken;
        token.user = authUser;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        console.log("Access token expires at: ", new Date(token.accessTokenExpires).toLocaleString());

        const cookiesToClear = authUser.cookiesToClear;
        if (cookiesToClear && Array.isArray(cookiesToClear) && cookiesToClear.length > 0) {
          try {
            for (const cookieName of cookiesToClear) {
              await deleteCookie(cookieName);
              console.log(`Cleaned up cookie: ${cookieName}`);
            }
          } catch (error) {
            console.error('Error cleaning up cookies in JWT callback:', error);
          }
        }
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number) - 60 * 1000) {
        // Periodically validate user exists (every 5 minutes)
        const lastValidation = token.lastUserValidation as number || 0;
        const shouldValidate = Date.now() - lastValidation > 5 * 60 * 1000; // 5 minutes

        if (shouldValidate) {
          try {
            // Check if user still exists in database
            const userInfo = await getMyInfoApi(token.accessToken as string);
            if (!userInfo || userInfo.status !== 'ACTIVE') {
              // User doesn't exist or is inactive, force logout
              token.error = "UserNotFound";
              await deleteCookie('refresh_token');
              return token;
            }
            token.lastUserValidation = Date.now();
          } catch (error: unknown) {
            // If 401/403/404, user might be deleted
            const errorResponse = error as { response?: { status?: number } };
            if ([401, 403, 404].includes(errorResponse.response?.status || 0)) {
              token.error = "UserNotFound";
              await deleteCookie('refresh_token');
              return token;
            }
            // For other errors, continue (might be network issues)
          }
        }

        return token;
      }

      // Access token has expired, try to update it
      try {
        // Get refresh token from httpOnly cookie
        const refreshToken = await getCookie('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshedTokens = await refreshTokenApi({
          refreshToken: refreshToken,
        });

        token.accessToken = refreshedTokens.accessToken || token.accessToken;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Update refresh token in httpOnly cookie if new one provided
        if (refreshedTokens.refreshToken) {
          await setCookie('refresh_token', refreshedTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
          });
        }

        delete token.error;
        return token;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        // Clear refresh token cookie on error
        await deleteCookie('refresh_token');
        // Return the old token and let the user re-authenticate
        token.error = "RefreshAccessTokenError";
        return token;
      }
    },
    async session({ session, token }) {
      // Send properties to the client (without refresh token)
      if (token.user) {
        session.user = token.user as UserResponse & {
          accessToken: string;
        };
        session.accessToken = token.accessToken as string;
        session.error = token.error as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes (in seconds)
    updateAge: 5 * 60 // Optional: refresh session every 5 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
};
