import { Video } from "expo-av";
import { View } from "react-native";

export default function VideoPlayer({ uri }: { uri: string }) {
  return (
    <View style={{ width: "100%", height: 250 }}>
      <Video
        source={{ uri }}
        useNativeControls
        resizeMode="contain"
        shouldPlay={false}
        style={{ flex: 1 }}
      />
    </View>
  );
}