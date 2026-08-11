import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, LogOut, Trash2 } from 'lucide-react-native';
import { fonts } from '../../src/constants/fonts';
import { colors, radius } from '../../src/constants/theme';

const ALL_APP_KEYS = [
  'hhl_session',
  'hhl_has_account',
  'hhl_onboarding_seen',
  'hhl_user_role',
  'hhl_user_data',
  'hhl_user_interests',
  'hhl_verification_status',
  'hhl_biometric_enabled',
  'hhl_notif_prefs',
  'hhl_blocked_authors',
  'hhl_user_posts',
  'hhl_rsvps',
  'hhl_comments',
  'hhl_upvotes',
];

export default function AccountSettingsScreen() {
  const router = useRouter();

  const handleLogOut = async () => {
    await AsyncStorage.removeItem('hhl_session');
    router.replace('/');
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete your account?',
      'This permanently removes your profile, verification status and preferences from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete account', style: 'destructive', onPress: handleDeleteAccount },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    await AsyncStorage.multiRemove(ALL_APP_KEYS);
    router.replace('/');
  };

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
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Manage your session or leave Hello Hyperlocal.</Text>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={handleLogOut}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Log out. Ends your session on this device only"
        >
          <View style={styles.actionIcon}>
            <LogOut size={17} color={colors.darkSpruce} />
          </View>
          <View style={styles.actionTextGroup}>
            <Text style={styles.actionTitle}>Log out</Text>
            <Text style={styles.actionSubtitle}>Ends your session on this device only</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerRow}
          onPress={confirmDeleteAccount}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Delete my account. Permanently removes your data from this device"
        >
          <View style={styles.dangerIcon}>
            <Trash2 size={17} color={colors.errorText} />
          </View>
          <View style={styles.actionTextGroup}>
            <Text style={styles.dangerTitle}>Delete my account</Text>
            <Text style={styles.actionSubtitle}>Permanently removes your data from this device</Text>
          </View>
        </TouchableOpacity>
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextGroup: {
    flex: 1,
    gap: 1,
  },
  actionTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  actionSubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 11,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.errorBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 16,
  },
  dangerIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerTitle: {
    color: colors.errorText,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
});
