import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import type { UserResponse, EntityBasic } from "@/api-client/models";

declare module "next-auth" {
  interface Session {
    user: UserResponse & {
      accessToken: string;
    };
    accessToken: string;
    error?: string;
  }

  interface User extends UserResponse {
    accessToken: string;
    refreshToken?: string; // Optional since it's stored in httpOnly cookie
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    lastUserValidation?: number;
    user: UserResponse & {
      accessToken: string;
    };
    error?: string;
  }
}
