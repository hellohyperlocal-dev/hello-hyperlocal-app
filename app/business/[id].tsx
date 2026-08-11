import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { ArrowLeft, Star, MapPin, Clock, Navigation } from 'lucide-react-native';
import { LOCAL_BUSINESSES } from '../../src/lib/mock-data';
import { Badge } from '../../src/components/Badge';
import { fonts } from '../../src/constants/fonts';
import { colors, radius } from '../../src/constants/theme';

export default function BusinessDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const business = LOCAL_BUSINESSES.find((b) => b.id === id);

  if (!business) {
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
        <Text style={styles.notFound}>We couldn't find that business.</Text>
      </View>
    );
  }

  const openDirections = () => {
    const { latitude, longitude } = business.coordinate;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image source={business.imageUrl} style={styles.heroImage} resizeMode="cover" />
          <TouchableOpacity style={styles.backButtonFloating}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
            <ArrowLeft size={18} color={colors.onyx} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.eyebrow}>{business.category} · Linden</Text>
          <Text style={styles.name}>{business.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingChip}>
              <Star size={12} color={colors.darkSpruce} fill={colors.darkSpruce} />
              <Text style={styles.ratingText}>
                {business.rating.toFixed(1)} · {business.reviewCount} reviews
              </Text>
            </View>
            <Badge label={business.isOpen ? 'Open now' : 'Closed'} variant={business.isOpen ? 'success' : 'neutral'} />
          </View>

          <Text style={styles.description}>{business.description}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MapPin size={16} color={colors.muted} />
              <Text style={styles.infoText}>{business.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={16} color={colors.muted} />
              <Text style={styles.infoText}>{business.hours}</Text>
            </View>
          </View>

          <View style={styles.mapWrap}>
            <MapView
              style={styles.map}
              initialRegion={{ ...business.coordinate, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
              scrollEnabled={false}
              zoomEnabled={false}
              pointerEvents="none"
            >
              <Marker coordinate={business.coordinate} pinColor={colors.darkSpruce} />
            </MapView>
          </View>

          <TouchableOpacity
            style={styles.directionsBtn}
            onPress={openDirections}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Get directions to ${business.name}`}
          >
            <Navigation size={16} color={colors.darkSpruce} />
            <Text style={styles.directionsText}>Get directions</Text>
          </TouchableOpacity>
        </View>
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
  notFound: {
    padding: 24,
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 14,
  },
  imageWrap: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  backButtonFloating: {
    position: 'absolute',
    top: 48,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.warmWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 24,
    gap: 12,
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
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.sans.extraBold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.chipGreen,
    borderRadius: radius.pill,
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
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.sans.regular,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: colors.onyx,
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    flex: 1,
  },
  mapWrap: {
    height: 140,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.radioactiveGrass,
    borderRadius: radius.pill,
    paddingVertical: 16,
    marginTop: 4,
  },
  directionsText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 14,
  },
});
