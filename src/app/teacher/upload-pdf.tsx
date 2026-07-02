import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { pickAndUploadPDF } from "../../services/pdfUploadService";

export default function UploadPDF() {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const uploadPDF = async () => {
    try {
      setLoading(true);

      const url = await pickAndUploadPDF();

      if (url) {
        setPdfUrl(url);

        Alert.alert(
          "Success",
          "PDF uploaded successfully!"
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Failed to upload PDF."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        📄 Upload PDF Notes
      </Text>

      <TouchableOpacity
        onPress={uploadPDF}
        style={{
          backgroundColor: "#F59E0B",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Choose PDF
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="white"
          style={{ marginTop: 25 }}
        />
      )}

      {pdfUrl !== "" && (
        <>
          <Text
            style={{
              color: "#10B981",
              marginTop: 30,
              fontWeight: "bold",
            }}
          >
            Upload Successful
          </Text>

          <Text
            style={{
              color: "#9CA3AF",
              marginTop: 10,
            }}
          >
            {pdfUrl}
          </Text>
        </>
      )}
    </View>
  );
}