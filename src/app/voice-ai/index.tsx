import Voice from "@react-native-voice/voice";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ✅ Import mapped to your existing AI backend service pipeline
import { sendMessage } from "../../services/aiService";

interface HistoryItem {
  question: string;
  answer: string;
}

export default function VoiceAIScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  /**
   * 🎛️ Part 4 — Native Hardware Speech Listener Initialization
   */
  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      if (event.value?.length) {
        setRecognizedText(event.value[0]);
      }
    };

    Voice.onSpeechError = (event) => {
      console.log("Voice Recognition Operational Error:", event);
    };

    // Clean up hardware system listeners securely upon module unmounting
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  /**
   * 🎙️ Part 4 — Start Microphone Recording Stream
   */
  const startRecording = async () => {
    try {
      setRecognizedText("");
      setIsRecording(true);
      await Voice.start("en-US");
    } catch (error) {
      console.log("Recording Init Error:", error);
      setIsRecording(false);
    }
  };

  /**
   * ⏹️ Part 4 — Stop Microphone Recording & Dispatch Spoken Data Node
   */
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);

      const spokenText = recognizedText.trim();
      if (!spokenText) return;

      setTranscript(spokenText);
      await askAI(spokenText);
    } catch (error) {
      console.log("Recording Destruct Error:", error);
    }
  };

  /**
   * 🧠 Part 3 & 5 — Connect Voice Tutor to AI Backend Pipeline
   */
  const askAI = async (message: string) => {
    try {
      setIsLoading(true);
      setAiReply(""); // Clear previous responses terminal screen

      const reply = await sendMessage(message);
      
      setAiReply(reply);
      
      // Cache conversation node to history list state container
      setHistory((prev) => [
        {
          question: message,
          answer: reply,
        },
        ...prev,
      ]);

      // Automatically announce AI reply aloud after arrival
      autoSpeakReply(reply);
    } catch (error) {
      console.log("AI Pipeline Query Error:", error);
      Alert.alert("Error", "Unable to contact AI.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🔊 Part 2 — Trigger Synthetic Speech Playback Engine
   */
  const speakReply = () => {
    if (!aiReply) return;
    autoSpeakReply(aiReply);
  };

  const autoSpeakReply = (textToVoice: string) => {
    // ✅ Change 2: Prevent concurrent playback overlapping
    Speech.stop();

    setIsSpeaking(true);

    Speech.speak(textToVoice, {
      language: "en-US",
      rate: 0.95,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  /**
   * 🗑️ Part 5 — Flush Active Conversational History Data Nodes
   */
  const clearConversation = () => {
    // ✅ Change 3: Halt native hardware audio feeds upon flush request
    Speech.stop();

    setTranscript("");
    setRecognizedText("");
    setAiReply("");
    setHistory([]);
    setIsSpeaking(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Title Segment (Part 1 Layout Header) */}
      <Text style={styles.title}>🎤 AI Voice Tutor</Text>
      <Text style={styles.subtitle}>
        Talk with your AI teacher using your voice.
      </Text>

      {/* User Speech Transcript Container Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Speech</Text>
        <Text style={styles.textBox}>
          {transcript || "Start recording to speak..."}
        </Text>
      </View>

      {/* Part 4 — Live Speech Intermediate Telemetry Box */}
      <View style={styles.liveMonitorBox}>
        <Text style={styles.liveMonitorTitle}>Live Speech</Text>
        <Text style={styles.liveMonitorValue}>
          {recognizedText || "Waiting for speech..."}
        </Text>
      </View>

      {/* Part 5 — AI Pipeline Engine Realtime Status Indicators */}
      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text
          style={[
            styles.statusValue,
            { color: isLoading ? "#FACC15" : "#22C55E" },
          ]}
        >
          {isLoading ? "🤖 AI is thinking..." : "✅ Ready"}
        </Text>
      </View>

      {/* Primary Current Response Dashboard Container */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>AI Response</Text>
        <Text style={styles.textBox}>
          {aiReply || "AI response will appear here."}
        </Text>
      </View>

      {/* Part 1 Loading Widget Spinner System */}
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      {/* Part 2 — Primary Unified Record Functional Action Trigger */}
      <TouchableOpacity
        disabled={isLoading} // ✅ Change 1: Freeze interaction loops while AI evaluates answers
        onPress={isRecording ? stopRecording : startRecording}
        style={[
          styles.button,
          { 
            backgroundColor: isRecording ? "#DC2626" : "#2563EB",
            opacity: isLoading ? 0.6 : 1 
          },
        ]}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "⏹ Stop Recording" : "🎙 Start Recording"}
        </Text>
      </TouchableOpacity>

      {/* Part 2 — Unified Audio Playback Translation Action Trigger */}
      <TouchableOpacity
        onPress={speakReply}
        disabled={!aiReply || isLoading}
        style={[
          styles.button,
          {
            backgroundColor: "#7C3AED",
            marginTop: 15,
            opacity: aiReply && !isLoading ? 1 : 0.5,
          },
        ]}
      >
        <Text style={styles.buttonText}>
          {isSpeaking ? "🔊 Speaking..." : "🔊 Speak AI Reply"}
        </Text>
      </TouchableOpacity>

      {/* Part 5 — Flush Context Conversation Action Trigger */}
      <TouchableOpacity
        onPress={clearConversation}
        style={[styles.button, styles.clearButton]}
      >
        <Text style={styles.buttonText}>🗑 Clear Conversation</Text>
      </TouchableOpacity>

      {/* Part 5 — Persistent Past Context Conversation Ledger History Grid */}
      {history.length > 0 && (
        <>
          <Text style={styles.historyHeading}>Conversation History</Text>

          {history.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <Text style={styles.historyUserLabel}>You:</Text>
              <Text style={styles.historyUserText}>{item.question}</Text>

              <Text style={styles.historyAiLabel}>AI:</Text>
              <Text style={styles.historyAiText}>{item.answer}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 25,
    fontSize: 15,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 15,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#FACC15",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  textBox: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
  },
  liveMonitorBox: {
    marginTop: 5,
    padding: 15,
    backgroundColor: "#111827",
    borderRadius: 12,
    marginBottom: 18,
  },
  liveMonitorTitle: {
    color: "#9CA3AF",
    marginBottom: 8,
    fontSize: 14,
  },
  liveMonitorValue: {
    color: "white",
    fontSize: 16,
  },
  statusBox: {
    marginTop: 5,
    marginBottom: 15,
  },
  statusLabel: {
    color: "#9CA3AF",
    fontSize: 15,
  },
  statusValue: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#EF4444",
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  loading: {
    alignItems: "center",
    marginBottom: 20,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  historyHeading: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  historyUserLabel: {
    color: "#60A5FA",
    fontWeight: "bold",
  },
  historyUserText: {
    color: "white",
    marginBottom: 12,
    marginTop: 4,
  },
  historyAiLabel: {
    color: "#A855F7",
    fontWeight: "bold",
  },
  historyAiText: {
    color: "#E5E7EB",
    marginTop: 4,
    lineHeight: 22,
  },
});
