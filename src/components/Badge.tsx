import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../constants/fonts';
import { colors, radius } from '../constants/theme';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: object;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: colors.successBg, text: colors.successDeep },
  warning: { bg: colors.warningBg, text: colors.warningText },
  danger: { bg: colors.dangerBg, text: colors.dangerDeep },
  info: { bg: colors.infoBg, text: colors.infoDeep },
  neutral: { bg: colors.border, text: colors.muted },
};

export function Badge({ label, variant = 'success', style }: BadgeProps) {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <View
      style={[styles.badge, { backgroundColor: variantStyle.bg }, style]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text style={[styles.label, { color: variantStyle.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  label: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 12,
    lineHeight: 16,
  },
});
