import { useRouter } from "expo-router";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { db } from "../../lib/firebase";
import { deleteCourse } from "../../services/deleteCourseService";
import { Colors } from "../../theme/colors";
import { Theme } from "../../theme/theme";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

export default function MyCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ Step 1: Add a deleting state tracker for unique identifiers
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesRef = collection(db, "courses");
      const q = query(coursesRef);
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => {
        const fields = doc.data();
        return {
          id: doc.id,
          title: fields.title || "Untitled Course",
          description: fields.description || "No description provided.",
          thumbnail: fields.thumbnail || undefined,
        };
      });

      setCourses(data);
    } catch (error) {
      console.log("Error loading dashboard courses feed list:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeCourse = (courseId: string) => {
    Alert.alert(
      "Delete Course",
      "Are you sure you want to delete this course?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          // ✅ Step 2: Injected lock protection to clear background loop glitches
          onPress: async () => {
            try {
              setDeletingId(courseId);

              await deleteCourse(courseId);

              setCourses((prev) =>
                prev.filter((course) => course.id !== courseId)
              );

              Alert.alert(
                "Success",
                "Course deleted successfully."
              );
            } catch (error) {
              console.log(error);

              Alert.alert(
                "Error",
                "Failed to delete course."
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[Theme.text, { marginTop: 15, fontSize: 16 }]}>
          Loading Courses...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={Theme.screen}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
      data={courses}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <>
          <Text
            style={[
              Theme.text,
              {
                fontSize: 30,
                fontWeight: "bold",
                marginBottom: 10,
              },
            ]}
          >
            📖 My Courses
          </Text>

          <Text style={[Theme.muted, { marginBottom: 25, fontSize: 15 }]}>
            Select an action below to manage, edit, or remove a course.
          </Text>
        </>
      )}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: Colors.card,
            padding: 18,
            borderRadius: 12,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <Text style={[Theme.text, { fontSize: 20, fontWeight: "bold" }]}>
            {item.title}
          </Text>

          <Text style={[Theme.muted, { marginTop: 8, lineHeight: 20 }]}>
            {item.description}
          </Text>

          {/* Action Layout Row Container */}
          <View style={{ flexDirection: "row", marginTop: 20, flexWrap: "wrap", alignItems: "center" }}>
            {/* Manage Lessons Action Trigger */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/teacher/add-lesson",
                  params: {
                    courseId: item.id,
                  },
                })
              }
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
                marginRight: 10,
              }}
              disabled={deletingId !== null}
            >
              <Text style={[Theme.text, { fontWeight: "bold" }]}>
                ➕ Manage Lessons
              </Text>
            </TouchableOpacity>

            {/* ✅ Step 3: Text updates dynamically to block user interactions during execution re-renders */}
            <TouchableOpacity
              onPress={() => removeCourse(item.id)}
              disabled={deletingId !== null}
              style={{
                backgroundColor: "#DC2626",
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
                marginRight: 10,
                opacity: deletingId !== null ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {deletingId === item.id ? "Deleting..." : "🗑 Delete Course"}
              </Text>
            </TouchableOpacity>

            {/* Edit Course Settings Action Trigger */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/teacher/edit-course" as any,
                  params: {
                    courseId: item.id,
                  },
                })
              }
              style={{
                backgroundColor: Colors.border,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
              }}
              disabled={deletingId !== null}
            >
              <Text style={[Theme.text, { fontWeight: "bold" }]}>
                ✏️ Edit Course
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text
          style={[
            Theme.muted,
            {
              textAlign: "center",
              marginTop: 80,
              fontSize: 16,
            },
          ]}
        >
          No courses found.
        </Text>
      )}
    />
  );
}
