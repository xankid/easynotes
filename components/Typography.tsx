import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import colors from '@/constants/colors';

interface TypographyProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'button';
  color?: string;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  align = 'left',
  bold = false,
  style,
  children,
  ...props
}) => {
  const { fontSize, highContrast } = useSettingsStore();
  
  const getTextColor = () => {
    if (color) return color;
    if (highContrast) return colors.highContrast.text;
    return colors.text;
  };
  
  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.3; // Increased for better readability
      default: return 1;
    }
  };
  
  const getVariantStyles = () => {
    const multiplier = getFontSizeMultiplier();
    
    switch (variant) {
      case 'title':
        return {
          fontSize: 26 * multiplier, // Increased for better visibility
          fontWeight: '700',
          marginBottom: 10,
        };
      case 'subtitle':
        return {
          fontSize: 20 * multiplier, // Increased for better visibility
          fontWeight: '600',
          marginBottom: 8,
        };
      case 'body':
        return {
          fontSize: 16 * multiplier,
          lineHeight: 24 * multiplier, // Increased for better readability
        };
      case 'caption':
        return {
          fontSize: 14 * multiplier,
          color: colors.textLight,
        };
      case 'button':
        return {
          fontSize: 16 * multiplier,
          fontWeight: '600',
        };
      default:
        return {};
    }
  };
  
  return (
    <Text
      style={[
        styles.text,
        getVariantStyles(),
        { color: getTextColor(), textAlign: align },
        bold && styles.bold,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System',
  },
  bold: {
    fontWeight: 'bold',
  },
});