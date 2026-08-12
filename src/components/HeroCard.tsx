import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { fonts } from '../constants/fonts';
import { colors, radius } from '../constants/theme';

interface HeroCardProps {
  eyebrow: string;
  title: string;
  body: string;
  ctaText: string;
  onPress?: () => void;
  onDismiss?: () => void;
}

export function HeroCard({ eyebrow, title, body, ctaText, onPress, onDismiss }: HeroCardProps) {
  return (
    <View style={[styles.card, onDismiss && styles.cardWithDismiss]}>
      {onDismiss && (
        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={onDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        >
          <X size={16} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>
      )}
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <TouchableOpacity
        style={styles.cta}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={ctaText}
      >
        <Text style={styles.ctaText}>{ctaText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.darkSpruce,
    borderRadius: radius.lg,
    padding: 20,
    gap: 10,
  },
  cardWithDismiss: {
    paddingRight: 44,
  },
  dismissBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  eyebrow: {
    color: colors.radioactiveGrass,
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: fonts.sans.bold,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: fonts.sans.extraBold,
  },
  body: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.sans.regular,
  },
  cta: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  ctaText: {
    color: colors.darkSpruce,
    fontSize: 12,
    fontFamily: fonts.sans.extraBold,
  },
});
