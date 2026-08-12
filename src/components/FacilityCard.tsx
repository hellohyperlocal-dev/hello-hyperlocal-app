import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { fonts } from '../constants/fonts';
import { colors, radius } from '../constants/theme';

interface FacilityCardProps {
  image: any;
  title: string;
  subtitle: string;
  tag?: string;
  size?: 'large' | 'small';
  onPress?: () => void;
}

export function FacilityCard({ image, title, subtitle, tag, size = 'small', onPress }: FacilityCardProps) {
  const isLarge = size === 'large';
  return (
    <TouchableOpacity
      style={[styles.card, isLarge ? styles.large : styles.small]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={tag ? `${title}, ${subtitle}, ${tag}` : `${title}, ${subtitle}`}
    >
      <View>
        <Image
          source={image}
          style={isLarge ? styles.imageLarge : styles.imageSmall}
          resizeMode="cover"
          accessible={false}
        />
        {tag && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  large: {
    width: '100%',
  },
  small: {
    flex: 1,
  },
  imageLarge: {
    width: '100%',
    height: 140,
  },
  imageSmall: {
    width: '100%',
    height: 90,
  },
  tag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.radioactiveGrass,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    color: colors.darkSpruce,
    fontSize: 10,
    fontFamily: fonts.sans.extraBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  body: {
    padding: 10,
    gap: 2,
  },
  title: {
    color: colors.onyx,
    fontSize: 13,
    fontFamily: fonts.sans.bold,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 11,
    fontFamily: fonts.sans.regular,
  },
});
