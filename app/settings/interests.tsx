import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, RefreshCcw, CheckCircle2 } from 'lucide-react-native';
import { StoredUserInterests } from '../../src/lib/mock-data';
import { countSelectedAnswers } from '../../src/lib/persona-scoring';
import { fonts } from '../../src/constants/fonts';
import { colors, radius } from '../../src/constants/theme';

export default function InterestsSettingsScreen() {
  const router = useRouter();
  const [stored, setStored] = useState<StoredUserInterests | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const raw = await AsyncStorage.getItem('hhl_user_interests');
        setStored(raw ? JSON.parse(raw) : null);
      })();
    }, [])
  );

  const hasTakenQuiz = !!stored;
  const savedCount = stored ? countSelectedAnswers(stored.answers) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={16} color={colors.hunterGreen} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Interests</Text>
        <Text style={styles.subtitle}>
          This shapes what shows up in your feed, recommendations and offers.
        </Text>

        {hasTakenQuiz ? (
          <View style={styles.savedCard}>
            <View style={styles.savedIcon}>
              <CheckCircle2 size={18} color={colors.darkSpruce} />
            </View>
            <View style={styles.savedTextGroup}>
              <Text style={styles.savedTitle}>Your preferences are saved</Text>
              <Text style={styles.savedSubtitle}>
                {savedCount} preference{savedCount === 1 ? '' : 's'} saved
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>You haven't taken the quiz yet.</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.retakeRow}
          onPress={() => router.push('/profile-quiz?mode=retake')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={hasTakenQuiz ? 'Retake the quiz' : 'Take the quiz'}
        >
          <View style={styles.retakeIcon}>
            <RefreshCcw size={17} color={colors.darkSpruce} />
          </View>
          <View style={styles.retakeTextGroup}>
            <Text style={styles.retakeTitle}>{hasTakenQuiz ? 'Retake the quiz' : 'Take the quiz'}</Text>
            <Text style={styles.retakeSubtitle}>Takes under 60 seconds</Text>
          </View>
        </TouchableOpacity>
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
  scrollContent: {
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
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.sans.regular,
    marginBottom: 4,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  savedIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.chipGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedTextGroup: {
    flex: 1,
    gap: 2,
  },
  savedTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 15,
  },
  savedSubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  emptyText: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 13,
  },
  retakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 4,
  },
  retakeIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeTextGroup: {
    flex: 1,
    gap: 1,
  },
  retakeTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  retakeSubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 11,
  },
});
