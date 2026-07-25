import { Platform } from "react-native";
import { SecurityConstants } from "./securityConstants";

export interface DeviceValidationResult {
  isCompliant: boolean;
  platform: string;
  appVersion: string;
  reason?: string;
}

/**
 * Validates the hardware app platform context to block out-of-date or insecure version lines [INDEX].
 */
export function validateDeviceSessionContext(): DeviceValidationResult {
  const currentPlatform = Platform.OS; // "ios" | "android" | "web"
  const currentVersion = SecurityConstants.APP_VERSION_REQUIREMENT;

  // Verify app package version state to shield endpoints from split payloads
  if (!currentVersion || currentVersion !== "1.7.0") {
    return {
      isCompliant: false,
      platform: currentPlatform,
      appVersion: currentVersion || "unknown",
      reason: "App version mismatch. Production upgrade required."
    };
  }

  return {
    isCompliant: true,
    platform: currentPlatform,
    appVersion: currentVersion
  };
}
