import { Image } from 'expo-image';
import { StyleSheet, useColorScheme } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <Image
        source={
          scheme === 'dark'
            ? require('../../assets/images/expo-badge-white.png')
            : require('../../assets/images/expo-badge.png')
        }
        style={styles.image}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four,
  },
  image: {
    width: 140,
    height: 30,
    resizeMode: 'contain',
  },
});
