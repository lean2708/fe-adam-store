import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInApi, getMyInfoApi } from "@/lib/data/auth";
import type { UserResponse } from "@/api-client/models";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use your existing signInApi
          const tokenResponse = await signInApi({
            email: credentials.email,
            password: credentials.password,
          });

          if (!tokenResponse?.accessToken) {
            return null;
          }

          // Get user info using the token
          const user = await getMyInfoApi(tokenResponse.accessToken);

          if (!user) {
            return null;
          }

          // Return user object that will be stored in the JWT
          return {
            id: user.id?.toString() || "",
            email: user.email || "",
            name: user.name || "",
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken || "",
            // Include any other user properties you need
            roles: user.roles,
            status: user.status,
            avatarUrl: user.avatarUrl,
            dob: user.dob,
            gender: user.gender,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          } as any;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user is available (first sign in), store user data in token
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.user = user as any;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token.user) {
        session.user = token.user as UserResponse & {
          accessToken: string;
          refreshToken: string;
        };
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
