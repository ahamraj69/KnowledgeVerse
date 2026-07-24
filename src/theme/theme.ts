import { StyleSheet, TextStyle } from "react-native";
import { BrandColors } from "./colors";

interface TypographyHierarchy {
  heading: TextStyle;
  subheading: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  button: TextStyle;
}

export const Typography: TypographyHierarchy = {
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 0.25,
    lineHeight: 34
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.15,
    lineHeight: 22
  },
  body: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
    lineHeight: 20
  },
  caption: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    lineHeight: 16
  },
  button: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
    lineHeight: 20
  }
};

export const Theme = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BrandColors.backgroundDark
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  // ✅ FIXED: Appended universal base classes used across the application workspace [INDEX]
  text: {
    color: BrandColors.textDark,
    fontSize: 14,
    fontWeight: "500"
  },
  muted: {
    color: BrandColors.textMutedDark,
    fontSize: 13,
    fontWeight: "400"
  }
});
