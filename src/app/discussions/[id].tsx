import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import ReplyCard from "@/components/ReplyCard";
import { useAuth } from "@/context/AuthContext";
import {
    addReply,
    DiscussionReply,
    subscribeReplies,
} from "@/services/discussionService";

const COURSE_ID = "general";

export default function DiscussionDetails() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState<DiscussionReply[]>([]);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeReplies(
      COURSE_ID,
      id as string,
      (items) => setReplies(items)
    );

    return () => unsubscribe();
  }, [id]);

  const sendReply = useCallback(async () => {
    const cleanReply = reply.trim();
    if (!user || !cleanReply) return;

    try {
      const isTeacher = (user as any).role === "teacher" || (user as any).role === "instructor";

      await addReply(
        COURSE_ID,
        id as string,
        {
          discussionId: id as string,
          userId: user.uid,
          userName: user.displayName || "Student",
          message: cleanReply,
          teacher: isTeacher,
        }
      );

      setReply("");
    } catch (error) {
      Alert.alert("Reply Failed", "Could not synchronize message text stream. Please try again.");
    }
  }, [user, reply, id]);

  return (
    <View style={styles.container}>
      <FlatList
        data={replies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReplyCard reply={item} />
        )}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.bottom}>
        {/* ✅ FIXED: Removed duplicate style attribute properties to prevent compilation blockers */}
        <TextInput
          placeholder="Write a reply..."
          placeholderTextColor="#9CA3AF"
          value={reply}
          onChangeText={setReply}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={sendReply}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220"
  },
  listContent: {
    padding: 16,
  },
  bottom: {
    padding: 16
  },
  input: {
    backgroundColor: "#1F2937",
    color: "white",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    fontSize: 16
  },
  button: {
    backgroundColor: "#2563EB",
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  }
});
