import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import { loadMessages, saveMessage } from "../services/chatService";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

const API_URL = "http://10.215.179.23:5000/chat";

export default function AiScreen() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "👋 Hi! I am your AI Tutor. Ask me anything.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // 📥 Load Firebase chat (per user)
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      const data = await loadMessages();

      const formatted: Message[] = data.map((m: any) => ({
        id: m.id,
        role: m.role,
        text: m.text,
      }));

      if (formatted.length > 0) {
        setMessages(formatted);
      }
    };

    fetchMessages();
  }, [user]);

  // 📍 Auto scroll
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // 🟡 typing dots animation
  useEffect(() => {
    if (typing) {
      const loop = (dot: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();

      loop(dot1, 0);
      loop(dot2, 200);
      loop(dot3, 400);
    }
  }, [typing]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !user) return;

    const userText = input;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
    };

    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          message: userText,
          history: updated.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "No response";

      const aiMsg: Message = {
        id: Date.now().toString() + "_ai",
        role: "ai",
        text: aiReply,
      };

      const final = [...updated, aiMsg];

      setMessages(final);

      // 💾 Save to Firebase (AI memory)
      await saveMessage(userText, aiReply);
    } catch (err) {
      console.log(err);

      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        text: "❌ AI error. Please try again.",
      };

      setMessages([...updated, errorMsg]);
    }

    setTyping(false);
    setLoading(false);
  };

  const Dot = ({ anim }: { anim: Animated.Value }) => (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -4],
              }),
            },
          ],
        },
      ]}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🤖 AI Tutor</Text>
      </View>

      {/* CHAT */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chat}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={
                item.role === "user" ? styles.userText : styles.aiText
              }
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* TYPING */}
      {typing && (
        <View style={styles.typingBox}>
          <Text style={styles.typingText}>AI is typing</Text>
          <View style={styles.dotsRow}>
            <Dot anim={dot1} />
            <Dot anim={dot2} />
            <Dot anim={dot3} />
          </View>
        </View>
      )}

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask anything..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.5 }]}
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },

  header: {
    paddingTop: 55,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: "#111C33",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  chat: {
    padding: 12,
    paddingBottom: 20,
  },

  bubble: {
    padding: 12,
    borderRadius: 14,
    marginVertical: 6,
    maxWidth: "85%",
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#2563EB",
  },

  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#1F2937",
  },

  userText: { color: "#fff", fontSize: 16 },
  aiText: { color: "#E5E7EB", fontSize: 16 },

  inputRow: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#111C33",
  },

  input: {
    flex: 1,
    backgroundColor: "#1F2937",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
  },

  button: {
    marginLeft: 10,
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 10,
  },

  typingBox: {
    flexDirection: "row",
    padding: 10,
  },

  typingText: { color: "#9CA3AF", marginRight: 8 },

  dotsRow: { flexDirection: "row" },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9CA3AF",
    marginHorizontal: 2,
  },
});