import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { X, ImagePlus, Calendar, Megaphone, Search, Briefcase, Star, Store } from 'lucide-react-native';
import { Avatar } from '../src/components/Avatar';
import { CommunityPost, StoredUserData } from '../src/lib/mock-data';
import { fonts } from '../src/constants/fonts';
import { colors, radius } from '../src/constants/theme';
const SUBURB = 'Linden';

const SHARE_CATEGORIES = [
  { key: 'event', label: 'Event', icon: Calendar, placeholder: 'Name your event…' },
  { key: 'hood', label: "Around the 'hood", icon: Megaphone, placeholder: "What's the news?" },
  { key: 'lost-found', label: 'Lost & Found', icon: Search, placeholder: 'What did you lose or find?' },
  { key: 'job', label: 'Job', icon: Briefcase, placeholder: "What's the role?" },
  { key: 'recommendation', label: 'Recommendation', icon: Star, placeholder: 'What are you recommending?' },
  { key: 'business', label: 'Business listing', icon: Store, placeholder: 'Your business name…' },
] as const;

type CategoryKey = (typeof SHARE_CATEGORIES)[number]['key'];

export default function ShareModalScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [categoryKey, setCategoryKey] = useState<CategoryKey>('event');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const category = SHARE_CATEGORIES.find((c) => c.key === categoryKey)!;
  const canPost = !!title && !!content;

  useEffect(() => {
    AsyncStorage.getItem('hhl_user_data').then((raw) => {
      if (raw) setUserData(JSON.parse(raw));
    });
  }, []);

  const displayName = userData?.businessName || userData?.fullName || 'Linden Member';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!canPost) return;

    const rawRole = await AsyncStorage.getItem('hhl_user_role');
    const authorRole: CommunityPost['authorRole'] = rawRole === 'business' ? 'Business' : 'Resident';

    const newPost: CommunityPost = {
      id: `user-${Date.now()}`,
      type: 'community',
      authorName: displayName,
      authorInitials: initials,
      authorRole,
      title: `${category.label}: ${title}`,
      content,
      timeAgo: 'Just now',
      upvotes: 0,
      commentsCount: 0,
      imageUrl: photoUri ? { uri: photoUri } : undefined,
      isPreApproved: false,
    };

    const rawExisting = await AsyncStorage.getItem('hhl_user_posts');
    const existing: CommunityPost[] = rawExisting ? JSON.parse(rawExisting) : [];
    await AsyncStorage.setItem('hhl_user_posts', JSON.stringify([newPost, ...existing]));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setContent('');
      setPhotoUri(null);
      router.back();
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalCard}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <X size={18} color={colors.onyx} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create post</Text>
          <TouchableOpacity
            style={[styles.postBtn, !canPost && styles.postBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canPost}
            accessibilityRole="button"
            accessibilityLabel="Post"
            accessibilityState={{ disabled: !canPost }}
          >
            <Text style={[styles.postBtnText, !canPost && styles.postBtnTextDisabled]}>Post</Text>
          </TouchableOpacity>
        </View>

        {submitted ? (
          <View style={styles.successBox} accessibilityLiveRegion="polite">
            <Text style={styles.successTitle}>Thanks — we've got it!</Text>
            <Text style={styles.successSub}>
              Your post is in for review. You'll see it on the {SUBURB} feed marked as pending until it's approved.
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.formBody} showsVerticalScrollIndicator={false}>
            {/* Identity */}
            <View style={styles.identityRow}>
              <Avatar initials={initials} size={40} variant="solid" imageUri={userData?.avatarUri} />
              <View>
                <Text style={styles.identityName}>{displayName}</Text>
                <Text style={styles.identityMeta}>Posting to {SUBURB}</Text>
              </View>
            </View>

            {/* Category */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {SHARE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = cat.key === categoryKey;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                    onPress={() => setCategoryKey(cat.key)}
                    activeOpacity={0.85}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={cat.label}
                  >
                    <Icon size={14} color={isActive ? colors.darkSpruce : colors.hunterGreen} />
                    <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TextInput
              style={styles.inputTitle}
              placeholder={category.placeholder}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={colors.placeholder}
              accessibilityLabel={category.placeholder}
            />

            <TextInput
              style={styles.inputBody}
              placeholder="Tell your neighbours what makes it great…"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.placeholder}
              accessibilityLabel="Post details"
            />

            {photoUri ? (
              <TouchableOpacity
                onPress={pickPhoto}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Change photo"
              >
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.photoBtn}
                onPress={pickPhoto}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Add a photo"
              >
                <ImagePlus size={16} color={colors.hunterGreen} />
                <Text style={styles.photoText}>Add a photo</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.disclaimer}>Reviewed before publishing, usually within a day.</Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 15, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.warmWhite,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    maxHeight: '88%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingBottom: 14,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 16,
  },
  postBtn: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  postBtnDisabled: {
    backgroundColor: colors.softGreen,
  },
  postBtnText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 13,
  },
  postBtnTextDisabled: {
    color: colors.muted,
  },
  formBody: {
    gap: 14,
    paddingTop: 16,
    paddingBottom: 8,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  identityName: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  identityMeta: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 12,
  },
  categoryRow: {
    gap: 8,
    paddingRight: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  categoryChipActive: {
    backgroundColor: colors.chipGreen,
    borderColor: colors.radioactiveGrass,
  },
  categoryChipText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: colors.darkSpruce,
  },
  inputTitle: {
    fontSize: 16,
    fontFamily: fonts.sans.bold,
    color: colors.onyx,
    paddingVertical: 4,
  },
  inputBody: {
    fontSize: 14,
    color: colors.onyx,
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: fonts.sans.regular,
    paddingVertical: 4,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.softGreen,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  photoText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  photoPreview: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 11,
    fontFamily: fonts.sans.regular,
  },
  successBox: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 6,
  },
  successTitle: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 16,
  },
  successSub: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: fonts.sans.regular,
  },
});
