import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'medium',
  style,
  children,
  ...props
}) => {
  const { highContrast } = useSettingsStore();
  
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return 12; // Increased for better spacing
      case 'large': return 24; // Increased for better spacing
      default: return 18; // Increased for better spacing
    }
  };
  
  const getBorderColor = () => {
    return highContrast ? colors.highContrast.border : colors.border;
  };
  
  return (
    <View
      style={[
        styles.card,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && [
          styles.outlined, 
          { 
            borderColor: getBorderColor(),
            borderWidth: highContrast ? 2 : 1, // Thicker border for high contrast
          }
        ],
        variant === 'filled' && styles.filled,
        { padding: getPadding() },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16, // Increased for better visual
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // Increased for better visibility
    shadowRadius: 6, // Increased for better visual
    elevation: 4, // Increased for better visual
  },
  outlined: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: colors.card,
  },
});