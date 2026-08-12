import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, AlertTriangle, Tag, CalendarDays, MessageCircle, LucideIcon } from 'lucide-react-native';
import { fonts } from '@/constants/fonts';
import { colors, radius } from '@/constants/theme';

interface NotifPrefs {
  emergencyAlerts: boolean;
  loveLocalDeals: boolean;
  whatsOnEvents: boolean;
  communityReplies: boolean;
}

const DEFAULT_PREFS: NotifPrefs = {
  emergencyAlerts: true,
  loveLocalDeals: true,
  whatsOnEvents: true,
  communityReplies: true,
};

const TOGGLES: { key: keyof NotifPrefs; icon: LucideIcon; title: string; subtitle: string }[] = [
  { key: 'emergencyAlerts', icon: AlertTriangle, title: 'Emergency alerts', subtitle: 'Load-shedding, safety and urgent notices' },
  { key: 'loveLocalDeals', icon: Tag, title: 'Love Local deals', subtitle: 'New offers from Linden businesses' },
  { key: 'whatsOnEvents', icon: CalendarDays, title: "What's On events", subtitle: 'Reminders for events you RSVP to' },
  { key: 'communityReplies', icon: MessageCircle, title: 'Community replies', subtitle: 'Upvotes and comments on your posts' },
];

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('hhl_notif_prefs');
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    })();
  }, []);

  const updatePref = async (key: keyof NotifPrefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    await AsyncStorage.setItem('hhl_notif_prefs', JSON.stringify(next));
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
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Choose what Hello Hyperlocal can notify you about.</Text>

        <View style={styles.card}>
          {TOGGLES.map((toggle, idx) => {
            const Icon = toggle.icon;
            return (
              <View key={toggle.key} style={[styles.row, idx < TOGGLES.length - 1 && styles.rowBorder]}>
                <View style={styles.rowIcon}>
                  <Icon size={17} color={colors.darkSpruce} />
                </View>
                <View style={styles.rowTextGroup}>
                  <Text style={styles.rowTitle}>{toggle.title}</Text>
                  <Text style={styles.rowSubtitle}>{toggle.subtitle}</Text>
                </View>
                <Switch
                  value={prefs[toggle.key]}
                  onValueChange={(value) => updatePref(toggle.key, value)}
                  trackColor={{ false: colors.border, true: colors.radioactiveGrass }}
                  thumbColor={Platform.OS === 'android' ? colors.white : undefined}
                  accessibilityLabel={toggle.title}
                />
              </View>
            );
          })}
        </View>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextGroup: {
    flex: 1,
    gap: 1,
  },
  rowTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  rowSubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 11,
  },
});
