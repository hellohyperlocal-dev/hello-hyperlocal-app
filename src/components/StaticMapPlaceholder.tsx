import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '../constants/theme';

type StaticMapPlaceholderProps = {
  style?: any;
  label?: string;
};

export const StaticMapPlaceholder = React.forwardRef<any, StaticMapPlaceholderProps>(
  ({ style, label = 'Map preview unavailable' }, ref) => {
    return (
      <View style={[styles.placeholder, style]}>
        <MapPin size={28} color={colors.hunterGreen} />
        <Text style={styles.text}>{label}</Text>
      </View>
    );
  }
);

export function StaticMapMarker() {
  return null;
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.softGreen,
    gap: 8,
  },
  text: {
    fontSize: 13,
    color: colors.hunterGreen,
  },
});
