import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { QUIZ_STEPS } from '../src/lib/quiz-data';
import { scoreAnswers, countSelectedAnswers } from '../src/lib/persona-scoring';
import { QuizAnswers, StoredUserInterests } from '../src/lib/mock-data';
import { ProgressBar } from '../src/components/quiz/ProgressBar';
import { SingleSelectList } from '../src/components/quiz/SingleSelectList';
import { MultiSelectChips } from '../src/components/quiz/MultiSelectChips';
import { QuestionSection } from '../src/components/quiz/QuestionSection';
import { PreferencesSaved } from '../src/components/quiz/PreferencesSaved';
import { fonts } from '../src/constants/fonts';
import { colors } from '../src/constants/theme';

const EMPTY_ANSWERS: QuizAnswers = {
  household: [],
  interests: [],
  hearAbout: [],
  organisations: [],
  weekendActivities: [],
  feedPreferences: [],
  notificationPreferences: [],
  participation: [],
};

type Phase = 'intro' | 'question' | 'reveal';

export default function ProfileQuizScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const isRetake = searchParams.mode === 'retake';

  const [phase, setPhase] = useState<Phase>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [wasSkipped, setWasSkipped] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    if (!isRetake) return;
    (async () => {
      const raw = await AsyncStorage.getItem('hhl_user_interests');
      if (raw) {
        const stored: StoredUserInterests = JSON.parse(raw);
        setAnswers(stored.answers);
      }
    })();
  }, [isRetake]);

  const currentStep = QUIZ_STEPS[questionIndex];

  const getSingleValue = (): string | undefined => answers[currentStep.field] as string | undefined;
  const getMultiValue = (): string[] => (answers[currentStep.field] as string[]) ?? [];

  const setSingleValue = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep.field]: value }));
  };

  const toggleMultiValue = (option: string) => {
    setAnswers((prev) => {
      const current = (prev[currentStep.field] as string[]) ?? [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [currentStep.field]: next };
    });
  };

  const finishQuiz = async (finalAnswers: QuizAnswers, skipped: boolean) => {
    const scoreResult = scoreAnswers(finalAnswers);
    const record: StoredUserInterests = {
      version: 1,
      answers: finalAnswers,
      scoreResult,
      completedAt: new Date().toISOString(),
      skipped,
    };
    await AsyncStorage.setItem('hhl_user_interests', JSON.stringify(record));
    setSavedCount(countSelectedAnswers(finalAnswers));
    setWasSkipped(skipped);
    setPhase('reveal');
  };

  const handleContinue = () => {
    if (questionIndex < QUIZ_STEPS.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      finishQuiz(answers, false);
    }
  };

  const handleSkipQuestion = () => {
    const cleared: QuizAnswers = {
      ...answers,
      [currentStep.field]: Array.isArray(answers[currentStep.field]) ? [] : undefined,
    };
    setAnswers(cleared);
    if (questionIndex < QUIZ_STEPS.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      finishQuiz(cleared, false);
    }
  };

  const handleSkipForNow = () => {
    finishQuiz(answers, true);
  };

  const handleBack = () => {
    if (phase === 'question' && questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else if (phase === 'question' && questionIndex === 0) {
      setPhase('intro');
    } else {
      router.back();
    }
  };

  const handleFinalContinue = () => {
    if (isRetake) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={16} color={colors.hunterGreen} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        {phase === 'question' && (
          <TouchableOpacity
            onPress={handleSkipForNow}
            accessibilityRole="button"
            accessibilityLabel="Skip for now"
          >
            <Text style={styles.skipForNowText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>

      {phase === 'question' && (
        <View style={styles.progressWrap}>
          <ProgressBar current={questionIndex} total={QUIZ_STEPS.length} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {phase === 'intro' && (
          <View style={styles.introSection}>
            <View style={styles.introIcon}>
              <Sparkles size={24} color={colors.darkSpruce} />
            </View>
            <Text style={styles.introTitle}>Let's personalise your neighbourhood in under 60 seconds.</Text>
            <Text style={styles.introSubtitle}>
              Answer a few quick questions and we'll tailor your feed, recommendations and offers. You can
              skip any question, or skip the whole thing — you can always come back to it later in Settings.
            </Text>
            <TouchableOpacity
              style={styles.introCta}
              onPress={() => setPhase('question')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Let's go"
            >
              <Text style={styles.introCtaText}>Let's go</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSkipForNow}
              accessibilityRole="button"
              accessibilityLabel="Skip for now"
            >
              <Text style={styles.skipForNowText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'question' && currentStep.kind === 'single' && (
          <QuestionSection
            eyebrow={currentStep.eyebrow}
            question={currentStep.question}
            subtitle={currentStep.subtitle}
            onContinue={handleContinue}
            onSkip={handleSkipQuestion}
            continueLabel={questionIndex === QUIZ_STEPS.length - 1 ? 'See my profile' : 'Continue'}
          >
            <SingleSelectList options={currentStep.options} selected={getSingleValue()} onChange={setSingleValue} />
          </QuestionSection>
        )}

        {phase === 'question' && currentStep.kind === 'multi' && (
          <QuestionSection
            eyebrow={currentStep.eyebrow}
            question={currentStep.question}
            subtitle={currentStep.subtitle}
            onContinue={handleContinue}
            onSkip={handleSkipQuestion}
            continueLabel={questionIndex === QUIZ_STEPS.length - 1 ? 'See my profile' : 'Continue'}
          >
            <MultiSelectChips options={currentStep.options} selected={getMultiValue()} onToggle={toggleMultiValue} />
          </QuestionSection>
        )}

        {phase === 'question' && currentStep.kind === 'multi-grouped' && (
          <QuestionSection
            eyebrow={currentStep.eyebrow}
            question={currentStep.question}
            subtitle={currentStep.subtitle}
            onContinue={handleContinue}
            onSkip={handleSkipQuestion}
            continueLabel={questionIndex === QUIZ_STEPS.length - 1 ? 'See my profile' : 'Continue'}
          >
            <View style={styles.groupedWrap}>
              {currentStep.groups.map((group) => (
                <View key={group.groupLabel} style={styles.group}>
                  <Text style={styles.groupLabel}>{group.groupLabel}</Text>
                  <MultiSelectChips options={group.options} selected={getMultiValue()} onToggle={toggleMultiValue} />
                </View>
              ))}
            </View>
          </QuestionSection>
        )}

        {phase === 'reveal' && (
          <PreferencesSaved
            savedCount={savedCount}
            onContinue={handleFinalContinue}
            continueLabel={isRetake ? 'Save and go back' : 'Continue to Hello Hyperlocal'}
          />
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  skipForNowText: {
    color: colors.muted,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  progressWrap: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 24,
    paddingBottom: 60,
  },
  introSection: {
    alignItems: 'center',
    gap: 14,
    paddingTop: 24,
  },
  introIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.chipGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  introTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
  },
  introSubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  introCta: {
    alignSelf: 'stretch',
    backgroundColor: colors.radioactiveGrass,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  introCtaText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 14,
  },
  groupedWrap: {
    gap: 18,
  },
  group: {
    gap: 10,
  },
  groupLabel: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
