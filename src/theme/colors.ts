export const BrandColors = {
  // Core UI Accents Shards
  primary: "#2563EB",       // Premium Cobalt Blue for main controls & action nodes
  secondary: "#38BDF8",     // Soft Sky Blue for visual triggers and text links
  accent: "#F59E0B",        // Vivid Amber for warnings, stars, and high priority badges
  success: "#10B981",       // Fresh Emerald Green for completions & approved states
  danger: "#EF4444",        // Signal Red for rejections, deletes, and bans

  // Structural Backdrops & Surface Shards
  backgroundDark: "#0B1220",  // Deep midnight space baseline dark mode canvas
  backgroundLight: "#FFFFFF", // Crisp clinical white baseline light mode canvas
  surfaceDark: "#111827",     // Card block panels backdrop text container for dark mode
  surfaceLight: "#F3F4F6",    // Card block panels backdrop text container for light mode

  // Typography Monochromatic Grids
  textDark: "#FFFFFF",        // High contrast primary reading text for dark backgrounds
  textLight: "#111827",       // High contrast primary reading text for light backgrounds
  textMutedDark: "#9CA3AF",   // Low load utility description font for dark mode
  textMutedLight: "#4B5563"    // Low load utility description font for light mode
} as const;

// ✅ FIXED: Flattened flat fallback tokens directly on the root of the Colors constant object
export const Colors = {
  // 1. Root Level Fallback Tokens (Used directly by screens like playground, login, signup, teacher dashboards)
  primary: BrandColors.primary,
  success: BrandColors.success,
  danger: BrandColors.danger,
  accent: BrandColors.accent,
  background: BrandColors.backgroundDark,
  card: BrandColors.surfaceDark,
  border: "rgba(255,255,255,0.05)",
  text: BrandColors.textDark,

  // 2. Nested Sub-Theme Schemas (Used by theme driver layouts)
  dark: {
    background: BrandColors.backgroundDark,
    text: BrandColors.textDark,
    tint: BrandColors.primary,
    icon: BrandColors.secondary,
    tabIconDefault: "#4B5563",
    tabIconSelected: BrandColors.primary,
  },
  light: {
    background: BrandColors.backgroundLight,
    text: BrandColors.textLight,
    tint: BrandColors.primary,
    icon: BrandColors.textMutedLight,
    tabIconDefault: "#9CA3AF",
    tabIconSelected: BrandColors.primary,
  }
};

export type BrandColorToken = keyof typeof BrandColors;
