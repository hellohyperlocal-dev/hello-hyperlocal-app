import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, MapPin, Search } from 'lucide-react-native';
import { LOCAL_BUSINESSES } from '../../src/lib/mock-data';
import { CategoryChips } from '../../src/components/CategoryChips';
import { Badge } from '../../src/components/Badge';
import { fonts } from '../../src/constants/fonts';
import { colors, layout } from '../../src/constants/theme';
const CATEGORIES = ['All', 'Restaurants', 'Coffee Shops', 'Retail', 'Guesthouses', 'Markets', 'Experiences'];

export default function LoveLocalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const businesses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return LOCAL_BUSINESSES.filter((biz) => {
      const matchesCategory = activeCategory === 'All' || biz.category === activeCategory;
      const matchesQuery = !query || biz.name.toLowerCase().includes(query) || biz.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + layout.topBarContentHeight + 12 }]}>
        <Text style={styles.title}>Love Local</Text>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchInputWrap}>
          <Search size={16} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Love Local…"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.placeholder}
            accessibilityLabel="Search Love Local"
          />
        </View>
      </View>

      <View style={styles.chipsWrap}>
        <CategoryChips options={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {businesses.length === 0 && (
          <Text style={styles.emptyText}>
            No businesses match "{searchQuery}" in {activeCategory === 'All' ? 'any category' : activeCategory}.
          </Text>
        )}

        {businesses.map((biz) => (
          <TouchableOpacity
            key={biz.id}
            style={styles.card}
            onPress={() => router.push(`/business/${biz.id}`)}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={`View ${biz.name}`}
          >
            <Image source={biz.imageUrl} style={styles.image} resizeMode="cover" />
            <View style={styles.body}>
              <Text style={styles.eyebrow}>{biz.category} · Linden</Text>
              <Text style={styles.name}>{biz.name}</Text>

              <View style={styles.metaRow}>
                <View style={styles.ratingChip}>
                  <Star size={12} color={colors.darkSpruce} fill={colors.darkSpruce} />
                  <Text style={styles.ratingText}>
                    {biz.rating.toFixed(1)} · {biz.reviewCount} reviews
                  </Text>
                </View>
                <Badge label={biz.isOpen ? 'Open now' : 'Closed'} variant={biz.isOpen ? 'success' : 'neutral'} />
              </View>

              <Text style={styles.description}>{biz.description}</Text>

              <View style={styles.addressRow}>
                <MapPin size={12} color={colors.muted} />
                <Text style={styles.addressText}>
                  {biz.address} · {biz.hours}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 4,
  },
  title: {
    color: colors.onyx,
    fontSize: 26,
    fontFamily: fonts.sans.extraBold,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.onyx,
    fontFamily: fonts.sans.medium,
    fontSize: 14,
  },
  chipsWrap: {
    paddingLeft: 20,
    paddingBottom: 12,
  },
  emptyText: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    lineHeight: 18,
    paddingVertical: 24,
    textAlign: 'center',
  },
  list: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 150,
  },
  body: {
    padding: 16,
    gap: 6,
  },
  eyebrow: {
    color: colors.hunterGreen,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.sans.bold,
  },
  name: {
    color: colors.onyx,
    fontSize: 17,
    fontFamily: fonts.sans.extraBold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.chipGreen,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: {
    color: colors.darkSpruce,
    fontSize: 11,
    fontFamily: fonts.sans.bold,
  },
  description: {
    color: colors.onyx,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.sans.regular,
    marginTop: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  addressText: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: fonts.sans.regular,
  },
});
