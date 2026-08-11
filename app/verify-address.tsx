import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react-native';
import { fonts } from '../src/constants/fonts';
import { colors } from '../src/constants/theme';
export default function VerifyAddressScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const pickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) return;
    setSubmitted(true);
    await AsyncStorage.setItem('hhl_verification_status', 'pending');
    setTimeout(() => {
      router.replace('/profile-setup');
    }, 1400);
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

      {submitted ? (
        <View style={styles.successBox}>
          <CheckCircle2 size={40} color={colors.radioactiveGrass} />
          <Text style={styles.successTitle}>Submitted for review</Text>
          <Text style={styles.successSub}>Reviewed before approving, usually within a day.</Text>
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={styles.title}>Verify your address</Text>
          <Text style={styles.subtitle}>
            Upload a recent utility bill or lease so we can confirm you live in Linden.
          </Text>

          <TouchableOpacity
            style={styles.dropzone}
            onPress={pickDocument}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={imageUri ? 'Change uploaded photo' : 'Tap to take a photo or choose a file'}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            ) : (
              <>
                <UploadCloud size={28} color={colors.hunterGreen} />
                <Text style={styles.dropzoneText}>Tap to take a photo or choose a file</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, !imageUri && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!imageUri}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Submit for review"
            accessibilityState={{ disabled: !imageUri }}
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
  dropzone: {
    height: 200,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(15, 15, 15, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  dropzoneText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  submitBtn: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: 999,
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
