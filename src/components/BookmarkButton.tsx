import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
// ✅ FIXED: Re-pointed to the clean core bookmarkService exports
import { bookmarkLesson, isLessonBookmarked, removeBookmark } from "@/lib/bookmarkService";

interface BookmarkButtonProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
}

export default function BookmarkButton({ courseId, lessonId, lessonTitle }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function checkState() {
      if (!user?.uid || !lessonId) return;
      const res = await isLessonBookmarked(user.uid, lessonId);
      setBookmarked(res);
    }
    checkState();
  }, [user, lessonId]);

  const handleToggle = async () => {
    if (!user?.uid) return;
    
    if (bookmarked) {
      await removeBookmark(user.uid, lessonId);
      setBookmarked(false);
    } else {
      // ✅ FIXED: Calling bookmarkLesson with clear, linear string parameter fields [INDEX]
      await bookmarkLesson(user.uid, lessonId, courseId, lessonTitle);
      setBookmarked(true);
    }
  };

  return (
    <TouchableOpacity style={[styles.btn, bookmarked && styles.active]} onPress={handleToggle}>
      <Text style={styles.text}>{bookmarked ? "🔖 Bookmarked" : "🔖 Save Lesson"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 12, backgroundColor: "#111827", borderRadius: 10, alignItems: "center", justifyContent: "center", minHeight: 44, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  active: { backgroundColor: "rgba(56,189,248,0.15)", borderColor: "#38BDF8" },
  text: { color: "white", fontSize: 14, fontWeight: "600" }
});
