import NextAuth, { DefaultSession } from "next-auth";
import { UserProfile } from "../models/user-info.model";
import { ActiveRole, UserRole } from "../models/user-info.model";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
  }

  interface AdapterUser extends User {
    accessToken: string;
    refreshToken: string;
  }

  interface JWT {
    accessToken: string;
    refreshToken: string;
  }
}
