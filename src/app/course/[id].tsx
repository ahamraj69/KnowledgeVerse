import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import VideoPlayer from "../../components/VideoPlayer";
import { hasAccess } from "../../services/accessService";
import { payForCourse } from "../../services/razorpayService";

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const [access, setAccess] = useState(false);

  useEffect(() => {
    const check = async () => {
      const res = await hasAccess(id as string);
      setAccess(res);
    };
    check();
  }, []);

  const buy = async () => {
    try {
      await payForCourse(499, id as string, "teacher_123");
      setAccess(true);
    } catch (e) {
      console.log("Payment failed");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1220", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 22 }}>
        📚 Course
      </Text>

      {!access ? (
        <TouchableOpacity
          onPress={buy}
          style={{
            marginTop: 20,
            backgroundColor: "#2563EB",
            padding: 15,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white" }}>💳 Buy Course ₹499</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ marginTop: 20 }}>
          <VideoPlayer uri="https://your-video-url.mp4" />

          <Text style={{ color: "#9CA3AF", marginTop: 10 }}>
            🎓 Course Unlocked
          </Text>
        </View>
      )}
    </View>
  );
}