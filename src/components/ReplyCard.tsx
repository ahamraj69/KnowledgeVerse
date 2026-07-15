import { DiscussionReply } from "@/services/discussionService";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  reply: DiscussionReply;
}

export default function ReplyCard({
  reply,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        reply.teacher && styles.teacherCard,
      ]}
    >
      <Text style={styles.name}>
        {reply.teacher ? "👨‍🏫 " : "👤 "}
        {reply.userName}
      </Text>

      <Text style={styles.message}>
        {reply.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  teacherCard: {
    borderWidth: 1,
    borderColor: "#2563EB",
  },

  name: {
    color: "#60A5FA",
    fontWeight: "bold",
    marginBottom: 6,
  },

  message: {
    color: "white",
  },
});