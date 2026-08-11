import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fonts } from '../../constants/fonts';
import { colors, radius } from '../../constants/theme';

interface MultiSelectChipsProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export function MultiSelectChips({ options, selected, onToggle }: MultiSelectChipsProps) {
  return (
    <View style={styles.grid}>
      {options.map((option) => {
        const isActive = selected.includes(option);
        return (
          <TouchableOpacity
            key={option}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onToggle(option)}
            activeOpacity={0.8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isActive }}
            accessibilityLabel={option}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.softGreen,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  chipActive: {
    backgroundColor: colors.darkSpruce,
    borderColor: colors.darkSpruce,
  },
  label: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  labelActive: {
    color: colors.radioactiveGrass,
  },
});
