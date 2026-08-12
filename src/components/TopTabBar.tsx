import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts } from '../constants/fonts';
import { colors, layout } from '../constants/theme';

// expo-router vendors its own copy of @react-navigation/bottom-tabs' types
// (a slightly different ColorValue/string shape for the same runtime data),
// so deriving the prop type from Tabs' own `tabBar` signature — rather than
// importing BottomTabBarProps from @react-navigation/bottom-tabs directly —
// avoids a structural mismatch between the two packages' declarations.
type TopTabBarProps = NonNullable<React.ComponentProps<typeof Tabs>['tabBar']> extends (
  props: infer P
) => any
  ? P
  : never;

export function TopTabBar({ state, descriptors, navigation }: TopTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + layout.topBarGap }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;
          const isShare = route.name === 'share';
          const tintColor = isFocused ? colors.darkSpruce : colors.muted;

          const onPress = () => {
            if (isShare) {
              router.push('/share-modal');
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.7}
              accessibilityRole={isShare ? 'button' : 'tab'}
              accessibilityState={isShare ? undefined : { selected: isFocused }}
              accessibilityLabel={isShare ? 'Share something' : String(label)}
            >
              {options.tabBarIcon?.({ color: tintColor, size: 20, focused: isFocused })}
              <Text style={[styles.label, { color: tintColor }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    height: layout.topBarContentHeight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.sans.bold,
  },
});
