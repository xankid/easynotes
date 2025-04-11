import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import colors from '@/constants/colors';
import { Priority } from '@/types';
import { useSettingsStore } from '@/store/settingsStore';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'small' | 'medium' | 'large';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'medium',
}) => {
  const { fontSize } = useSettingsStore();
  
  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.3;
      default: return 1;
    }
  };
  
  const multiplier = getFontSizeMultiplier();
  
  const getBackgroundColor = () => {
    switch (priority) {
      case 'low':
        return colors.lowPriority;
      case 'medium':
        return colors.mediumPriority;
      case 'high':
        return colors.highPriority;
      default:
        return colors.lowPriority;
    }
  };
  
  const getSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 3 * multiplier,
          paddingHorizontal: 8 * multiplier,
          borderRadius: 6 * multiplier,
        };
      case 'large':
        return {
          paddingVertical: 8 * multiplier,
          paddingHorizontal: 16 * multiplier,
          borderRadius: 10 * multiplier,
        };
      default:
        return {
          paddingVertical: 5 * multiplier,
          paddingHorizontal: 10 * multiplier,
          borderRadius: 8 * multiplier,
        };
    }
  };
  
  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'caption';
      case 'large':
        return 'body';
      default:
        return 'caption';
    }
  };
  
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getBackgroundColor() },
        getSize(),
      ]}
    >
      <Typography
        variant={getTextVariant()}
        color="#FFFFFF"
        bold
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
});