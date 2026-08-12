import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { fonts } from '../constants/fonts';
import { colors, radius } from '../constants/theme';

interface ListRowProps {
  image?: any;
  initials?: string;
  title: string;
  subtitle: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
}

export function ListRow({ image, initials, title, subtitle, trailing, onPress }: ListRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `${title}, ${subtitle}` : undefined}
    >
      {image ? (
        <Image source={image} style={styles.thumbnail} resizeMode="cover" accessible={false} />
      ) : (
        <Avatar initials={initials ?? ''} size={48} />
      )}

      <View style={styles.textGroup}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {trailing ?? <ChevronRight size={18} color={colors.muted} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 12,
  },
});
