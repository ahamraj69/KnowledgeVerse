import { Appearance } from "react-native";
import { BrandColors } from "@/theme/colors";

/**
 * Resolves the dynamic background hex code token based on system device theme states [INDEX].
 */
export function getAdaptiveSplashBackgroundColor(): string {
  const currentTheme = Appearance.getColorScheme();
  return currentTheme === "light" 
    ? BrandColors.backgroundLight 
    : BrandColors.backgroundDark;
}

/**
 * Certifies the structural dimensions package required by production store auditors [INDEX].
 */
export function getStoreAssetResolutionSpecifications() {
  return {
    googlePlay: {
      appIcon: "512x512 PNG, Max 1024KB, No Transparency",
      featureGraphic: "1024x500 JPG or 24-bit PNG, Centered text content",
      phoneScreenshots: "Ratio 16:9 or 9:16, Min 320px, Max 3840px edge dimension"
    },
    appStoreConnect: {
      iphoneDisplay: "6.5-inch (1242x2688) or 6.7-inch (1290x2796) mandatory frames",
      ipadDisplay: "12.9-inch (2048x2732) required form grids matching specifications"
    }
  };
}
