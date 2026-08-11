import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { CheckCircle2 } from 'lucide-react-native';
import { colors } from '../../constants/theme';

interface CheckmarkAnimationProps {
  size?: number;
}

// Expo Go doesn't bundle lottie-react-native's native module, so requiring it
// there throws before render. Custom dev clients and standalone/EAS builds
// link it fine and get the real animation.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let CheckmarkAnimation: React.ComponentType<CheckmarkAnimationProps>;

if (isExpoGo) {
  CheckmarkAnimation = ({ size = 96 }: CheckmarkAnimationProps) => (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <CheckCircle2 size={size * 0.5} color={colors.darkSpruce} />
    </View>
  );
} else {
  const LottieView = require('lottie-react-native').default;
  CheckmarkAnimation = ({ size = 96 }: CheckmarkAnimationProps) => (
    <LottieView
      source={require('../../../assets/lottie/checkmark.json')}
      autoPlay
      loop={false}
      style={{ width: size, height: size }}
    />
  );
}

export default CheckmarkAnimation;

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.chipGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
