import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/theme';

interface AvatarProps {
  initials: string;
  size?: number;
  variant?: 'soft' | 'solid';
  imageUri?: string | null;
}

export function Avatar({ initials, size = 36, variant = 'soft', imageUri }: AvatarProps) {
  const isSolid = variant === 'solid';

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        accessible={false}
      />
    );
  }

  return (
    <View
      style={[
        styles.circle,
        isSolid ? styles.solid : styles.soft,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.text, isSolid ? styles.textSolid : styles.textSoft, { fontSize: size * 0.36 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  soft: {
    backgroundColor: colors.softGreen,
  },
  solid: {
    backgroundColor: colors.hunterGreen,
  },
  text: {
    fontFamily: fonts.sans.extraBold,
  },
  textSoft: {
    color: colors.darkSpruce,
  },
  textSolid: {
    color: colors.white,
  },
});
