import type { EsaRole } from "./types";

export const roleRank: Record<EsaRole, number> = {
  viewer: 1,
  staff: 2,
  admin: 3,
  owner: 4,
  tech: 5,
};

export function hasAtLeast(role: EsaRole, min: EsaRole) {
  return roleRank[role] >= roleRank[min];
}

export function isAdminLike(role: EsaRole) {
  return role === "tech" || role === "owner" || role === "admin";
}
