import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Store, Compass, Calendar, Plus } from 'lucide-react-native';
import { TopTabBar } from '@/components/TopTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TopTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="love-local"
        options={{
          title: 'Love Local',
          tabBarIcon: ({ color }) => <Store size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Compass size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="whats-on"
        options={{
          title: "What's on",
          tabBarIcon: ({ color }) => <Calendar size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: 'Share',
          tabBarIcon: ({ color }) => <Plus size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
