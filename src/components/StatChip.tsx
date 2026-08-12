import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { IconButton } from './IconButton';
import { fonts } from '../constants/fonts';
import { colors, radius } from '../constants/theme';

interface StatChipProps {
  value: string;
  label: string;
}

export function StatChip({ value, label }: StatChipProps) {
  return (
    <View style={styles.chip} accessible accessibilityLabel={`${value} ${label}`}>
      <View style={styles.arrow} importantForAccessibility="no-hide-descendants">
        <IconButton icon={ArrowUpRight} variant="dark" size={26} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    backgroundColor: colors.chipGreen,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(126, 217, 87, 0.3)',
    padding: 16,
    gap: 2,
  },
  arrow: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  value: {
    color: colors.darkSpruce,
    fontSize: 22,
    fontFamily: fonts.mono.medium,
  },
  label: {
    color: colors.hunterGreen,
    fontSize: 11,
    fontFamily: fonts.sans.bold,
  },
});
