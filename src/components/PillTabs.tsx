import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fonts } from '../constants/fonts';
import { colors, radius } from '../constants/theme';

interface PillTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export function PillTabs({ tabs, active, onChange }: PillTabsProps) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onChange(tab)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.softGreen,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: colors.darkSpruce,
  },
  label: {
    color: colors.hunterGreen,
    fontSize: 12,
    fontFamily: fonts.sans.bold,
  },
  labelActive: {
    color: colors.radioactiveGrass,
  },
});
