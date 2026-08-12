import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '../constants/theme';

interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  variant?: 'light' | 'dark';
  size?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function IconButton({ icon: Icon, onPress, variant = 'light', size = 36, style, accessibilityLabel }: IconButtonProps) {
  const isDark = variant === 'dark';
  return (
    <TouchableOpacity
      style={[styles.base, { width: size, height: size, borderRadius: size / 2 }, isDark ? styles.dark : styles.light, style]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Icon size={size * 0.45} color={isDark ? colors.radioactiveGrass : colors.darkSpruce} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  light: {
    backgroundColor: colors.softGreen,
  },
  dark: {
    backgroundColor: colors.darkSpruce,
  },
});
