// Native-only theme configuration

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: "#2563EB",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#2563EB",
  },

  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#60A5FA",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#60A5FA",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Fonts = {
  regular: "System",
  medium: "System",
  bold: "System",
};

export const MaxContentWidth = 900;

export const BottomTabInset = 24;

export type ThemeColor = keyof typeof Colors.light;

export const Theme = {
  screen: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  text: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  muted: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  primary: "#2563EB",
  success: "#10B981",
  warning: "#D97706",
  danger: "#EF4444",
};