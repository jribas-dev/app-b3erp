export const ROLES = {
  SUPERVISOR: "supervisor",
  SALER: "saler",
  BUYER: "buyer",
  NOTALLOW: "notallow",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROUTE_PERMISSIONS = {
  "/home": ["saler", "supervisor", "buyer"],
  "/saler": ["saler", "supervisor"],
  "/buyer": ["buyer"],
  "/super": ["supervisor"],
  "/notallow": ["notallow"],
} as const;

export const PUBLIC_ROUTES = [
  "/",
  "/auth",
  "/privacy-policy",
  "/terms-of-service",
  "/user-pre",
] as const;
