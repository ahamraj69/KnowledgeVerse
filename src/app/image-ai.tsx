import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Button,
    Image,
    Text,
    View,
} from "react-native";

import { analyzeImage } from "@/lib/aiTools";

export default function ImageAI() {
  const [image, setImage] = useState<string>();
  const [result, setResult] = useState("");

  async function pickImage() {
    const picked =
      await ImagePicker.launchImageLibraryAsync();

    if (picked.canceled) return;

    const uri = picked.assets[0].uri;

    setImage(uri);

    const ai = await analyzeImage(
      uri,
      "Explain this educational image."
    );

    setResult(ai.answer);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="Choose Image"
        onPress={pickImage}
      />

      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: 300,
            height: 300,
            marginTop: 20,
          }}
        />
      )}

      <Text style={{ marginTop: 20 }}>
        {result}
      </Text>
    </View>
  );
}