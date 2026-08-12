import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { ArrowLeft, FileText, CheckCircle2, MapPin } from 'lucide-react-native';
import { fonts } from '@/constants/fonts';
import { colors, radius } from '@/constants/theme';

export default function VerificationSettingsScreen() {
  const router = useRouter();
  const [streetAddress, setStreetAddress] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyPending, setAlreadyPending] = useState(false);

  useEffect(() => {
    (async () => {
      const [rawUserData, status] = await Promise.all([
        AsyncStorage.getItem('hhl_user_data'),
        AsyncStorage.getItem('hhl_verification_status'),
      ]);
      if (rawUserData) {
        const parsed = JSON.parse(rawUserData);
        setStreetAddress(parsed.streetAddress || '');
      }
      setAlreadyPending(status === 'pending');
    })();
  }, []);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      setFileName(result.assets[0].name);
    }
  };

  const handleSubmit = async () => {
    if (!fileName || !streetAddress) return;
    setSubmitted(true);
    await AsyncStorage.setItem('hhl_verification_status', 'pending');

    const rawUserData = await AsyncStorage.getItem('hhl_user_data');
    const userData = rawUserData ? JSON.parse(rawUserData) : {};
    await AsyncStorage.setItem('hhl_user_data', JSON.stringify({ ...userData, streetAddress }));
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

      {submitted || alreadyPending ? (
        <View style={styles.successBox}>
          <CheckCircle2 size={40} color={colors.radioactiveGrass} />
          <Text style={styles.successTitle}>Submitted for review</Text>
          <Text style={styles.successSub}>
            We check every submission before approving, usually within a day.
          </Text>
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={styles.title}>Verify your address</Text>
          <Text style={styles.subtitle}>
            Upload a recent utility bill or lease agreement so we can confirm you live in Linden.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>STREET ADDRESS</Text>
            <View style={styles.inputWrapper}>
              <MapPin size={16} color={colors.muted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 4th Avenue, Linden"
                value={streetAddress}
                onChangeText={setStreetAddress}
                placeholderTextColor={colors.placeholder}
                accessibilityLabel="Street address"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.dropzone}
            onPress={pickDocument}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={fileName ?? 'Choose a photo or PDF to upload'}
          >
            <FileText size={28} color={colors.hunterGreen} />
            <Text style={styles.dropzoneText} numberOfLines={2}>
              {fileName ?? 'Tap to choose a photo or PDF'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, (!fileName || !streetAddress) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!fileName || !streetAddress}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Submit for review"
            accessibilityState={{ disabled: !fileName || !streetAddress }}
          >
            <Text style={styles.submitText}>Submit for review</Text>
          </TouchableOpacity>
        </View>
      )}
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
    borderRadius: radius.sm,
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
  dropzone: {
    height: 160,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  dropzoneText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: 'rgba(126, 217, 87, 0.4)',
  },
  submitText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 14,
  },
  successBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  successTitle: {
    color: colors.onyx,
    fontSize: 18,
    fontFamily: fonts.sans.extraBold,
  },
  successSub: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
    fontFamily: fonts.sans.regular,
  },
});
