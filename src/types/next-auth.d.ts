import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import type { TUser, TEntityBasic } from "@/types";

declare module "next-auth" {
  interface Session {
    user: TUser & {
      accessToken: string;
    };
    accessToken: string;
    error?: string;
  }

  interface User extends TUser {
    accessToken: string;
    refreshToken?: string; // Optional since it's stored in httpOnly cookie
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    lastUserValidation?: number;
    user: TUser & {
      accessToken: string;
    };
    error?: string;
  }
}
