import * as DocumentPicker from "expo-document-picker";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { UploadedPdf } from "@/types/pdf";

interface Props {
  file: UploadedPdf | null;
  onSelect(file: UploadedPdf): void;
}

export default function PdfUploadCard({
  file,
  onSelect,
}: Props) {
  const pickPdf = async () => {
    const result =
      await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

    if (result.canceled) return;

    const asset = result.assets[0];

    onSelect({
      id: Date.now().toString(),
      name: asset.name,
      uri: asset.uri,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={pickPdf}
      >
        <Text style={styles.buttonText}>
          📄 Select PDF
        </Text>
      </TouchableOpacity>

      {file && (
        <View style={styles.info}>
          <Text style={styles.name}>
            {file.name}
          </Text>

          <Text style={styles.ready}>
            ✔ Ready to Upload
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  info: {
    marginTop: 12,
    backgroundColor: "#1F2937",
    padding: 14,
    borderRadius: 10,
  },

  name: {
    color: "white",
    fontWeight: "bold",
  },

  ready: {
    color: "#22C55E",
    marginTop: 6,
  },
});