import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ShieldCheck, ChevronRight } from 'lucide-react-native';
import { Avatar } from '../src/components/Avatar';
import { StoredUserData } from '../src/lib/mock-data';
import { fonts } from '../src/constants/fonts';
import { colors } from '../src/constants/theme';
export default function ProfileSetupScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [rawUserData, status] = await Promise.all([
        AsyncStorage.getItem('hhl_user_data'),
        AsyncStorage.getItem('hhl_verification_status'),
      ]);
      if (rawUserData) {
        const parsed = JSON.parse(rawUserData);
        setUserData(parsed);
        if (parsed.avatarUri) setAvatarUri(parsed.avatarUri);
      }
      setVerificationStatus(status);
    })();
  }, []);

  const displayName = userData?.businessName || userData?.fullName || 'Linden Member';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);

      const rawUserData = await AsyncStorage.getItem('hhl_user_data');
      const existing = rawUserData ? JSON.parse(rawUserData) : {};
      await AsyncStorage.setItem('hhl_user_data', JSON.stringify({ ...existing, avatarUri: uri }));
    }
  };

  const isPending = verificationStatus === 'pending';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Set up your profile</Text>
          <Text style={styles.subtitle}>A few last details before you join the Linden feed.</Text>
        </View>

        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={pickAvatar}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Add profile photo"
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Avatar initials={initials} size={88} variant="solid" />
            )}
            <View style={styles.avatarBadge}>
              <Camera size={14} color={colors.darkSpruce} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to add a profile photo</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Name</Text>
            <Text style={styles.cardValue}>{displayName}</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Address</Text>
            <Text style={styles.cardValue}>{userData?.streetAddress || '4th Avenue, Linden'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.verifyRow}
          onPress={() => router.push('/verify-address')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Verify your address, ${isPending ? 'verification pending' : 'not verified yet'}`}
        >
          <View style={styles.verifyIcon}>
            <ShieldCheck size={18} color={colors.darkSpruce} />
          </View>
          <View style={styles.verifyTextGroup}>
            <Text style={styles.verifyTitle}>Verify your address</Text>
            <Text style={styles.verifyStatus}>
              {isPending ? 'Verification pending' : 'Not verified yet'}
            </Text>
          </View>
          <ChevronRight size={18} color={colors.muted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.replace('/profile-quiz')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue to app"
        >
          <Text style={styles.continueText}>Continue to app</Text>
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
    gap: 8,
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
  },
  avatarSection: {
    alignItems: 'center',
    gap: 8,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.radioactiveGrass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.warmWhite,
  },
  avatarHint: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: fonts.sans.regular,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  cardRow: {
    gap: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  cardLabel: {
    color: colors.hunterGreen,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.sans.bold,
  },
  cardValue: {
    color: colors.onyx,
    fontSize: 15,
    fontFamily: fonts.sans.bold,
  },
  verifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  verifyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyTextGroup: {
    flex: 1,
    gap: 2,
  },
  verifyTitle: {
    color: colors.onyx,
    fontSize: 14,
    fontFamily: fonts.sans.bold,
  },
  verifyStatus: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: fonts.sans.regular,
  },
  continueBtn: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  continueText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 14,
  },
});
