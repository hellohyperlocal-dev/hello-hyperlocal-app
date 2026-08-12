import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/theme';

interface QuestionSectionProps {
  eyebrow: string;
  question: string;
  subtitle?: string;
  children: React.ReactNode;
  onContinue: () => void;
  onSkip: () => void;
  continueLabel?: string;
}

export function QuestionSection({
  eyebrow,
  question,
  subtitle,
  children,
  onContinue,
  onSkip,
  continueLabel = 'Continue',
}: QuestionSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.question}>{question}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.body}>{children}</View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onContinue}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={continueLabel}
        >
          <Text style={styles.continueText}>{continueLabel}</Text>
          <ArrowRight size={18} color={colors.darkSpruce} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSkip}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Skip this question"
        >
          <Text style={styles.skipText}>Skip this question</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  heroSection: {
    gap: 8,
  },
  eyebrow: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  question: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 22,
    lineHeight: 27,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  body: {
    gap: 20,
  },
  footer: {
    gap: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  continueButton: {
    alignSelf: 'stretch',
    backgroundColor: colors.radioactiveGrass,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 14,
  },
  skipText: {
    color: colors.muted,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
