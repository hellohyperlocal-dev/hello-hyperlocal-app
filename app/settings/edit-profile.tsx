import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, User, Phone } from 'lucide-react-native';
import { Avatar } from '../../src/components/Avatar';
import { StoredUserData } from '../../src/lib/mock-data';
import { fonts } from '../../src/constants/fonts';
import { colors, radius } from '../../src/constants/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const [rawUserData, role] = await Promise.all([
        AsyncStorage.getItem('hhl_user_data'),
        AsyncStorage.getItem('hhl_user_role'),
      ]);
      setUserRole(role);
      if (rawUserData) {
        const parsed: StoredUserData = JSON.parse(rawUserData);
        setName(parsed.businessName || parsed.fullName || '');
        setPhoneNumber(parsed.phoneNumber || '');
        setAvatarUri(parsed.avatarUri || null);
      }
    })();
  }, []);

  const isBusiness = userRole === 'business';
  const initials = (name || 'Linden Member')
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
      setAvatarUri(result.assets[0].uri);
      setSaved(false);
    }
  };

  const handleSave = async () => {
    const rawUserData = await AsyncStorage.getItem('hhl_user_data');
    const existing: StoredUserData = rawUserData ? JSON.parse(rawUserData) : { identifier: '' };

    await AsyncStorage.setItem(
      'hhl_user_data',
      JSON.stringify({
        ...existing,
        [isBusiness ? 'businessName' : 'fullName']: name,
        phoneNumber,
        avatarUri: avatarUri ?? undefined,
      })
    );
    setSaved(true);
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
        <Text style={styles.title}>Edit profile</Text>
        <Text style={styles.subtitle}>Keep your details up to date.</Text>

        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={pickAvatar}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
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
          <Text style={styles.avatarHint}>Tap to change your photo</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{isBusiness ? 'BUSINESS NAME' : 'FULL NAME'}</Text>
          <View style={styles.inputWrapper}>
            <User size={16} color={colors.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={isBusiness ? 'e.g. Linden Coffee Roasters' : 'e.g. Sarah Mitchell'}
              value={name}
              onChangeText={(val) => {
                setName(val);
                setSaved(false);
              }}
              placeholderTextColor={colors.placeholder}
              accessibilityLabel={isBusiness ? 'Business name' : 'Full name'}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <View style={styles.inputWrapper}>
            <Phone size={16} color={colors.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. 082 123 4567"
              value={phoneNumber}
              onChangeText={(val) => {
                setPhoneNumber(val);
                setSaved(false);
              }}
              keyboardType="phone-pad"
              placeholderTextColor={colors.placeholder}
              accessibilityLabel="Phone number"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Saved' : 'Save changes'}
        >
          <Text style={styles.saveBtnText}>{saved ? 'Saved' : 'Save changes'}</Text>
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
  avatarSection: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
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
  saveBtn: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 14,
  },
});
