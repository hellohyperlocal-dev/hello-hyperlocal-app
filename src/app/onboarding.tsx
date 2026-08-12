import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRight } from 'lucide-react-native';
import { fonts } from '@/constants/fonts';
import { colors } from '@/constants/theme';
const SLIDES = [
  {
    eyebrow: 'Rediscover',
    headline: 'Rediscover your street',
    body: "The café has roads clear, the family bakery, the weekend market — the good stuff hiding around the corner. I didn't know that was here!",
    image: require('../../assets/photography/linden-streetview.jpeg'),
  },
  {
    eyebrow: 'Support local',
    headline: 'Support the shops on your street',
    body: 'Discover the cafés, retailers and services around you, and back the neighbours who run them.',
    image: require('../../assets/photography/goddess-cafe-linden.jpg'),
  },
  {
    eyebrow: 'Join in',
    headline: "Never miss what's on",
    body: 'Markets, fundraisers and street parties — see what your neighbourhood is up to, and share your own.',
    image: require('../../assets/photography/linden-market.jpg'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  const finish = async () => {
    await AsyncStorage.setItem('hhl_onboarding_seen', 'true');
    router.replace('/welcome');
  };

  const handleNext = () => {
    if (isLast) {
      finish();
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={finish} accessibilityRole="button" accessibilityLabel="Skip">
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Image source={slide.image} style={styles.photo} resizeMode="cover" />

      <View style={styles.body}>
        <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
        <Text style={styles.headline}>{slide.headline}</Text>
        <Text style={styles.bodyText}>{slide.body}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Get started' : 'Next'}
        >
          <Text style={styles.nextText}>{isLast ? 'Get started' : 'Next'}</Text>
          <ArrowRight size={16} color={colors.darkSpruce} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  topBar: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  skipText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  photo: {
    width: '100%',
    height: 340,
    borderRadius: 24,
  },
  body: {
    flex: 1,
    gap: 8,
    marginTop: 24,
  },
  eyebrow: {
    color: colors.radioactiveGrass,
    backgroundColor: colors.darkSpruce,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.sans.bold,
    overflow: 'hidden',
  },
  headline: {
    color: colors.onyx,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.sans.extraBold,
  },
  bodyText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.sans.regular,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(28, 71, 42, 0.15)',
  },
  dotActive: {
    backgroundColor: colors.darkSpruce,
    width: 20,
  },
  nextBtn: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 13,
  },
});
