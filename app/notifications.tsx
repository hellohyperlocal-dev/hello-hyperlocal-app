import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertTriangle, Tag, CalendarDays, MessageCircle, BellOff, LucideIcon } from 'lucide-react-native';
import { NOTIFICATIONS, AppNotification } from '../src/lib/mock-data';
import { EmptyState } from '../src/components/StateViews';
import { fonts } from '../src/constants/fonts';
import { colors, radius } from '../src/constants/theme';

const TYPE_ICON: Record<AppNotification['type'], LucideIcon> = {
  alert: AlertTriangle,
  deal: Tag,
  event: CalendarDays,
  reply: MessageCircle,
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>(NOTIFICATIONS);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  const clearAll = () => setItems([]);

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
        {items.length > 0 && (
          <TouchableOpacity
            onPress={unreadCount > 0 ? markAllRead : clearAll}
            accessibilityRole="button"
            accessibilityLabel={unreadCount > 0 ? 'Mark all as read' : 'Clear all notifications'}
          >
            <Text style={styles.headerAction}>{unreadCount > 0 ? 'Mark all read' : 'Clear all'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleWrap}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
        </Text>
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No notifications"
          subtitle="Alerts, deals, events and replies will show up here."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {items.map((n) => {
            const Icon = TYPE_ICON[n.type];
            return (
              <TouchableOpacity
                key={n.id}
                style={[styles.row, !n.isRead && styles.rowUnread]}
                onPress={() => markRead(n.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${n.isRead ? '' : 'Unread. '}${n.title}. ${n.body}`}
              >
                <View style={styles.rowIcon}>
                  <Icon size={17} color={colors.darkSpruce} />
                </View>
                <View style={styles.rowTextGroup}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {n.title}
                  </Text>
                  <Text style={styles.rowBody} numberOfLines={2}>
                    {n.body}
                  </Text>
                  <Text style={styles.rowTime}>{n.timeAgo}</Text>
                </View>
                {!n.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  headerAction: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  titleWrap: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 2,
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
    fontFamily: fonts.sans.regular,
  },
  list: {
    padding: 24,
    paddingTop: 8,
    gap: 10,
    paddingBottom: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  rowUnread: {
    backgroundColor: colors.chipGreen,
    borderColor: 'rgba(28, 71, 42, 0.12)',
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextGroup: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  rowBody: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  rowTime: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 10,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.radioactiveGrass,
    marginTop: 4,
  },
});
