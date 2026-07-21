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
import { deleteCourse } from "@/lib/deleteCourseService";
import { publishCourse } from "@/lib/publishCourseService";
import { Colors } from "../../theme/colors";
import { Theme } from "../../theme/theme";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: "draft" | "published"; 
}

export default function MyCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");

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
          status: fields.status || "draft",
        };
      }) as Course[];

      setCourses(data);
    } catch (error) {
      console.log("Error loading dashboard courses feed list:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (filter === "all") return true;
    return course.status === filter;
  });

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
          onPress: async () => {
            try {
              setDeletingId(courseId);
              await deleteCourse(courseId);

              // ✅ Step 3: Refresh after Delete to pull down fresh Firestore configurations
              await loadCourses();

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

  const publish = async (courseId: string) => {
    try {
      await publishCourse(courseId);

      // ✅ Step 2: Refresh after Publish to pull down updated data directly from the server
      await loadCourses();

      Alert.alert(
        "Success",
        "Course published successfully."
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Unable to publish course."
      );
    }
  };

  if (loading && courses.length === 0) {
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
      data={filteredCourses}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <>
          <Text
            style={[
              Theme.text,
              {
                fontSize: 30,
                fontWeight: "bold",
                marginBottom: 5,
              },
            ]}
          >
            📖 My Courses
          </Text>

          {/* Multi-segment quick action pill filter row widget */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            {["all", "draft", "published"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setFilter(item as "all" | "draft" | "published")}
                style={{
                  backgroundColor: filter === item ? "#2563EB" : "#374151",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[Theme.muted, { marginBottom: 25, fontSize: 15 }]}>
            Select an action below to manage, edit, publish or remove a course.
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

          {/* ✅ Step 1: Upgraded Draft / Published visual Badge row container */}
          <View
            style={{
              marginTop: 10,
              alignSelf: "flex-start",
              backgroundColor: item.status === "published" ? "#14532D" : "#78350F",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              {item.status === "published" ? "🟢 Published" : "🟡 Draft"}
            </Text>
          </View>

          {/* Action Row Grid Flow Container */}
          <View style={{ flexDirection: "row", marginTop: 20, flexWrap: "wrap", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/teacher/add-lesson",
                  params: { courseId: item.id },
                })
              }
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
                marginRight: 10,
                marginBottom: 10,
              }}
              disabled={deletingId !== null}
            >
              <Text style={[Theme.text, { fontWeight: "bold" }]}>
                ➕ Manage Lessons
              </Text>
            </TouchableOpacity>

            {item.status === "draft" && (
              <TouchableOpacity
                onPress={() => publish(item.id)}
                disabled={deletingId !== null}
                style={{
                  backgroundColor: "#16A34A",
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  🚀 Publish Course
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => removeCourse(item.id)}
              disabled={deletingId !== null}
              style={{
                backgroundColor: "#DC2626",
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
                marginRight: 10,
                marginBottom: 10,
                opacity: deletingId !== null ? 0.6 : 1,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {deletingId === item.id ? "Deleting..." : "🗑 Delete Course"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/teacher/edit-course" as any,
                  params: { courseId: item.id },
                })
              }
              style={{
                backgroundColor: Colors.border,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
                marginBottom: 10,
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
        <Text style={[Theme.muted, { textAlign: "center", marginTop: 80, fontSize: 16 }]}>
          No {filter !== "all" ? filter : ""} courses found.
        </Text>
      )}
    />
  );
}
