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
  // "/user": {
  //   allowedRoles: ["SA", "OM"],
  //   restrictedRoles: ["OPSWR"],
  //   requiresAuth: true,
  // },
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
  // "/payable": {
  //   allowedRoles: ["SA", "OM", "FI"],
  //   restrictedRoles: ["OPSWR"],
  //   requiresAuth: true,
  // },
  // "/receivable": {
  //   allowedRoles: ["SA", "OM", "FI"],
  //   restrictedRoles: ["OPSWR"],
  //   requiresAuth: true,
  // },
  // "/expense-type": {
  //   allowedRoles: ["SA", "OM", "FI"],
  //   restrictedRoles: ["OPSWR"],
  //   requiresAuth: true,
  // },
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
  INTERACTIONS: {
    label: "Interactions",
    icon: IconSocial,
    children: [
      {
        label: "FAQs",
        icon: IconMoneybag,
        path: "/faqs",
      },
      {
        label: "Feed Backs",
        icon: IconCalendar,
        path: "/feed-backs",
      },
      {
        label: "Testimonials",
        icon: IconCurrency,
        path: "/testimonials",
      },
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
  BANKACCOUNTS: {
    label: "Bank Accounts",
    icon: IconMoneybag,
    children: [
      { label: "Organizational", path: "/organization-bank-accounts" },
      { label: "Individual", path: "/bank-accounts" },
    ],
  },
  FINANCES: {
    label: "Finances",
    icon: IconReportMoney,
    children: [
      { label: "Expenses", path: "/expense" },
      { label: "Invoice Items", path: "/invoice-item" },
      { label: "Payables", path: "/payable" },
      { label: "Receivables", path: "/receivable" },
      { label: "Expense Types", path: "/expense-types" },
      { label: "Revenue Types", path: "/revenue-types" },
    ],
  },
  Maintenance: {
    label: "Maintenance",
    icon: IconAlertHexagon,
    children: [
      { label: "Maintenance Requests", path: "/maintenance-request" },
      { label: "Maintenance Types", path: "/maintenance-types" },
      { label: "Maintenance Schedules", path: "/maintenance-schedules" },
    ],
  },
  SETTINGS: {
    label: "Settings",
    icon: IconAdjustments,
    children: [{ label: "Document Type", path: "/document-types" }],
  },
  SECURITIES: {
    label: "Securities",
    icon: IconLock,
    children: [{ label: "Change password", path: "/password-change" }],
  },
} as const;
