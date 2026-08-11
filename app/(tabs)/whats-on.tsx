import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LINDEN_MOCK_FEED, WhatsOnEvent } from '../../src/lib/mock-data';
import { getRsvps, setRsvp } from '../../src/lib/rsvps';
import { ListRow } from '../../src/components/ListRow';
import { fonts } from '../../src/constants/fonts';
import { colors, layout } from '../../src/constants/theme';
const BASE_EVENTS = LINDEN_MOCK_FEED.filter((item): item is WhatsOnEvent => item.type === 'event');

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { key: d.toISOString().slice(0, 10), label: DAY_LABELS[d.getDay()], day: d.getDate() };
  });
}

export default function WhatsOnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const weekDays = useMemo(getWeekDays, []);
  const [selectedDay, setSelectedDay] = useState(weekDays[0].key);
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({});

  useFocusEffect(
    useCallback(() => {
      getRsvps().then(setRsvps);
    }, [])
  );

  const events = useMemo(
    () =>
      BASE_EVENTS.map((event) => ({
        ...event,
        isUserRsvped: !!rsvps[event.id],
        rsvpCount: event.rsvpCount + (rsvps[event.id] ? 1 : 0),
      })),
    [rsvps]
  );
  const [featuredEvent, ...restEvents] = events;

  const toggleRsvp = async (id: string) => {
    const going = !rsvps[id];
    const next = await setRsvp(id, going);
    setRsvps(next);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + layout.topBarContentHeight + 12 }]}>
        <Text style={styles.title}>What's on</Text>
      </View>

      <View style={styles.dayStrip}>
        {weekDays.map((d) => {
          const isActive = d.key === selectedDay;
          return (
            <TouchableOpacity
              key={d.key}
              style={[styles.dayCell, isActive && styles.dayCellActive]}
              onPress={() => setSelectedDay(d.key)}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${d.label} ${d.day}`}
            >
              <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>{d.label}</Text>
              <Text style={[styles.dayNumber, isActive && styles.dayNumberActive]}>{d.day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {featuredEvent && (
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => router.push(`/event/${featuredEvent.id}`)}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={`View ${featuredEvent.title}`}
          >
            <View>
              <Image source={featuredEvent.imageUrl} style={styles.featuredImage} resizeMode="cover" />
              <View style={styles.featuredTag}>
                <Text style={styles.featuredTagText}>Featured</Text>
              </View>
            </View>
            <View style={styles.featuredBody}>
              <Text style={styles.featuredTitle}>{featuredEvent.title}</Text>
              <Text style={styles.featuredMeta}>
                {featuredEvent.date} · {featuredEvent.time} · {featuredEvent.location}
              </Text>
              <View style={styles.featuredFooter}>
                <Text style={styles.rsvpCountText}>{featuredEvent.rsvpCount} going</Text>
                <TouchableOpacity
                  style={[styles.rsvpBtn, featuredEvent.isUserRsvped && styles.rsvpBtnActive]}
                  onPress={() => toggleRsvp(featuredEvent.id)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: featuredEvent.isUserRsvped }}
                  accessibilityLabel={featuredEvent.isUserRsvped ? 'Cancel RSVP' : `RSVP to ${featuredEvent.title}`}
                >
                  <Text style={[styles.rsvpBtnText, featuredEvent.isUserRsvped && styles.rsvpBtnTextActive]}>
                    {featuredEvent.isUserRsvped ? "You're going" : 'RSVP'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This week</Text>
          </View>

          {restEvents.map((event) => (
            <ListRow
              key={event.id}
              image={event.imageUrl}
              title={event.title}
              subtitle={`${event.date} · ${event.time} · ${event.location}`}
              onPress={() => router.push(`/event/${event.id}`)}
              trailing={
                <TouchableOpacity
                  style={[styles.rsvpChip, event.isUserRsvped && styles.rsvpChipActive]}
                  onPress={() => toggleRsvp(event.id)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: event.isUserRsvped }}
                  accessibilityLabel={event.isUserRsvped ? `Cancel RSVP for ${event.title}` : `RSVP to ${event.title}`}
                >
                  <Text style={[styles.rsvpCountSmall, event.isUserRsvped && styles.rsvpCountSmallActive]}>
                    {event.isUserRsvped ? 'Going ✓' : `${event.rsvpCount} going`}
                  </Text>
                </TouchableOpacity>
              }
            />
          ))}
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
    paddingHorizontal: 20,
    paddingBottom: 4,
    gap: 4,
  },
  title: {
    color: colors.onyx,
    fontSize: 26,
    fontFamily: fonts.sans.extraBold,
  },
  dayStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dayCell: {
    width: 40,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: colors.softGreen,
  },
  dayCellActive: {
    backgroundColor: colors.darkSpruce,
  },
  dayLabel: {
    color: colors.hunterGreen,
    fontSize: 10,
    fontFamily: fonts.sans.bold,
    textTransform: 'uppercase',
  },
  dayLabelActive: {
    color: colors.radioactiveGrass,
  },
  dayNumber: {
    color: colors.onyx,
    fontSize: 15,
    fontFamily: fonts.sans.extraBold,
  },
  dayNumberActive: {
    color: colors.white,
  },
  content: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 32,
    gap: 20,
  },
  featuredCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  featuredTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.radioactiveGrass,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  featuredTagText: {
    color: colors.darkSpruce,
    fontSize: 11,
    fontFamily: fonts.sans.extraBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  featuredBody: {
    padding: 16,
    gap: 6,
  },
  featuredTitle: {
    color: colors.onyx,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.sans.extraBold,
  },
  featuredMeta: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: fonts.sans.regular,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
  },
  rsvpCountText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  rsvpBtn: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rsvpBtnActive: {
    backgroundColor: colors.darkSpruce,
  },
  rsvpBtnText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 12,
  },
  rsvpBtnTextActive: {
    color: colors.radioactiveGrass,
  },
  section: {
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 15,
  },
  rsvpChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.softGreen,
  },
  rsvpChipActive: {
    backgroundColor: colors.darkSpruce,
  },
  rsvpCountSmall: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 11,
  },
  rsvpCountSmallActive: {
    color: colors.radioactiveGrass,
  },
});
