import React from "react";
import { Redirect } from "expo-router";
import { useRoleContext } from "@/context/RoleContext";
import { UserRole } from "@/types/role";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allow: UserRole[];
}

export default function ProtectedRoute({ children, allow }: ProtectedRouteProps) {
  const { role, loading } = useRoleContext();

  if (loading) {
    return null;
  }

  // ✅ Step 6 FIXED: Intercepts non-permitted attempts and redirects safely [INDEX]
  if (!allow.includes(role)) {
    return <Redirect href="/feed" />;
  }

  return <>{children}</>;
}
