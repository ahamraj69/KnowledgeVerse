import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { BrandColors } from "@/theme/colors";
import { Typography } from "@/theme/theme";

interface CelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  celebrationText: string;
  subText?: string;
}

export default function CelebrationModal({ visible, onClose, celebrationText, subText }: CelebrationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.darkOverlayBackdrop}>
        <View style={styles.modalPanelBox}>
          <Text style={styles.emojiBurst}>✨ 🏆 ✨</Text>
          <Text style={[Typography.heading, styles.headlineText]}>Amazing Work!</Text>
          <Text style={[Typography.subheading, styles.accentDetailText]}>{celebrationText.toUpperCase()}</Text>
          {subText ? <Text style={[Typography.body, styles.descriptionText]}>{subText}</Text> : null}

          <TouchableOpacity style={styles.dismissBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.dismissBtnText}>Continue Growing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  darkOverlayBackdrop: { flex: 1, backgroundColor: "rgba(11,18,32,0.85)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalPanelBox: { width: "100%", backgroundColor: "#111827", borderRadius: 24, padding: 28, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  emojiBurst: { fontSize: 42, marginBottom: 12 },
  headlineText: { color: "white", textAlign: "center", marginBottom: 6 },
  accentDetailText: { color: "#38BDF8", textAlign: "center", fontWeight: "800", letterSpacing: 0.5, marginBottom: 14 },
  descriptionText: { color: BrandColors.textMutedDark, textAlign: "center", marginBottom: 24, lineHeight: 20 },
  dismissBtn: { backgroundColor: BrandColors.primary, paddingVertical: 14, width: "100%", borderRadius: 12, alignItems: "center" },
  dismissBtnText: { color: "white", fontWeight: "bold", fontSize: 15 }
});
