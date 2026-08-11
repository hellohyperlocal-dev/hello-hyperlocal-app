import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

// The "Share" tab is a shortcut, not a real screen — TopTabBar intercepts
// taps and opens /share-modal directly. This exists only as a safety net
// for direct navigation (e.g. deep link) landing on this route.
export default function ShareTabScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/share-modal');
  }, []);

  return null;
}
