import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Users, Store, Compass, CheckCircle2, ArrowRight, LucideIcon } from 'lucide-react-native';
import { fonts } from '@/constants/fonts';
import { colors } from '@/constants/theme';
type RoleType = 'resident' | 'business' | 'visitor';

const ROLE_OPTIONS: { id: RoleType; label: string; icon: LucideIcon }[] = [
  { id: 'resident', label: 'Resident', icon: Users },
  { id: 'business', label: 'Local Business', icon: Store },
  { id: 'visitor', label: 'Just Browsing', icon: Compass },
];

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
            source={require('../../assets/logo/hhl-logo.png')}
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

          {ROLE_OPTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = selectedRole === id;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.card, isActive && styles.cardActive]}
                onPress={() => setSelectedRole(id)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={label}
              >
                <Icon size={20} color={isActive ? colors.radioactiveGrass : colors.darkSpruce} />
                <Text style={[styles.cardTitle, isActive && styles.cardTitleActive]}>{label}</Text>
                {isActive && <CheckCircle2 size={20} color={colors.radioactiveGrass} />}
              </TouchableOpacity>
            );
          })}
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
    gap: 8,
    marginVertical: 8,
  },
  sectionHeader: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardActive: {
    backgroundColor: colors.darkSpruce,
    borderColor: colors.darkSpruce,
  },
  cardTitle: {
    flex: 1,
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 15,
  },
  cardTitleActive: {
    color: colors.white,
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
