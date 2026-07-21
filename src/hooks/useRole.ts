import { getUserRole } from "@/lib/roleService";
import { UserRole } from "@/types/role";
import { useCallback, useEffect, useState } from "react";

export default function useRole(uid?: string) {
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState<boolean>(true);

  const syncActiveRole = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const activeRole = await getUserRole(uid);
      setRole(activeRole);
    } catch (e) {
      console.log("Authorization tracking sync fault caught: ", e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    syncActiveRole();
  }, [syncActiveRole]);

  return {
    role,
    loading,
    isStudent: role === "student",
    isTeacher: role === "teacher",
    isAdmin: role === "admin",
    refreshRole: syncActiveRole,
  };
}
