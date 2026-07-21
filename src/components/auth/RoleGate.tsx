import { useRoleContext } from "@/context/RoleContext";
import { UserRole } from "@/types/role";
import React from "react";

interface RoleGateProps {
  children: React.ReactNode;
  allow: UserRole[];
  fallback?: React.ReactNode;
}

export default function RoleGate({ children, allow, fallback = null }: RoleGateProps) {
  const { role, loading } = useRoleContext();

  if (loading) {
    return null;
  }

  if (!allow.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
