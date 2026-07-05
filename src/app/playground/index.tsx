import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import CodeEditor from "../../components/CodeEditor";
import OutputConsole from "../../components/OutputConsole";
import { useLoading } from "../../context/LoadingContext";
import { runCode } from "../../services/playgroundService";
import { Colors } from "../../theme/colors"; // ✅ Added Theme
import { Theme } from "../../theme/theme"; // ✅ Added Theme

export default function PlaygroundScreen() {
  const [code, setCode] = useState(
    `console.log("Hello KnowledgeVerse 🚀");`
  );

  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | undefined>();
  
  const { setLoading } = useLoading();

  const templates = {
    hello: `console.log("Hello World 🚀");`,

    loop: `for (let i = 1; i <= 5; i++) {
  console.log("Count:", i);
}`,

    sum: `function sum(a, b) {
  return a + b;
}

console.log(sum(5, 10));`,
  };

  const executeCode = async () => {
    try {
      setLoading(true);
      setOutput("");
      setError(undefined);

      const result = await runCode(code);

      setOutput(result.output);
      setError(result.error);
    } catch (e: any) {
      console.log(e);
      setError("Execution failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={Theme.screen} // ✅ Swapped configuration rule here
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
    >
      {/* Title */}
      <Text
        style={[
          Theme.text, // ✅ Swapped configuration rule here
          {
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 15,
          },
        ]}
      >
        💻 Coding Playground
      </Text>

      {/* Control Actions & Snippet Templates */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        {/* Reset */}
        <TouchableOpacity
          onPress={() => setCode("")}
          style={{
            backgroundColor: Colors.border, // ✅ Token applied
            padding: 10,
            borderRadius: 8,
            flex: 1,
            marginRight: 5,
            alignItems: "center",
          }}
        >
          <Text style={Theme.text}>Resets 🧹</Text>
        </TouchableOpacity>

        {/* Hello Template */}
        <TouchableOpacity
          onPress={() => setCode(templates.hello)}
          style={{
            backgroundColor: Colors.card, // ✅ Token applied
            padding: 10,
            borderRadius: 8,
            flex: 1,
            marginHorizontal: 5,
            alignItems: "center",
          }}
        >
          <Text style={Theme.text}>👋 Hello</Text>
        </TouchableOpacity>

        {/* Loop Template */}
        <TouchableOpacity
          onPress={() => setCode(templates.loop)}
          style={{
            backgroundColor: Colors.card, // ✅ Token applied
            padding: 10,
            borderRadius: 8,
            flex: 1,
            marginLeft: 5,
            alignItems: "center",
          }}
        >
          <Text style={Theme.text}>🔁 Loop</Text>
        </TouchableOpacity>
      </View>

      {/* Code Editor UI element */}
      <CodeEditor value={code} onChange={setCode} />

      {/* Run Code Execution Button */}
      <TouchableOpacity
        onPress={executeCode}
        style={{
          backgroundColor: Colors.primary, // ✅ Token applied
          padding: 14,
          borderRadius: 12,
          marginTop: 15,
          alignItems: "center",
        }}
      >
        <Text
          style={[
            Theme.text,
            {
              fontWeight: "bold",
              fontSize: 16,
            },
          ]}
        >
          ▶ Run Code
        </Text>
      </TouchableOpacity>

      {/* Output Terminal Console */}
      <OutputConsole output={output} error={error} />
    </ScrollView>
  );
}