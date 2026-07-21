import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import UploadProgress from "./UploadProgress";

interface UploadCardProps {
  title: string;
  progress: number;
  uploaded: boolean;
  onPick: () => void;
}

export default function UploadCard({ title, progress, uploaded, onPick }: UploadCardProps) {
  return (
    <View style={[styles.card, uploaded && styles.successCard]}>
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{uploaded ? "✅ Asset Cached Successfully" : "Accepted extensions: .jpg, .png, .pdf"}</Text>
      </View>
      
      {progress > 0 && progress < 100 ? (
        <UploadProgress progress={progress} />
      ) : (
        <TouchableOpacity style={[styles.pickBtn, uploaded && styles.repickBtn]} onPress={onPick} activeOpacity={0.8}>
          <Text style={styles.pickBtnText}>{uploaded ? "Change" : "Upload File"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  successCard: { borderColor: "rgba(16,185,129,0.25)", backgroundColor: "rgba(16,185,129,0.02)" },
  textColumn: { flex: 1, paddingRight: 12 },
  title: { color: "white", fontSize: 15, fontWeight: "bold" },
  sub: { color: "#6B7280", fontSize: 12, marginTop: 4 },
  pickBtn: { backgroundColor: "#2563EB", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  repickBtn: { backgroundColor: "#1F2937" },
  pickBtnText: { color: "white", fontSize: 13, fontWeight: "bold" }
});
