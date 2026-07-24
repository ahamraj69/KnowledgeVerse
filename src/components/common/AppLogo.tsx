import React from "react";
import { StyleSheet, Image, View, ViewStyle, ImageStyle } from "react-native";

interface AppLogoProps {
  variant?: "primary" | "light" | "dark" | "symbol" | "horizontal";
  width?: number;
  height?: number;
  containerStyle?: ViewStyle;
}

export default function AppLogo({ variant = "primary", width, height, containerStyle }: AppLogoProps) {
  // Resolve branding assets maps explicitly to satisfy standard relative lookups
  const logoMap = {
    primary: require("../../../assets/branding/logo-primary.png"),
    light: require("../../../assets/branding/logo-light.png"),
    dark: require("../../../assets/branding/logo-dark.png"),
    symbol: require("../../../assets/branding/logo-symbol.png"),
    horizontal: require("../../../assets/branding/logo-horizontal.png"),
  };

  const selectedSource = logoMap[variant] || logoMap.primary;

  // Enforce standard baseline resolution dimensions derived from logo types
  const defaultDimensions = {
    primary: { width: 120, height: 120 },
    light: { width: 120, height: 120 },
    dark: { width: 120, height: 120 },
    symbol: { width: 64, height: 64 },
    horizontal: { width: 180, height: 60 },
  }[variant];

  const finalStyle: ImageStyle = {
    width: width || defaultDimensions.width,
    height: height || defaultDimensions.height,
    resizeMode: "contain",
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Image source={selectedSource} style={finalStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
