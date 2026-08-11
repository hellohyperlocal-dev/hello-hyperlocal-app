import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, KeyRound, User, MapPin, Store, Lock, Eye, EyeOff } from 'lucide-react-native';
import { sendEmailOTP, verifyEmailOTP } from '../src/lib/supabase';
import { fonts } from '../src/constants/fonts';
import { colors } from '../src/constants/theme';
const DEMO_PASSWORD = 'demo1234';

export default function AuthScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const mode = searchParams.mode === 'signup' ? 'signup' : 'login';
  const roleParam = searchParams.role === 'business' ? 'business' : 'resident';

  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIdentifierChange = (val: string) => {
    setIdentifier(val);
    setErrorMsg('');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'signup' && step === 2 && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [mode, step, resendTimer]);

  const handleLoginSubmit = async () => {
    if (!identifier || identifier.length < 5) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setLoading(false);

    if (password !== DEMO_PASSWORD) {
      setErrorMsg(`That password doesn't look right. Demo password: ${DEMO_PASSWORD}`);
      return;
    }

    setErrorMsg('');
    // Log in only restores the session — hhl_user_role and hhl_user_data
    // already exist from signup and must not be overwritten here.
    await AsyncStorage.setItem('hhl_session', 'active');
    router.replace('/(tabs)');
  };

  const handleSignupStep1Submit = async () => {
    if (!identifier || identifier.length < 5) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (roleParam === 'resident' && (!fullName || !streetAddress)) {
      setErrorMsg('Please complete all profile fields.');
      return;
    }
    if (roleParam === 'business' && (!businessName || !streetAddress)) {
      setErrorMsg('Please complete all business details.');
      return;
    }

    setLoading(true);
    await sendEmailOTP(identifier);
    setLoading(false);

    setErrorMsg('');
    setStep(2);
    setResendTimer(30);
  };

  const handleOtpChange = (index: number, val: string) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    } else if (!val && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      verifySignupOtp(newOtp.join(''));
    }
  };

  const verifySignupOtp = async (enteredCode: string) => {
    setLoading(true);
    const { error } = await verifyEmailOTP(identifier, enteredCode);
    setLoading(false);

    if (error && enteredCode !== '123456') {
      setErrorMsg(`That code doesn't look right. Demo code: 123456`);
      return;
    }

    await AsyncStorage.multiSet([
      ['hhl_session', 'active'],
      ['hhl_has_account', 'true'],
      ['hhl_user_role', roleParam],
      [
        'hhl_user_data',
        JSON.stringify({
          identifier,
          fullName: fullName || 'Linden Member',
          streetAddress: streetAddress || '4th Avenue, Linden',
          businessName: roleParam === 'business' ? businessName : undefined,
        }),
      ],
    ]);

    router.replace('/profile-setup');
  };

  const showOtpStep = mode === 'signup' && step === 2;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (showOtpStep ? setStep(1) : router.back())}
            accessibilityRole="button"
            accessibilityLabel={showOtpStep ? 'Back to details' : 'Back'}
          >
            <ArrowLeft size={16} color={colors.hunterGreen} />
            <Text style={styles.backText}>{showOtpStep ? 'Back to details' : 'Back'}</Text>
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>LINDEN</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>
            {mode === 'login' ? 'Welcome back to Linden' : showOtpStep ? 'Enter your verification code' : 'Join Hello Linden'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'login'
              ? 'Log in with your email and password.'
              : showOtpStep
                ? `We've sent a 6-digit code to ${identifier}.`
                : roleParam === 'business'
                  ? 'Register your business to connect with Linden residents.'
                  : 'Create your resident profile to keep up with local events.'}
          </Text>
        </View>

        {/* Error Message */}
        {!!errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Login form */}
        {mode === 'login' && (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <Mail size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  value={identifier}
                  onChangeText={handleIdentifierChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.placeholder}
                  accessibilityLabel="Email address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <Lock size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your password"
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    setErrorMsg('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  placeholderTextColor={colors.placeholder}
                  accessibilityLabel="Password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityState={{ selected: showPassword }}
                >
                  {showPassword ? <EyeOff size={16} color={colors.muted} /> : <Eye size={16} color={colors.muted} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.otpNoticeBox}>
              <KeyRound size={18} color={colors.radioactiveGrass} />
              <Text style={styles.otpNoticeText}>This is a demo — the password is {DEMO_PASSWORD}</Text>
            </View>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleLoginSubmit}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Log in"
            >
              <Text style={styles.ctaButtonText}>{loading ? 'Logging in…' : 'Log in'}</Text>
              <ArrowRight size={18} color={colors.darkSpruce} />
            </TouchableOpacity>
          </View>
        )}

        {/* Signup — Step 1: details */}
        {mode === 'signup' && step === 1 && (
          <View style={styles.formContainer}>
            {roleParam === 'resident' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>FULL NAME</Text>
                  <View style={styles.inputWrapper}>
                    <User size={16} color={colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Sarah Mitchell"
                      value={fullName}
                      onChangeText={setFullName}
                      placeholderTextColor={colors.placeholder}
                      accessibilityLabel="Full name"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>LINDEN STREET ADDRESS</Text>
                  <View style={styles.inputWrapper}>
                    <MapPin size={16} color={colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 4th Avenue, Linden"
                      value={streetAddress}
                      onChangeText={setStreetAddress}
                      placeholderTextColor={colors.placeholder}
                      accessibilityLabel="Linden street address"
                    />
                  </View>
                </View>
              </>
            )}

            {roleParam === 'business' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>BUSINESS NAME</Text>
                  <View style={styles.inputWrapper}>
                    <Store size={16} color={colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Linden Coffee Roasters"
                      value={businessName}
                      onChangeText={setBusinessName}
                      placeholderTextColor={colors.placeholder}
                      accessibilityLabel="Business name"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>BUSINESS ADDRESS</Text>
                  <View style={styles.inputWrapper}>
                    <MapPin size={16} color={colors.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 34 7th St, Linden"
                      value={streetAddress}
                      onChangeText={setStreetAddress}
                      placeholderTextColor={colors.placeholder}
                      accessibilityLabel="Business address"
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <Mail size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  value={identifier}
                  onChangeText={handleIdentifierChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.placeholder}
                  accessibilityLabel="Email address"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleSignupStep1Submit}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Send verification code"
            >
              <Text style={styles.ctaButtonText}>{loading ? 'Sending code…' : 'Send verification code'}</Text>
              <ArrowRight size={18} color={colors.darkSpruce} />
            </TouchableOpacity>
          </View>
        )}

        {/* Signup — Step 2: OTP verification */}
        {showOtpStep && (
          <View style={styles.formContainer}>
            <View style={styles.otpNoticeBox}>
              <KeyRound size={18} color={colors.radioactiveGrass} />
              <Text style={styles.otpNoticeText}>This is a demo — enter 123456 to continue</Text>
            </View>

            <View style={styles.otpRow}>
              {otp.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => (otpRefs.current[idx] = ref)}
                  style={styles.otpBox}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(val) => handleOtpChange(idx, val)}
                  accessibilityLabel={`Verification code digit ${idx + 1}`}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => verifySignupOtp(otp.join(''))}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Verify code"
            >
              <Text style={styles.ctaButtonText}>{loading ? 'Verifying…' : 'Verify'}</Text>
              <CheckCircle2 size={18} color={colors.darkSpruce} />
            </TouchableOpacity>
          </View>
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
  errorBox: {
    backgroundColor: colors.errorBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  errorText: {
    color: colors.errorText,
    fontFamily: fonts.sans.semiBold,
    fontSize: 12,
  },
  formContainer: {
    gap: 16,
    marginVertical: 8,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 11,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: colors.onyx,
    fontFamily: fonts.sans.medium,
    fontSize: 14,
  },
  otpNoticeBox: {
    backgroundColor: colors.darkSpruce,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  otpNoticeText: {
    flex: 1,
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.sans.medium,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    textAlign: 'center',
    fontSize: 20,
    color: colors.onyx,
    fontFamily: fonts.mono.medium,
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
    marginTop: 12,
  },
  ctaButtonText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 14,
  },
});
