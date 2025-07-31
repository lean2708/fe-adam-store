import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import type { UserResponse, EntityBasic } from "@/api-client/models";

declare module "next-auth" {
  interface Session {
    user: UserResponse & {
      accessToken: string;
      refreshToken: string;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User extends UserResponse {
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    user: UserResponse & {
      accessToken: string;
      refreshToken: string;
    };
  }
}
