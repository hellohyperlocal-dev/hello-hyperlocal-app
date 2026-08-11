import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { colors } from '../../constants/theme';

interface CheckmarkAnimationProps {
  size?: number;
}

// lottie-react-native's web support is inconsistent across Expo/Metro versions,
// so web gets the same static fallback as Expo Go rather than risking the bundle.
export default function CheckmarkAnimation({ size = 96 }: CheckmarkAnimationProps) {
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <CheckCircle2 size={size * 0.5} color={colors.darkSpruce} />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.chipGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
