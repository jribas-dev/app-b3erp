export const ROLES = {
  ADMIN: "admin",
  BUYER: "buyer",
  INVENTORY: "inventory",
  SUPERSALER: "supersaler",
  SALER: "saler",
  NOTALLOW: "notallow",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
