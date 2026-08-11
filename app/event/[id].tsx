import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Navigation } from 'lucide-react-native';
import { LINDEN_MOCK_FEED, WhatsOnEvent } from '../../src/lib/mock-data';
import { getRsvps, setRsvp } from '../../src/lib/rsvps';
import { fonts } from '../../src/constants/fonts';
import { colors, radius } from '../../src/constants/theme';

const BASE_EVENTS = LINDEN_MOCK_FEED.filter((item): item is WhatsOnEvent => item.type === 'event');

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const baseEvent = BASE_EVENTS.find((e) => e.id === id);
  const [isGoing, setIsGoing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!baseEvent) return;
      getRsvps().then((rsvps) => setIsGoing(!!rsvps[baseEvent.id]));
    }, [baseEvent])
  );

  if (!baseEvent) {
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
        <Text style={styles.notFound}>We couldn't find that event.</Text>
      </View>
    );
  }

  const rsvpCount = baseEvent.rsvpCount + (isGoing ? 1 : 0);

  const toggleRsvp = async () => {
    const going = !isGoing;
    await setRsvp(baseEvent.id, going);
    setIsGoing(going);
  };

  const openDirections = () => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(baseEvent.location)}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image source={baseEvent.imageUrl} style={styles.heroImage} resizeMode="cover" />
          <TouchableOpacity style={styles.backButtonFloating}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
            <ArrowLeft size={18} color={colors.onyx} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.eyebrow}>{baseEvent.category}</Text>
          <Text style={styles.title}>{baseEvent.title}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Calendar size={16} color={colors.muted} />
              <Text style={styles.infoText}>{baseEvent.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={16} color={colors.muted} />
              <Text style={styles.infoText}>{baseEvent.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={16} color={colors.muted} />
              <Text style={styles.infoText}>{baseEvent.location}</Text>
            </View>
          </View>

          <Text style={styles.description}>{baseEvent.description}</Text>

          <View style={styles.rsvpRow}>
            <Text style={styles.rsvpCountText}>{rsvpCount} going</Text>
            <TouchableOpacity
              style={[styles.rsvpBtn, isGoing && styles.rsvpBtnActive]}
              onPress={toggleRsvp}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={{ selected: isGoing }}
              accessibilityLabel={isGoing ? 'Cancel RSVP' : `RSVP to ${baseEvent.title}`}
            >
              <Text style={[styles.rsvpBtnText, isGoing && styles.rsvpBtnTextActive]}>
                {isGoing ? "You're going" : 'RSVP'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.directionsBtn}
            onPress={openDirections}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Get directions to ${baseEvent.location}`}
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
  title: {
    color: colors.onyx,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.sans.extraBold,
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
  description: {
    color: colors.onyx,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.sans.regular,
  },
  rsvpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rsvpCountText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  rsvpBtn: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rsvpBtnActive: {
    backgroundColor: colors.darkSpruce,
  },
  rsvpBtnText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 13,
  },
  rsvpBtnTextActive: {
    color: colors.radioactiveGrass,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.softGreen,
    borderRadius: radius.pill,
    paddingVertical: 16,
  },
  directionsText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 14,
  },
});
