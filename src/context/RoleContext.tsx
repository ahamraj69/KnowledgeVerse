import useRole from "@/hooks/useRole";
import { UserRole } from "@/types/role";
import React, { createContext, useContext } from "react";

interface RoleContextType {
  role: UserRole;
  loading: boolean;
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  refreshRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ uid, children }: { uid?: string; children: React.ReactNode }) {
  const roleState = useRole(uid);

  return (
    <RoleContext.Provider value={roleState}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be utilized within a valid RoleProvider layer bounds.");
  }
  return context;
}
