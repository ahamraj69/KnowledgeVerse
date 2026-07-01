import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";

export default function ImageAI() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  // 📸 Pick image
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      // 🚀 send to AI automatically
      sendToAI(result.assets[0].base64!);
    }
  };

  // 🤖 Send image to backend
  const sendToAI = async (base64: string) => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://10.215.179.23:5000/image-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
        }),
      });

      const data = await res.json();

      setResult(data.reply);

      // 🔊 voice explanation
      Speech.stop();
      Speech.speak(data.reply, {
        language: "en",
        rate: 0.9,
      });
    } catch (err) {
      setResult("Error processing image");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🖼️ AI Image Tutor</Text>

      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={{ color: "white" }}>Upload Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading && <ActivityIndicator size="large" color="#4f46e5" />}

      {result !== "" && (
        <Text style={styles.result}>{result}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },

  btn: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },

  result: {
    marginTop: 20,
    fontSize: 16,
  },
});