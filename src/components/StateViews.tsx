import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { fonts } from '../constants/fonts';
import { colors, radius } from '../constants/theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: object;
}

export function Skeleton({ width = '100%', height = 16, radius: cornerRadius = radius.sm, style }: SkeletonProps) {
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: false }),
        Animated.timing(sweep, { toValue: 0, duration: 800, easing: Easing.ease, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [sweep]);

  const backgroundColor = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.softGreen, colors.chipGreen],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius: cornerRadius, backgroundColor },
        style,
      ]}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}

export function SkeletonFacilityCard({ size = 'small' }: { size?: 'large' | 'small' }) {
  const isLarge = size === 'large';
  return (
    <View style={[skeletonComposedStyles.card, isLarge ? skeletonComposedStyles.cardLarge : skeletonComposedStyles.cardSmall]}>
      <Skeleton width="100%" height={isLarge ? 140 : 90} radius={0} />
      <View style={skeletonComposedStyles.cardBody}>
        <Skeleton width="70%" height={13} />
        <Skeleton width="45%" height={11} />
      </View>
    </View>
  );
}

export function SkeletonListRow() {
  return (
    <View style={skeletonComposedStyles.row}>
      <Skeleton width={48} height={48} radius={radius.pill} />
      <View style={skeletonComposedStyles.rowText}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
}

export function SkeletonHeroCard() {
  return (
    <View style={skeletonComposedStyles.hero}>
      <Skeleton width="35%" height={11} style={{ backgroundColor: colors.borderStrong }} />
      <Skeleton width="80%" height={18} style={{ backgroundColor: colors.borderStrong }} />
      <Skeleton width="100%" height={16} style={{ backgroundColor: colors.borderStrong }} />
      <Skeleton width={90} height={32} radius={radius.pill} style={{ backgroundColor: colors.borderStrong }} />
    </View>
  );
}


interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon: Icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.iconCircle}>
        <Icon size={22} color={colors.hunterGreen} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.softGreen,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 15,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});

const skeletonComposedStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLarge: {
    width: '100%',
  },
  cardSmall: {
    flex: 1,
  },
  cardBody: {
    padding: 10,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  rowText: {
    flex: 1,
    gap: 6,
  },
  hero: {
    backgroundColor: colors.darkSpruce,
    borderRadius: radius.lg,
    padding: 20,
    gap: 10,
  },
});
