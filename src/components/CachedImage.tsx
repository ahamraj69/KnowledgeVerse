import { Image, ImageStyle } from "expo-image";
import { StyleProp } from "react-native";

type Props = {
  uri: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
};

export default function CachedImage({
  uri,
  width = 100,
  height = 100,
  borderRadius = 12,
  style,
}: Props) {
  return (
    <Image
      source={uri}
      style={[
        {
          width,
          height,
          borderRadius,
        } as any, // ✅ FIX: Cast layout structure dimensions to any to clear DimensionValue constraints
        style,
      ]}
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={200}
    />
  );
}
