import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Users, Store, Compass, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { fonts } from '../src/constants/fonts';
import { colors } from '../src/constants/theme';
type RoleType = 'resident' | 'business' | 'visitor';

export default function WelcomeScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType>('resident');

  const handleContinue = async () => {
    if (selectedRole === 'visitor') {
      await AsyncStorage.multiSet([
        ['hhl_user_role', 'visitor'],
        ['hhl_session', 'active'],
      ]);
      router.replace('/(tabs)');
    } else {
      router.push(`/auth?mode=signup&role=${selectedRole}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/logo/hhl-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>LINDEN</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>Love where you live in Linden.</Text>
          <Text style={styles.subtitle}>
            Connect with your neighbours, discover local events, or feature your business on the Linden feed.
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionHeader}>Choose How You Want to Join</Text>

          {/* Resident Card */}
          <TouchableOpacity
            style={[styles.card, selectedRole === 'resident' && styles.cardActive]}
            onPress={() => setSelectedRole('resident')}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedRole === 'resident' }}
            accessibilityLabel="I am a Resident. Discover local events, buy/sell on the marketplace, and get community updates."
          >
            <View style={styles.cardHeader}>
              <Users size={20} color={selectedRole === 'resident' ? colors.radioactiveGrass : colors.darkSpruce} />
              <Text style={[styles.cardTitle, selectedRole === 'resident' && styles.cardTitleActive]}>
                I am a Resident
              </Text>
            </View>
            <Text style={[styles.cardBody, selectedRole === 'resident' && styles.cardBodyActive]}>
              Discover local events, buy/sell on the marketplace, and get community updates.
            </Text>
            {selectedRole === 'resident' && (
              <View style={styles.checkIcon}>
                <CheckCircle2 size={20} color={colors.radioactiveGrass} />
              </View>
            )}
          </TouchableOpacity>

          {/* Local Business Card */}
          <TouchableOpacity
            style={[styles.card, selectedRole === 'business' && styles.cardActive]}
            onPress={() => setSelectedRole('business')}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedRole === 'business' }}
            accessibilityLabel="Local Business or Merchant. Feature your business, post marketplace offers, and boost listings to neighbours."
          >
            <View style={styles.cardHeader}>
              <Store size={20} color={selectedRole === 'business' ? colors.radioactiveGrass : colors.darkSpruce} />
              <Text style={[styles.cardTitle, selectedRole === 'business' && styles.cardTitleActive]}>
                Local Business / Merchant
              </Text>
            </View>
            <Text style={[styles.cardBody, selectedRole === 'business' && styles.cardBodyActive]}>
              Feature your business, post marketplace offers, and boost listings to neighbours.
            </Text>
            {selectedRole === 'business' && (
              <View style={styles.checkIcon}>
                <CheckCircle2 size={20} color={colors.radioactiveGrass} />
              </View>
            )}
          </TouchableOpacity>

          {/* Visitor Card */}
          <TouchableOpacity
            style={[styles.card, selectedRole === 'visitor' && styles.cardActive]}
            onPress={() => setSelectedRole('visitor')}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedRole === 'visitor' }}
            accessibilityLabel="Visitor, just browsing. Instant 1-tap entry to explore the Linden feed without signing up."
          >
            <View style={styles.cardHeader}>
              <Compass size={20} color={selectedRole === 'visitor' ? colors.radioactiveGrass : colors.darkSpruce} />
              <Text style={[styles.cardTitle, selectedRole === 'visitor' && styles.cardTitleActive]}>
                Visitor / Just Browsing
              </Text>
            </View>
            <Text style={[styles.cardBody, selectedRole === 'visitor' && styles.cardBodyActive]}>
              Instant 1-tap entry to explore the Linden feed without signing up.
            </Text>
            {selectedRole === 'visitor' && (
              <View style={styles.checkIcon}>
                <CheckCircle2 size={20} color={colors.radioactiveGrass} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleContinue}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={
            selectedRole === 'visitor'
              ? 'Explore feed as visitor'
              : `Continue to ${selectedRole === 'resident' ? 'resident' : 'business'} registration`
          }
        >
          <Text style={styles.ctaButtonText}>
            {selectedRole === 'visitor'
              ? 'Explore feed as visitor'
              : `Continue to ${selectedRole === 'resident' ? 'resident' : 'business'} registration`}
          </Text>
          <ArrowRight size={18} color={colors.darkSpruce} />
        </TouchableOpacity>

        {/* Log In Link */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/auth?mode=login')}
          accessibilityRole="button"
          accessibilityLabel="Log in to your account"
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginHighlight}>Log in</Text>
          </Text>
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
  scrollContent: {
    padding: 24,
    paddingTop: 48,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 48,
    height: 48,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.softGreen,
  },
  badgeText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.extraBold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  heroSection: {
    gap: 8,
  },
  title: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 24,
    lineHeight: 28,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  cardsContainer: {
    gap: 12,
    marginVertical: 8,
  },
  sectionHeader: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
    position: 'relative',
  },
  cardActive: {
    backgroundColor: colors.darkSpruce,
    borderColor: colors.darkSpruce,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 15,
  },
  cardTitleActive: {
    color: colors.white,
  },
  cardBody: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    lineHeight: 16,
    paddingRight: 24,
  },
  cardBodyActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  ctaButton: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  ctaButtonText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 14,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  loginHighlight: {
    color: colors.darkSpruce,
    textDecorationLine: 'underline',
  },
});
