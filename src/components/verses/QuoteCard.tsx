import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LearningQuote } from "@/data/quotes";
import { BrandColors } from "@/theme/colors";

export default function QuoteCard({ quote }: { quote: LearningQuote }) {
  return (
    <View style={styles.card}>
      <Text style={styles.quoteMark}>“</Text>
      <Text style={styles.quoteText}>{quote.quote}</Text>
      <Text style={styles.authorText}>— {quote.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "rgba(56,189,248,0.02)", padding: 18, borderRadius: 16, borderStyle: "dashed", borderWidth: 1, borderColor: "rgba(56,189,248,0.2)", marginBottom: 14, position: "relative" },
  quoteMark: { color: "rgba(56,189,248,0.15)", fontSize: 48, fontFamily: "serif", position: "absolute", left: 12, top: -4 },
  quoteText: { color: "#CBD5E1", fontSize: 14, lineHeight: 22, fontWeight: "500", fontStyle: "italic", paddingLeft: 12, paddingRight: 6 },
  authorText: { color: "#38BDF8", fontSize: 12, textAlign: "right", marginTop: 8, fontWeight: "700", letterSpacing: 0.2 }
});
