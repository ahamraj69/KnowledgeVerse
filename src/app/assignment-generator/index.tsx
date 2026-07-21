import { useState } from "react";
import {
    Button,
    Text,
    TextInput,
    View,
} from "react-native";

import { generateAssignment } from "@/lib/aiTools";

export default function AssignmentGenerator() {
  const [topic, setTopic] = useState("");
  const [assignment, setAssignment] = useState("");

  async function createAssignment() {
    const res =
      await generateAssignment(
        topic,
        "Class 8"
      );

    setAssignment(res.assignment);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Topic"
        value={topic}
        onChangeText={setTopic}
      />

      <Button
        title="Generate"
        onPress={createAssignment}
      />

      <Text>{assignment}</Text>
    </View>
  );
}