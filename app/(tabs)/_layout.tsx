import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FileText, Calendar, Bell, Settings } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

export default function TabLayout() {
  const { fontSize } = useSettingsStore();
  
  // Get font size multiplier based on user settings
  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.2;
      default: return 1;
    }
  };
  
  const fontSizeMultiplier = getFontSizeMultiplier();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: {
          fontSize: 14 * fontSizeMultiplier,
          fontWeight: '500',
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          tabBarLabel: "Notes",
          tabBarIcon: ({ color }) => (
            <FileText size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarLabel: "Calendar",
          tabBarIcon: ({ color }) => (
            <Calendar size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Reminders",
          tabBarLabel: "Reminders",
          tabBarIcon: ({ color }) => (
            <Bell size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <Settings size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});