import { Colors } from "./colors";

export const Theme = {
  screen: {
    backgroundColor: Colors.background,
    flex: 1,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },

  text: {
    color: Colors.text,
  },

  muted: {
    color: Colors.textMuted,
  },
} as const;
