export const ROLES = {
  ADMIN: "admin",
  BUYER: "buyer",
  INVENTORY: "inventory",
  SUPERSALER: "supersaler",
  SALER: "saler",
  NOTALLOW: "notallow",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const PROTECTED_ROUTES = {
  "/admin": ["admin"],
  "/buyer": ["buyer"],
  "/home": ["admin", "supersaler", "saler", "buyer", "inventory"],
  "/inventory": ["inventory"],
  "/saler": ["saler", "supersaler"],
  "/notallow": ["notallow"],
} as const;

export const PUBLIC_ROUTES = [
  "/auth",
  "/privacy-policy",
  "/terms-of-service",
  "/user-pre",
] as const;
