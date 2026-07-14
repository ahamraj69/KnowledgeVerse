import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import { db } from "@/lib/firebase";
import { Colors } from "@/theme/colors";
import { Theme } from "@/theme/theme";

type CourseCategory = "Development" | "Design" | "Business" | "Marketing";

export default function CreateCourseScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isConnected } = useNetwork();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<CourseCategory>("Development");
  const [loading, setLoading] = useState(false);

  const encodeSpreadsheet = useCallback((str: string) => {
    return str.replace(/\s+/g, "+");
  }, []);

  const handleCreateCourse = useCallback(async () => {
    const cleanTitle = title.trim();
    const cleanDesc = description.trim();
    const cleanPrice = Number(price.trim());

    if (!cleanTitle || !cleanDesc) {
      Alert.alert("Required Fields", "Please complete the title and description sections.");
      return;
    }

    // ✅ FIXED: Enforced defensive upper-bound character validation rules [INDEX]
    if (cleanTitle.length > 100) {
      Alert.alert("Title Too Long", "The course title layout parameter must be under 100 characters.");
      return;
    }

    if (cleanDesc.length > 2000) {
      Alert.alert("Description Too Long", "The course description payload framework must be under 2000 characters.");
      return;
    }

    if (isNaN(cleanPrice) || cleanPrice < 0) {
      Alert.alert("Invalid Price", "Please provide a valid numeric valuation rate.");
      return;
    }

    if (!isConnected) {
      Alert.alert("Connection Lost", "Please check your network settings before publishing a new course.");
      return;
    }

    try {
      setLoading(true);

      const coursePayload = {
        title: cleanTitle,
        description: cleanDesc,
        price: cleanPrice,
        category,
        teacherId: user?.uid || "anonymous_teacher",
        teacherName: user?.displayName || "Instructor",
        status: "published",
        thumbnail: `https://placehold.co{encodeSpreadsheet(cleanTitle)}`,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "courses"), coursePayload);

      Alert.alert("Success 🎉", "Your curriculum pipeline is now live on the catalog marketplace!");
      
      setTitle("");
      setDescription("");
      setPrice("");
      
      router.back();
    } catch (error) {
      if (__DEV__) console.log("Catalog compilation submission error:", error);
      Alert.alert("Publishing Failed", "Something went wrong. Please check your data parameters and retry.");
    } finally {
      setLoading(false);
    }
  }, [title, description, price, category, isConnected, user, router, encodeSpreadsheet]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[Theme.text, styles.mainTitle]}>➕ Publish New Course</Text>
      <Text style={[Theme.muted, styles.subtitle]}>Setup your learning material framework parameters cleanly.</Text>

      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>Course Title</Text>
        <Text style={styles.charCount}>{title.length}/100</Text>
      </View>
      <TextInput
        placeholder="e.g. Master React Native Architecture"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
        // ✅ FIXED: Enforced hardware-level character limits to block overflows [INDEX]
        maxLength={100}
        editable={!loading}
        style={styles.input}
      />

      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>Detailed Curriculum Description</Text>
        <Text style={styles.charCount}>{description.length}/2000</Text>
      </View>
      <TextInput
        placeholder="Outline core lecture items, target skills, and project blocks..."
        placeholderTextColor="#9CA3AF"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        // ✅ FIXED: Enforced hardware-level character limits to block overflows [INDEX]
        maxLength={2000}
        editable={!loading}
        style={[styles.input, styles.textArea]}
      />

      <Text style={styles.fieldLabel}>Tuition Pricing Rate (INR)</Text>
      <TextInput
        placeholder="e.g. 499"
        placeholderTextColor="#9CA3AF"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        editable={!loading}
        style={styles.input}
      />

      <Text style={styles.fieldLabel}>Category Track Segment</Text>
      <View style={styles.categoryRow}>
        {(["Development", "Design", "Business", "Marketing"] as CourseCategory[]).map((cat) => (
          <TouchableOpacity
            key={cat}
            disabled={loading}
            onPress={() => setCategory(cat)}
            style={[styles.catBadge, category === cat && styles.catBadgeActive]}
          >
            <Text style={[styles.catBadgeText, category === cat && styles.catBadgeTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        disabled={loading}
        onPress={handleCreateCourse}
        style={[styles.submitButton, { opacity: loading ? 0.6 : 1 }]}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Launch Curriculum Stream</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  content: { padding: 20, paddingBottom: 40 },
  mainTitle: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 28 },
  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: 4 },
  fieldLabel: { color: "white", fontSize: 15, fontWeight: "600" },
  charCount: { color: "#9CA3AF", fontSize: 12, fontWeight: "500" },
  input: { backgroundColor: "#111827", color: "white", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 16, marginBottom: 20 },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 32 },
  catBadge: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#1E293B", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  catBadgeActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catBadgeText: { color: "#9CA3AF", fontWeight: "600", fontSize: 14 },
  catBadgeTextActive: { color: "white" },
  submitButton: { backgroundColor: Colors.success, padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", minHeight: 54, marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 17 }
});
