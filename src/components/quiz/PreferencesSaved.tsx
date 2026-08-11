import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import CheckmarkAnimation from './CheckmarkAnimation';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/theme';

interface PreferencesSavedProps {
  savedCount: number;
  onContinue: () => void;
  continueLabel?: string;
}

export function PreferencesSaved({ savedCount, onContinue, continueLabel = 'Continue to Hello Hyperlocal' }: PreferencesSavedProps) {
  return (
    <View style={styles.container}>
      <CheckmarkAnimation size={112} />

      <Text style={styles.title}>You're all set</Text>
      <Text style={styles.subtitle}>
        {savedCount > 0
          ? `Thanks — we've saved your ${savedCount} preference${savedCount === 1 ? '' : 's'} and will use them to personalise your feed, recommendations and offers.`
          : "Thanks — we'll personalise your feed, recommendations and offers as you explore Hello Hyperlocal."}
        {' '}You can update this anytime from Settings.
      </Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 14,
    paddingTop: 24,
  },
  title: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 8,
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
});
