import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import VideoPlayer from "../../components/VideoPlayer";
import { hasAccess } from "../../services/accessService";
import { sendNotification } from "../../services/notificationService";
import { payForCourse } from "../../services/razorpayService";
import { addToWishlist } from "../../services/wishlistService";

export default function CourseDetail() {
  const { id } = useLocalSearchParams();

  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const result = await hasAccess(id as string);
      setAccess(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const buyCourse = async () => {
    try {
      await payForCourse(
        499,
        id as string,
        "teacher_123"
      );

      await sendNotification(
        "🎉 Course Purchased",
        "Your course has been unlocked successfully."
      );

      Alert.alert(
        "Success",
        "Course Purchased Successfully!"
      );

      setAccess(true);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Payment Failed",
        "Unable to complete payment."
      );
    }
  };

  const wishlist = async () => {
    try {
      await addToWishlist(id as string);

      Alert.alert(
        "Wishlist",
        "Course added successfully ❤️"
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Could not add course."
      );
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0B1220",
        }}
      >
        <Text style={{ color: "white" }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
        }}
      >
        📚 Course Details
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 12,
          marginBottom: 30,
        }}
      >
        Learn with AI-powered lessons and practical projects.
      </Text>

      {!access && (
        <>
          <TouchableOpacity
            onPress={wishlist}
            style={{
              backgroundColor: "#DC2626",
              padding: 15,
              borderRadius: 12,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              ❤️ Add to Wishlist
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={buyCourse}
            style={{
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
              }}
            >
              💳 Buy Course ₹499
            </Text>
          </TouchableOpacity>
        </>
      )}

      {access && (
        <View
          style={{
            marginTop: 25,
          }}
        >
          <VideoPlayer
            uri="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          />

          <Text
            style={{
              color: "#10B981",
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 20,
            }}
          >
            🎉 Course Unlocked
          </Text>

          <Text
            style={{
              color: "#9CA3AF",
              marginTop: 10,
            }}
          >
            Enjoy your lessons and continue learning.
          </Text>
        </View>
      )}
    </View>
  );
}