import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { pickAndUploadVideo } from "../../services/videoUploadService";

export default function UploadVideo() {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const upload = async () => {
    try {
      setLoading(true);

      const url = await pickAndUploadVideo();

      if (url) {
        setVideoUrl(url);

        Alert.alert(
          "Success",
          "Video uploaded successfully."
        );
      }
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Video upload failed."
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
      <TouchableOpacity
        onPress={upload}
        style={{
          backgroundColor: "#2563EB",
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
          🎥 Upload Course Video
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          color="white"
          size="large"
          style={{ marginTop: 20 }}
        />
      )}

      {videoUrl !== "" && (
        <>
          <Text
            style={{
              color: "#10B981",
              marginTop: 20,
              fontWeight: "bold",
            }}
          >
            Upload Complete
          </Text>

          <Text
            style={{
              color: "#9CA3AF",
              marginTop: 10,
            }}
          >
            {videoUrl}
          </Text>
        </>
      )}
    </View>
  );
}