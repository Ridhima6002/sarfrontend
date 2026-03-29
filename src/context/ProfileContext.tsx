/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode } from "react";

export const STORAGE_KEY = "sar_guardian_profile";

// ─── RBAC Role Types ───────────────────────────────────────────────────────
export type UserRole = 
  | "Junior Analyst" 
  | "Senior Analyst" 
  | "Analyst"
  | "Compliance Officer" 
  | "Risk Manager" 
  | "IT Administrator" 
  | "Audit Lead" 
  | "Legal Counsel" 
  | "Chief Compliance Officer";

// ─── RBAC Permissions ──────────────────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, {
  canReview: boolean;
  canApprove: boolean;
  canFiled: boolean;
}> = {
  "Junior Analyst": {
    canReview: true,    // Can review SARs (Review Queue column)
    canApprove: false,  // Cannot approve
    canFiled: false,    // Cannot file
  },
  "Senior Analyst": {
    canReview: false,   // Cannot review (Skip to Approved)
    canApprove: true,   // Can approve reviewed SARs (Approved column)
    canFiled: true,     // Can file SARs
  },
  "Analyst": {
    canReview: true,
    canApprove: false,
    canFiled: false,
  },
  "Compliance Officer": {
    canReview: true,
    canApprove: true,
    canFiled: true,
  },
  "Risk Manager": {
    canReview: true,
    canApprove: false,
    canFiled: false,
  },
  "IT Administrator": {
    canReview: false,
    canApprove: false,
    canFiled: false,
  },
  "Audit Lead": {
    canReview: true,
    canApprove: true,
    canFiled: true,
  },
  "Legal Counsel": {
    canReview: true,
    canApprove: false,
    canFiled: false,
  },
  "Chief Compliance Officer": {
    canReview: false,
    canApprove: true,
    canFiled: true,
  },
};

export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  role: UserRole | string;
  photoUrl: string;
  isVerified: boolean;
  department: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: "J. Morrison",
  email: "j.morrison@barclays.com",
  mobile: "+44 20 7116 1000",
  role: "Senior Analyst",
  photoUrl: "",
  isVerified: false,
  department: "Financial Crimes Compliance",
};

export interface ProfileContextValue {
  profile: UserProfile;
  isAuthenticated: boolean;
  setProfile: (profile: UserProfile) => void;
  saveProfile: (profile: UserProfile) => void;
  logout: () => void;
}

export const ProfileContext = createContext<ProfileContextValue>({
  profile: DEFAULT_PROFILE,
  isAuthenticated: false,
  setProfile: () => {},
  saveProfile: () => {},
  logout: () => {},
});

// Re-export useProfile hook for backward compatibility
export { useProfile } from "@/hooks/useProfile";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Track authentication state (user has logged in via authentication)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).isVerified === true : false;
    } catch {
      return false;
    }
  });

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setProfileState({ ...DEFAULT_PROFILE, ...parsed });
          setIsAuthenticated(parsed.isVerified === true);
        } catch (error) {
          console.error("Failed to parse stored profile:", error);
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setProfile = (p: UserProfile) => setProfileState(p);

  const saveProfile = (p: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfileState(p);
    setIsAuthenticated(p.isVerified === true);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfileState(DEFAULT_PROFILE);
    setIsAuthenticated(false);
  };

  return (
    <ProfileContext.Provider value={{ profile, isAuthenticated, setProfile, saveProfile, logout }}>
      {children}
    </ProfileContext.Provider>
  );
}
