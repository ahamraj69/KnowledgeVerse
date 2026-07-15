import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import { getCourses, CourseServiceType } from "@/services/courseListService";
import { addBookmark } from "@/services/bookmarkService";
import { addWishlist } from "@/services/wishlistService";
import CachedImage from "@/components/CachedImage";
import { Theme } from "@/theme/theme";
import { Colors } from "@/theme/colors";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { isConnected } = useNetwork();
  const router = useRouter();

  const [course, setCourse] = useState<CourseServiceType | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCourseDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const allCourses = await getCourses();
      const selected = allCourses.find((c) => c.id === id);
      setCourse(selected || null);
    } catch (e) {
      if (__DEV__) {
        console.log("Error extracting course profile details:", e);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCourseDetails();
  }, [loadCourseDetails]);

  // ✅ FIXED: Adapted bookmark arguments parameters to match the underlying contract definition flawlessly
  const handleBookmark = useCallback(async () => {
    if (!user || !course) {
      Alert.alert("Login Required", "Please log in to bookmark material elements.");
      return;
    }
    try {
      await addBookmark(user.uid, {
        courseId: course.id,
        lessonId: course.id,
        lessonTitle: course.title,
      });
      Alert.alert("Success", "Course added to bookmarks library modules.");
    } catch (e) {
      if (__DEV__) {
        console.log("Bookmark tracking crash loop intercepted:", e);
      }
      Alert.alert("Error", "Unable to save bookmark.");
    }
  }, [user, course]);

  const handleWishlist = useCallback(async () => {
    if (!user || !course) {
      Alert.alert(
        "Login Required",
        "Please login first."
      );
      return;
    }

    try {
      await addWishlist(user.uid, {
        courseId: course.id,
        title: course.title,
        thumbnail: course.thumbnail ?? "",
      });

      Alert.alert(
        "Success",
        "Course added to wishlist."
      );
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
      Alert.alert(
        "Error",
        "Unable to add course."
      );
    }
  }, [user, course]);

  const handleEnroll = useCallback(() => {
    if (!user) {
      router.push("/login" as any);
      return;
    }
    Alert.alert("Enrollment Hub", "Initializing secure course checkout sequence channels.");
  }, [user, router]);

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <Text style={Theme.text}>Course data target index not found.</Text>
      </View>
    );
  }

  const safeThumbnail = course.thumbnail || "https://placehold.co";
  const rawPrice = (course as any).price;
  const isFree = rawPrice === undefined || rawPrice === 0 || rawPrice === null;
  const priceText = isFree ? "Free Stream" : `₹${rawPrice}`;

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={styles.content}>
      <CachedImage uri={safeThumbnail} width="100%" height={210} borderRadius={14} />

      <Text style={[Theme.text, styles.mainTitle]}>{course.title}</Text>
      <View style={styles.metaRow}>
        <Text style={[styles.priceTag, isFree && styles.freeTag]}>{priceText}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{(course as any).category || "General"}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Curriculum Overview</Text>
      <Text style={[Theme.muted, styles.descText]}>
        {course.description || "No extensive summary guidelines provided for this curriculum stream module node yet."}
      </Text>

      <View style={styles.actionBlock}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleEnroll}>
          <Text style={styles.primaryBtnText}>Enroll in Course</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleBookmark}>
            <Text style={styles.secondaryBtnText}>🔖 Bookmark</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleWishlist}>
            <Text style={styles.secondaryBtnText}>❤️ Wishlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  mainTitle: { fontSize: 24, fontWeight: "bold", marginTop: 20, marginBottom: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  priceTag: { fontSize: 22, fontWeight: "800", color: "#FACC15" },
  freeTag: { color: "#10B981" },
  categoryBadge: { backgroundColor: "#1F2937", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  categoryText: { color: "#9CA3AF", fontSize: 13, fontWeight: "600" },
  sectionTitle: { color: "white", fontSize: 18, fontWeight: "700", marginBottom: 10 },
  descText: { fontSize: 15, lineHeight: 24, marginBottom: 30 },
  actionBlock: { gap: 14 },
  primaryBtn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", minHeight: 54 },
  primaryBtnText: { color: "white", fontSize: 17, fontWeight: "bold" },
  secondaryRow: { flexDirection: "row", gap: 12 },
  secondaryBtn: { flex: 1, backgroundColor: "#111827", padding: 14, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", flexDirection: "row", justifyContent: "center", gap: 6, minHeight: 48 },
  secondaryBtnText: { color: "white", fontSize: 15, fontWeight: "600" },
});
