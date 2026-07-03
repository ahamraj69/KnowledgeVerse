import {
    Linking,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import VideoPlayer from "./VideoPlayer";

interface Props {
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl: string;
}

export default function CoursePlayer({
  title,
  description,
  videoUrl,
  pdfUrl,
}: Props) {
  return (
    <View>
      <View
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <VideoPlayer uri={videoUrl} />
      </View>

      <Text
        style={{
          color: "white",
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 10,
          marginBottom: 20,
          fontSize: 16,
          lineHeight: 22,
        }}
      >
        {description}
      </Text>

      <TouchableOpacity
        onPress={() => Linking.openURL(pdfUrl)}
        style={{
          backgroundColor: "#2563EB",
          padding: 15,
          borderRadius: 12,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          📄 Open Lesson PDF
        </Text>
      </TouchableOpacity>
    </View>
  );
}