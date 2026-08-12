import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '@/constants/fonts';
import { colors } from '@/constants/theme';
export default function SplashScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [floatAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Gentle floating logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Smart Session Route Check
    const timer = setTimeout(async () => {
      const [activeSession, hasAccount, onboardingSeen] = await Promise.all([
        AsyncStorage.getItem('hhl_session'),
        AsyncStorage.getItem('hhl_has_account'),
        AsyncStorage.getItem('hhl_onboarding_seen'),
      ]);

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        if (activeSession === 'active') {
          router.replace('/(tabs)');
        } else if (hasAccount === 'true') {
          router.replace('/auth?mode=login');
        } else if (onboardingSeen !== 'true') {
          router.replace('/onboarding');
        } else {
          router.replace('/welcome');
        }
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar style="light" />
      {/* Top Status Bar Spacer */}
      <View style={styles.topBar}>
        <Text style={styles.timeText}>9:41</Text>
      </View>

      {/* Center Brand Lockup */}
      <View style={styles.centerLockup}>
        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <Image
            source={require('../../assets/logo/hhl-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={styles.suburbText}>LINDEN</Text>
      </View>

      {/* Bottom Loading Dots & Tagline */}
      <View style={styles.bottomLockup}>
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.taglineText}>LOVE WHERE YOU LIVE</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkSpruce, // Dark Spruce
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  centerLockup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 210,
    height: 110,
  },
  suburbText: {
    color: colors.white,
    fontFamily: fonts.sans.extraBold,
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  bottomLockup: {
    alignItems: 'center',
    gap: 16,
    paddingBottom: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'rgba(126, 217, 87, 0.3)',
  },
  dotActive: {
    backgroundColor: colors.radioactiveGrass, // Radioactive Grass
  },
  taglineText: {
    color: colors.radioactiveGrass, // Radioactive Grass
    fontFamily: fonts.sans.extraBold,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
