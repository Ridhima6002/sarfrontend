/**
 * useRBAC - Role-Based Access Control Hook
 * Provides role-based permissions and access checks
 */

import { useProfile } from "./useProfile";
import { ROLE_PERMISSIONS, UserRole } from "@/context/ProfileContext";

export interface RBACPermissions {
  canReview: boolean;
  canApprove: boolean;
  canFiled: boolean;
}

export function useRBAC() {
  const { profile } = useProfile();

  const permissions: RBACPermissions = ROLE_PERMISSIONS[profile.role as UserRole] || {
    canReview: false,
    canApprove: false,
    canFiled: false,
  };

  const hasPermission = (permission: keyof RBACPermissions): boolean => {
    return permissions[permission] === true;
  };

  return {
    role: profile.role,
    permissions,
    hasPermission,
    isJuniorAnalyst: profile.role === "Junior Analyst",
    isSeniorAnalyst: profile.role === "Senior Analyst",
    canReview: permissions.canReview,
    canApprove: permissions.canApprove,
    canFiled: permissions.canFiled,
  };
}
