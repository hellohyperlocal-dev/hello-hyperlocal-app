import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from '../../src/components/AppMapView';
import { Star, Search } from 'lucide-react-native';
import { LOCAL_BUSINESSES } from '../../src/lib/mock-data';
import { CategoryChips } from '../../src/components/CategoryChips';
import { ListRow } from '../../src/components/ListRow';
import { fonts } from '../../src/constants/fonts';
import { colors, layout } from '../../src/constants/theme';
const CATEGORIES = ['All', 'Restaurants', 'Coffee Shops', 'Retail', 'Guesthouses', 'Markets', 'Experiences'];

const LINDEN_REGION = {
  latitude: -26.1435,
  longitude: 27.9989,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  const businesses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return LOCAL_BUSINESSES.filter((biz) => {
      const matchesCategory = activeCategory === 'All' || biz.category === activeCategory;
      const matchesQuery = !query || biz.name.toLowerCase().includes(query) || biz.address.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + layout.topBarContentHeight + 12 }]}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchInputWrap}>
          <Search size={16} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Linden…"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.placeholder}
            accessibilityLabel="Search Linden"
          />
        </View>
      </View>

      <View style={styles.chipsWrap}>
        <CategoryChips options={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
      </View>

      <View style={styles.mapWrap}>
        <MapView ref={mapRef} style={styles.map} initialRegion={LINDEN_REGION}>
          {businesses.map((biz) => (
            <Marker
              key={biz.id}
              coordinate={biz.coordinate}
              title={biz.name}
              description={`${biz.category} · ${biz.address}`}
              pinColor={selectedId === biz.id ? colors.radioactiveGrass : colors.darkSpruce}
              onPress={() => setSelectedId(biz.id)}
            />
          ))}
        </MapView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby</Text>
          <Text style={styles.sectionCount}>{businesses.length} spots</Text>
        </View>

        {businesses.length === 0 && (
          <Text style={styles.emptyText}>No spots match "{searchQuery}" in {activeCategory === 'All' ? 'any category' : activeCategory}.</Text>
        )}

        {businesses.map((biz) => (
          <View key={biz.id} style={selectedId === biz.id && styles.rowSelected}>
            <ListRow
              image={biz.imageUrl}
              title={biz.name}
              subtitle={`${biz.category} · ${biz.address}`}
              onPress={() => router.push(`/business/${biz.id}`)}
              trailing={
                <View style={styles.ratingChip}>
                  <Star size={11} color={colors.darkSpruce} fill={colors.darkSpruce} />
                  <Text style={styles.ratingText}>{biz.rating.toFixed(1)}</Text>
                </View>
              }
            />
          </View>
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
    paddingBottom: 4,
    gap: 4,
  },
  title: {
    color: colors.onyx,
    fontSize: 26,
    fontFamily: fonts.sans.extraBold,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
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
    paddingVertical: 12,
  },
  mapWrap: {
    marginHorizontal: 20,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  list: {
    padding: 20,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 15,
  },
  sectionCount: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  emptyText: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    lineHeight: 18,
    paddingVertical: 24,
    textAlign: 'center',
  },
  rowSelected: {
    backgroundColor: 'rgba(126, 217, 87, 0.1)',
    borderRadius: 12,
    marginHorizontal: -8,
    paddingHorizontal: 8,
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
});
