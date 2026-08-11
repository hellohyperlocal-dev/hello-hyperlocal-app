import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { fonts } from '../../../src/constants/fonts';
import { colors, radius } from '../../../src/constants/theme';

const DOC_CONTENT: Record<string, { title: string; note: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    note: 'This is where the Privacy Policy will go — covering what data Hello Hyperlocal collects (account details, street address, verification documents, location), how it is stored and used, and residents\' rights over it.',
  },
  'terms-of-service': {
    title: 'Terms of Service',
    note: 'This is where the Terms of Service will go — covering acceptable use of the app, account responsibilities, and the rules for posting content to the Linden community feed.',
  },
  'community-guidelines': {
    title: 'Community Guidelines',
    note: 'This is where the Community Guidelines will go — the rules residents and businesses agree to when posting, and how Report/Block moderation decisions get made.',
  },
};

export default function LegalDocScreen() {
  const router = useRouter();
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const content = DOC_CONTENT[doc ?? ''] ?? { title: 'Document', note: 'Content pending legal review.' };

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

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{content.title}</Text>

        <View style={styles.placeholderBanner}>
          <AlertTriangle size={16} color={colors.errorText} />
          <Text style={styles.placeholderBannerText}>
            Placeholder only — not real legal content. Final copy to be drafted and reviewed by the client's
            legal team before this is shown to real users or submitted to any app store.
          </Text>
        </View>

        <Text style={styles.note}>{content.note}</Text>
      </ScrollView>
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
    paddingBottom: 60,
  },
  title: {
    color: colors.onyx,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.sans.extraBold,
  },
  placeholderBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.errorBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 14,
  },
  placeholderBannerText: {
    flex: 1,
    color: colors.errorText,
    fontFamily: fonts.sans.semiBold,
    fontSize: 12,
    lineHeight: 17,
  },
  note: {
    color: colors.onyx,
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
