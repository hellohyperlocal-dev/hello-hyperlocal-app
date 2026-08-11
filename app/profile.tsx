import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Bell,
  MapPinned,
  LifeBuoy,
  ScrollText,
  UserCog,
  UserPen,
  ChevronRight,
  LucideIcon,
} from 'lucide-react-native';
import { Avatar } from '../src/components/Avatar';
import { Badge } from '../src/components/Badge';
import { StoredUserData } from '../src/lib/mock-data';
import { fonts } from '../src/constants/fonts';
import { colors, radius } from '../src/constants/theme';

const ROLE_LABELS: Record<string, string> = {
  resident: 'Resident',
  business: 'Business',
  visitor: 'Visitor',
};

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [rawUserData, role, status] = await Promise.all([
          AsyncStorage.getItem('hhl_user_data'),
          AsyncStorage.getItem('hhl_user_role'),
          AsyncStorage.getItem('hhl_verification_status'),
        ]);
        if (rawUserData) setUserData(JSON.parse(rawUserData));
        setUserRole(role);
        setVerificationStatus(status);
      })();
    }, [])
  );

  const displayName = userData?.businessName || userData?.fullName || 'Linden Member';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const roleLabel = ROLE_LABELS[userRole ?? ''] ?? 'Visitor';
  const isVerified = verificationStatus === 'verified';
  const isPending = verificationStatus === 'pending';

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
        <View style={styles.identitySection}>
          <Avatar initials={initials} size={72} variant="solid" imageUri={userData?.avatarUri} />
          <Text style={styles.name}>{displayName}</Text>
          <Badge label={roleLabel} variant="info" />
        </View>

        <TouchableOpacity
          style={styles.verifyCard}
          onPress={() => router.push('/settings/verification')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`${userData?.streetAddress || '4th Avenue, Linden'}, ${isVerified ? 'Verified resident' : isPending ? 'Verification pending' : 'Not verified yet'}`}
        >
          <View style={[styles.verifyIcon, isVerified && styles.verifyIconDone]}>
            {isVerified ? (
              <ShieldCheck size={18} color={colors.darkSpruce} />
            ) : (
              <ShieldAlert size={18} color={colors.darkSpruce} />
            )}
          </View>
          <View style={styles.verifyTextGroup}>
            <Text style={styles.verifyAddress}>{userData?.streetAddress || '4th Avenue, Linden'}</Text>
            <Badge
              label={isVerified ? 'Verified resident' : isPending ? 'Verification pending' : 'Not verified yet'}
              variant={isVerified ? 'success' : isPending ? 'warning' : 'neutral'}
              style={styles.verifyBadge}
            />
          </View>
          {!isVerified && <ChevronRight size={18} color={colors.muted} />}
        </TouchableOpacity>

        <View style={styles.navSection}>
          <NavRow
            icon={UserPen}
            title="Edit profile"
            subtitle="Name, phone number, photo"
            onPress={() => router.push('/settings/edit-profile')}
          />
          <NavRow
            icon={Lock}
            title="Security"
            subtitle="Login details, biometric lock, sessions"
            onPress={() => router.push('/settings/security')}
          />
          <NavRow
            icon={Bell}
            title="Notifications"
            subtitle="Choose what you hear about"
            onPress={() => router.push('/settings/notifications')}
          />
          <NavRow
            icon={UserCog}
            title="Account"
            subtitle="Log out or delete your account"
            onPress={() => router.push('/settings/account')}
          />
          <NavRow icon={MapPinned} title="Suburb switcher" subtitle="Linden — more suburbs coming soon" disabled />
          <NavRow icon={LifeBuoy} title="Help & support" subtitle="Coming soon" disabled />
          <NavRow
            icon={ScrollText}
            title="Legal"
            subtitle="Privacy Policy, Terms, Community Guidelines"
            onPress={() => router.push('/settings/legal')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

interface NavRowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress?: () => void;
  disabled?: boolean;
}

function NavRow({ icon: Icon, title, subtitle, onPress, disabled }: NavRowProps) {
  return (
    <TouchableOpacity
      style={[styles.navRow, disabled && styles.navRowDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
      accessibilityState={{ disabled: !!disabled }}
    >
      <View style={styles.navIcon}>
        <Icon size={17} color={disabled ? colors.muted : colors.darkSpruce} />
      </View>
      <View style={styles.navTextGroup}>
        <Text style={[styles.navTitle, disabled && styles.navTitleDisabled]}>{title}</Text>
        <Text style={styles.navSubtitle}>{subtitle}</Text>
      </View>
      {!disabled && <ChevronRight size={18} color={colors.muted} />}
    </TouchableOpacity>
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
    gap: 20,
    paddingBottom: 60,
  },
  identitySection: {
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 20,
    marginTop: 4,
  },
  verifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  verifyIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md + 4,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyIconDone: {
    backgroundColor: colors.chipGreen,
  },
  verifyTextGroup: {
    flex: 1,
    gap: 2,
  },
  verifyAddress: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  verifyBadge: {
    marginTop: 2,
  },
  navSection: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  navRowDisabled: {
    opacity: 0.55,
  },
  navIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextGroup: {
    flex: 1,
    gap: 1,
  },
  navTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  navTitleDisabled: {
    color: colors.muted,
  },
  navSubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 11,
  },
});
