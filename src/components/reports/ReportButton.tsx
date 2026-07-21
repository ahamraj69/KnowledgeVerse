import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ReportType } from "@/types/report";

interface ReportButtonProps {
  targetId: string;
  targetType: ReportType;
}

export default function ReportButton({ targetId, targetType }: ReportButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.btn} 
      onPress={() => router.push(`/reports/${targetId}?type=${targetType}` as any)}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>🚩 Report</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "rgba(239,68,68,0.08)", borderRadius: 8, borderWidth: 1, borderColor: "rgba(239,68,68,0.2)", alignSelf: "flex-start" },
  text: { color: "#EF4444", fontSize: 13, fontWeight: "600" }
});
