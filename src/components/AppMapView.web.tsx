import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '../constants/theme';

type AppMapViewProps = {
  style?: any;
  children?: React.ReactNode;
};

// react-native-maps has no web support; this is a static placeholder so the
// web build renders instead of crashing. Native platforms use the real map
// (see AppMapView.tsx, picked up automatically via Metro's platform resolution).
const AppMapView = React.forwardRef<any, AppMapViewProps>(({ style }, ref) => {
  return (
    <View style={[styles.placeholder, style]}>
      <MapPin size={28} color={colors.hunterGreen} />
      <Text style={styles.text}>Map preview unavailable on web</Text>
    </View>
  );
});

export default AppMapView;

export function Marker() {
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
