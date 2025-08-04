import type { UserResponse } from "@/api-client/models";

export interface AuthUser extends UserResponse {
  accessToken: string;
  cookiesToClear?: string[];
}

export interface AuthCredentials {
  email?: string;
  password?: string;
}

export interface TokenCredentials {
  accessToken?: string;
  refreshToken?: string;
  cookiesToClear?: string;
}