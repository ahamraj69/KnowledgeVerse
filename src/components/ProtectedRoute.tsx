import { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../context/AuthContext";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0F172A",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}