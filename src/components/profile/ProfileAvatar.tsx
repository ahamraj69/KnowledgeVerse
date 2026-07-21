import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileAvatar({ url, name, onPress }: { url?: string; name: string; onPress: () => void; }) {
  const initial = name ? name.substring(0, 1).toUpperCase() : "S";

  return (
    <TouchableOpacity style={styles.box} onPress={onPress} activeOpacity={0.85}>
      {url ? (
        <Image source={{ uri: url }} style={styles.img} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.text}>{initial}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: { width: 90, height: 90, borderRadius: 45, overflow: "hidden", borderWidth: 2, borderColor: "#2563EB", justifyContent: "center", alignItems: "center", backgroundColor: "#1F2937" },
  img: { width: "100%", height: "100%" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  text: { color: "white", fontSize: 32, fontWeight: "bold" }
});
