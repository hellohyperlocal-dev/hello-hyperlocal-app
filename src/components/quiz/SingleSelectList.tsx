import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { fonts } from '../../constants/fonts';
import { colors, radius } from '../../constants/theme';

interface SingleSelectListProps {
  options: string[];
  selected?: string;
  onChange: (option: string) => void;
}

export function SingleSelectList({ options, selected, onChange }: SingleSelectListProps) {
  return (
    <View style={styles.list}>
      {options.map((option) => {
        const isActive = option === selected;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.row, isActive && styles.rowActive]}
            onPress={() => onChange(option)}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{option}</Text>
            {isActive && <CheckCircle2 size={20} color={colors.radioactiveGrass} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  rowActive: {
    backgroundColor: colors.darkSpruce,
    borderColor: colors.darkSpruce,
  },
  label: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  labelActive: {
    color: colors.white,
  },
});
