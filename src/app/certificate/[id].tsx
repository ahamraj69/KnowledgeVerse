import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

import { useAuth } from "../../context/AuthContext";
import {
  Certificate,
  getCertificate,
} from "../../services/certificateService";
import { generateCertificatePdf } from "../../services/pdfCertificateService";

export default function CertificateScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [certificate, setCertificate] =
    useState<Certificate | null>(null);

  const [loading, setLoading] = useState(true);
  const [pdfUri, setPdfUri] = useState("");

  useEffect(() => {
    loadCertificate();
  }, []);

  const loadCertificate = async () => {
    if (!user || !id) {
      setLoading(false);
      return;
    }

    try {
      const data = await getCertificate(
        user.uid,
        id as string
      );

      setCertificate(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const createPdf = async () => {
    if (!certificate) return "";

    if (pdfUri) return pdfUri;

    const uri = await generateCertificatePdf(certificate);

    setPdfUri(uri);

    return uri;
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="white" size="large" />

        <Text
          style={{
            color: "white",
            marginTop: 15,
          }}
        >
          Loading Certificate...
        </Text>
      </View>
    );
  }

  if (!certificate) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
          padding: 25,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 28,
          }}
        >
          🏆
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 20,
          }}
        >
          No Certificate Found
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Complete the course to unlock your certificate.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
      }}
      contentContainerStyle={{
        padding: 25,
      }}
    >
      <View
        style={{
          backgroundColor: "#1E3A8A",
          borderRadius: 20,
          padding: 25,
        }}
      >
        <Text
          style={{
            color: "gold",
            fontSize: 34,
            textAlign: "center",
          }}
        >
          🏆
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Certificate of Completion
        </Text>

        <Text
          style={{
            color: "#D1D5DB",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          This certifies that
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {certificate.studentName}
        </Text>

        <Text
          style={{
            color: "#D1D5DB",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          has successfully completed
        </Text>

        <Text
          style={{
            color: "#FACC15",
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {certificate.courseName}
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            textAlign: "center",
            marginTop: 25,
          }}
        >
          Completion Date
        </Text>

        <Text
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 8,
            fontWeight: "bold",
          }}
        >
          {certificate.completedAt?.toDate
            ? certificate.completedAt
                .toDate()
                .toLocaleDateString()
            : "Pending"}
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Certificate ID
        </Text>

        <Text
          style={{
            color: "#FACC15",
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 5,
          }}
        >
          {certificate.id}
        </Text>

        <View
          style={{
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <QRCode
            value={certificate.id}
            size={130}
          />

          <Text
            style={{
              color: "#9CA3AF",
              marginTop: 12,
            }}
          >
            Scan to verify
          </Text>
        </View>

        <View
          style={{
            marginTop: 35,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 22,
            }}
          >
            ✍️
          </Text>
        </View>

        <TouchableOpacity
          onPress={async () => {
            try {
              const uri = await createPdf();

              Alert.alert(
                "PDF Generated",
                uri
              );
            } catch (e) {
              console.log(e);
            }
          }}
          style={{
            marginTop: 30,
            backgroundColor: "#2563EB",
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 17,
            }}
          >
            📄 Generate PDF
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            try {
              const uri = await createPdf();

              Alert.alert(
                "Success",
                "Certificate saved successfully."
              );
            } catch (e) {
              console.log(e);
            }
          }}
          style={{
            marginTop: 15,
            backgroundColor: "#059669",
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 17,
            }}
          >
            💾 Download Certificate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            try {
              const uri = await createPdf();

              const available =
                await Sharing.isAvailableAsync();

              if (!available) {
                Alert.alert(
                  "Sharing Not Available"
                );
                return;
              }

              await Sharing.shareAsync(uri);
            } catch (e) {
              console.log(e);
            }
          }}
          style={{
            marginTop: 15,
            backgroundColor: "#7C3AED",
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 17,
            }}
          >
            📤 Share Certificate
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );      
}