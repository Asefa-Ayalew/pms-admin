import {
  IconAdjustments,
  IconAlertHexagon,
  IconBuildingEstate,
  IconCalendar,
  IconCurrency,
  IconLock,
  IconMoneybag,
  IconReportMoney,
  IconSocial,
  IconUser,
} from "@tabler/icons-react";
import { RoleKey } from "../auth/hooks/useRoleGuard";
export type RouteConfig = {
  allowedRoles: RoleKey[];
  restrictedRoles?: RoleKey[];
  requiresAuth?: boolean;
};

export type RoutePermissions = {
  [key: string]: RouteConfig;
};

export const PROTECTED_ROUTES: RoutePermissions = {
  "/vendor": {
    allowedRoles: ["SA"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
  "/pro-forma": {
    allowedRoles: ["SA", "SL"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
  "/my-organization": {
    allowedRoles: ["SA", "OM"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
  "/role": {
    allowedRoles: ["SA", "OM"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
  "/analytics": {
    allowedRoles: ["SA", "OM", "FI"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
  
  "/payment-collection": {
    allowedRoles: ["SA", "OM", "FI"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
} as const;

export const NAV_ITEMS = {
  DASHBOARD: { label: "Dashboard", path: "/" },
  UsersManagement: {
    label: "Users",
    icon: IconUser,
    children: [
      { label: "Users", path: "/user" },
      { label: "Roles", path: "/roles" },
      { label: "Departments", path: "/departments" },
    ],
  },
  PROPERTIES: {
    label: "Properties",
    icon: IconBuildingEstate,
    children: [
      { label: "Tenants", path: "/tenants" },
      { label: "Properties", path: "/property" },
      { label: "Leases", path: "/lease" },
    ],
  },
} as const;
