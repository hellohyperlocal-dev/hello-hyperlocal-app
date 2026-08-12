import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { ArrowLeft, Mail, Fingerprint, Smartphone, LogOut, CheckCircle2 } from 'lucide-react-native';
import { sendEmailOTP, verifyEmailOTP } from '@/lib/supabase';
import { fonts } from '@/constants/fonts';
import { colors, radius } from '@/constants/theme';

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [emailUpdated, setEmailUpdated] = useState(false);

  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const rawUserData = await AsyncStorage.getItem('hhl_user_data');
      if (rawUserData) setCurrentEmail(JSON.parse(rawUserData).identifier || '');

      const [hasHardware, isEnrolled, storedPref] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        AsyncStorage.getItem('hhl_biometric_enabled'),
      ]);
      setBiometricSupported(hasHardware && isEnrolled);
      setBiometricEnabled(storedPref === 'true');
    })();
  }, []);

  const startEmailChange = () => {
    setEditingEmail(true);
    setNewEmail('');
    setOtpStep(false);
    setEmailUpdated(false);
  };

  const sendCode = async () => {
    if (!newEmail || newEmail.length < 5) return;
    await sendEmailOTP(newEmail);
    setOtpStep(true);
    setOtpError('');
  };

  const handleOtpChange = (index: number, val: string) => {
    const nextOtp = [...otp];
    nextOtp[index] = val;
    setOtp(nextOtp);

    if (val && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    } else if (!val && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (nextOtp.every((d) => d !== '')) {
      verifyChange(nextOtp.join(''));
    }
  };

  const verifyChange = async (code: string) => {
    const { error } = await verifyEmailOTP(newEmail, code);
    if (error && code !== '123456') {
      setOtpError(`That code doesn't look right. Demo code: 123456`);
      return;
    }

    const rawUserData = await AsyncStorage.getItem('hhl_user_data');
    const userData = rawUserData ? JSON.parse(rawUserData) : {};
    await AsyncStorage.setItem('hhl_user_data', JSON.stringify({ ...userData, identifier: newEmail }));

    setCurrentEmail(newEmail);
    setEditingEmail(false);
    setEmailUpdated(true);
    setOtp(['', '', '', '', '', '']);
  };

  const toggleBiometric = async (value: boolean) => {
    if (!biometricSupported) return;
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm to enable biometric lock',
      });
      if (!result.success) return;
    }
    setBiometricEnabled(value);
    await AsyncStorage.setItem('hhl_biometric_enabled', value ? 'true' : 'false');
  };

  const logOutAllDevices = async () => {
    await AsyncStorage.multiRemove(['hhl_session']);
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
        <Text style={styles.title}>Security</Text>
        <Text style={styles.subtitle}>Manage how you sign in and where you're logged in.</Text>

        {/* Email */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIcon}>
              <Mail size={17} color={colors.darkSpruce} />
            </View>
            <Text style={styles.cardTitle}>Email address</Text>
          </View>

          {!editingEmail ? (
            <>
              <Text style={styles.currentValue}>{currentEmail || 'Not set'}</Text>
              {emailUpdated && <Text style={styles.successNote}>Email updated ✓</Text>}
              <TouchableOpacity
                style={styles.linkBtn}
                onPress={startEmailChange}
                accessibilityRole="button"
                accessibilityLabel="Change email"
              >
                <Text style={styles.linkBtnText}>Change email</Text>
              </TouchableOpacity>
            </>
          ) : !otpStep ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="New email address"
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.placeholder}
                accessibilityLabel="New email address"
              />
              <View style={styles.inlineActions}>
                <TouchableOpacity
                  style={styles.linkBtn}
                  onPress={() => setEditingEmail(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                >
                  <Text style={styles.linkBtnMuted}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryBtnSmall}
                  onPress={sendCode}
                  accessibilityRole="button"
                  accessibilityLabel="Send code"
                >
                  <Text style={styles.primaryBtnSmallText}>Send code</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.otpHint}>
                We've sent a 6-digit code to {newEmail}. This is a demo — enter 123456.
              </Text>
              <View style={styles.otpRow}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => {
                      otpRefs.current[idx] = ref;
                    }}
                    style={styles.otpBox}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(val) => handleOtpChange(idx, val)}
                    accessibilityLabel={`Verification code digit ${idx + 1}`}
                  />
                ))}
              </View>
              {!!otpError && <Text style={styles.errorText}>{otpError}</Text>}
            </>
          )}
        </View>

        {/* Biometric lock */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIcon}>
              <Fingerprint size={17} color={colors.darkSpruce} />
            </View>
            <Text style={styles.cardTitle}>Biometric lock</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={toggleBiometric}
              disabled={!biometricSupported}
              trackColor={{ false: colors.border, true: colors.radioactiveGrass }}
              thumbColor={Platform.OS === 'android' ? colors.white : undefined}
              accessibilityLabel="Biometric lock"
            />
          </View>
          <Text style={styles.cardCaption}>
            {biometricSupported
              ? 'Use Face ID or fingerprint to unlock Hello Hyperlocal.'
              : 'No biometric hardware enrolled on this device.'}
          </Text>
        </View>

        {/* Active sessions */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIcon}>
              <Smartphone size={17} color={colors.darkSpruce} />
            </View>
            <Text style={styles.cardTitle}>Active sessions</Text>
          </View>

          <View style={styles.sessionRow}>
            <View style={styles.sessionDot} />
            <View style={styles.sessionTextGroup}>
              <Text style={styles.sessionTitle}>This device</Text>
              <Text style={styles.sessionSubtitle}>Active now</Text>
            </View>
            <CheckCircle2 size={16} color={colors.radioactiveGrass} />
          </View>

          <TouchableOpacity
            style={styles.logoutAllBtn}
            onPress={logOutAllDevices}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Log out of all devices"
          >
            <LogOut size={14} color={colors.errorText} />
            <Text style={styles.logoutAllText}>Log out of all devices</Text>
          </TouchableOpacity>
        </View>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    flex: 1,
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  cardCaption: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  currentValue: {
    color: colors.onyx,
    fontFamily: fonts.sans.medium,
    fontSize: 14,
  },
  successNote: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 11,
  },
  linkBtn: {
    alignSelf: 'flex-start',
  },
  linkBtnText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  linkBtnMuted: {
    color: colors.muted,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.onyx,
    fontFamily: fonts.sans.medium,
    fontSize: 14,
  },
  inlineActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryBtnSmall: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  primaryBtnSmallText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 12,
  },
  otpHint: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox: {
    width: 42,
    height: 50,
    borderRadius: radius.sm,
    backgroundColor: colors.warmWhite,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    textAlign: 'center',
    fontSize: 18,
    color: colors.onyx,
    fontFamily: fonts.mono.medium,
  },
  errorText: {
    color: colors.errorText,
    fontFamily: fonts.sans.semiBold,
    fontSize: 11,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  sessionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.radioactiveGrass,
  },
  sessionTextGroup: {
    flex: 1,
    gap: 1,
  },
  sessionTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  sessionSubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 11,
  },
  logoutAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  logoutAllText: {
    color: colors.errorText,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
});
