import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, ChevronRight } from 'lucide-react-native';
import { fonts } from '../../../src/constants/fonts';
import { colors, radius } from '../../../src/constants/theme';

const LEGAL_DOCS = [
  { key: 'privacy-policy', title: 'Privacy Policy' },
  { key: 'terms-of-service', title: 'Terms of Service' },
  { key: 'community-guidelines', title: 'Community Guidelines' },
] as const;

export default function LegalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={16} color={colors.hunterGreen} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Legal</Text>
        <Text style={styles.subtitle}>Placeholders for reference — final copy pending legal review.</Text>

        <View style={styles.card}>
          {LEGAL_DOCS.map((doc, idx) => (
            <TouchableOpacity
              key={doc.key}
              style={[styles.row, idx < LEGAL_DOCS.length - 1 && styles.rowBorder]}
              onPress={() => router.push(`/settings/legal/${doc.key}`)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={doc.title}
            >
              <View style={styles.rowIcon}>
                <FileText size={17} color={colors.darkSpruce} />
              </View>
              <Text style={styles.rowTitle}>{doc.title}</Text>
              <ChevronRight size={18} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  body: {
    padding: 24,
    paddingTop: 16,
    gap: 16,
  },
  title: {
    color: colors.onyx,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.sans.extraBold,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.sans.regular,
    marginBottom: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    flex: 1,
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
});
