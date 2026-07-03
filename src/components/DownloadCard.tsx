import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { DownloadItem } from "../services/downloadService";

interface Props {
  item: DownloadItem;
  onOpen: (lessonId: string) => void;
  onDelete: (lessonId: string) => Promise<void>;
}

export default function DownloadCard({
  item,
  onOpen,
  onDelete,
}: Props) {
  const confirmDelete = () => {
    Alert.alert(
      "Delete Download",
      "Do you want to remove this offline lesson?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await onDelete(item.lessonId);
          },
        },
      ]
    );
  };

  const date = new Date(
    item.downloadedAt
  ).toLocaleDateString();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        📥 {item.lessonTitle}
      </Text>

      <Text style={styles.sub}>
        Downloaded: {date}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.openBtn}
          onPress={() => onOpen(item.lessonId)}
        >
          <Text style={styles.text}>
            ▶ Open
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={confirmDelete}
        >
          <Text style={styles.text}>
            🗑 Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F2937",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  sub: {
    color: "#9CA3AF",
    marginTop: 8,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },

  openBtn: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: "#DC2626",
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
  },

  text: {
    color: "white",
    fontWeight: "bold",
  },
});