"use client";

import {  useLazyGetUserInfoQuery } from "@/app/(features)/user/_store/user.query";
import { ActiveRole, Organization, UserProfile, UserRole } from "@/shared/models/user-info.model";
import { decodeJwt } from "jose";
import { useMemo, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface UseUserInfoReturn {
  user: UserProfile | null;
  isLoading: boolean;
  error: any;
  organization: Organization | null;
  userRoles: UserRole[];
  activeRole: ActiveRole | null;
  isAdmin: boolean;
  isPowerUser: boolean;
  hasRole: (roleKey: string) => boolean;
}

interface JwtPayload {
  activeRole: ActiveRole;
  [key: string]: any;
}

export function useUserInfo(): UseUserInfoReturn {
  const [getUserInfo, { data: userData, isLoading, error }] = useLazyGetUserInfoQuery();
  const { data: session, status: sessionStatus } = useSession();

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "authenticated" && accessToken) {
      getUserInfo();
    }
  }, [sessionStatus, accessToken, getUserInfo]);

  useEffect(() => {
    // Update accessToken based on NextAuth v5 session
    if (session?.accessToken) {
      setAccessToken(session.accessToken);
    }
  }, [session]);

  // Decode the JWT token if accessToken exists
  const decrypt = accessToken ? (decodeJwt(accessToken) as JwtPayload) : null;

  // User info and related data
  const userInfo = useMemo(() => (userData ? (userData as unknown as UserProfile) : null), [userData]);
  const organization = useMemo(() => userInfo?.organization ?? null, [userInfo]);
  const userRoles = useMemo(() => userInfo?.userRoles ?? [], [userInfo]);
  const activeRole = useMemo(() => decrypt?.activeRole ?? null, [decrypt]);

  // Role-based checks
  const isAdmin = useMemo(() => userRoles.some((role) => role.role.key === "SA"), [userRoles]);
  const isPowerUser = useMemo(() => userInfo?.isPowerUser ?? false, [userInfo]);

  // Check if a user has a specific role
  const hasRole = useMemo(() => {
    return (roleKey: string) => userRoles.some((role) => role.role.key === roleKey);
  }, [userRoles]);

  return {
    user: userInfo,
    isLoading,
    error,
    organization,
    userRoles,
    activeRole,
    isAdmin,
    isPowerUser,
    hasRole,
  };
}
