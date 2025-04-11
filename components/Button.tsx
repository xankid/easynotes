import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  View,
  TouchableOpacityProps
} from 'react-native';
import { Typography } from './Typography';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  const { highContrast, fontSize } = useSettingsStore();
  
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    
    switch (variant) {
      case 'primary':
        return highContrast ? colors.highContrast.primary : colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return colors.primary;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return colors.textLight;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
        return highContrast ? colors.highContrast.primary : colors.primary;
      case 'text':
        return highContrast ? colors.highContrast.primary : colors.primary;
      default:
        return '#FFFFFF';
    }
  };
  
  const getBorderColor = () => {
    if (disabled) return colors.border;
    
    switch (variant) {
      case 'outline':
        return highContrast ? colors.highContrast.primary : colors.primary;
      default:
        return 'transparent';
    }
  };
  
  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.3;
      default: return 1;
    }
  };
  
  const getPadding = () => {
    const multiplier = getFontSizeMultiplier();
    
    switch (size) {
      case 'small':
        return { 
          paddingVertical: 8 * multiplier, 
          paddingHorizontal: 14 * multiplier 
        };
      case 'large':
        return { 
          paddingVertical: 16 * multiplier, 
          paddingHorizontal: 28 * multiplier 
        };
      default:
        return { 
          paddingVertical: 12 * multiplier, 
          paddingHorizontal: 20 * multiplier 
        };
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        { borderColor: getBorderColor() },
        variant === 'outline' && styles.outline,
        getPadding(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Typography
            variant="button"
            color={getTextColor()}
            align="center"
          >
            {title}
          </Typography>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10, // Increased for better touch targets
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 50, // Increased for better touch targets
  },
  outline: {
    borderWidth: 2, // Increased for better visibility
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 10, // Increased for better spacing
  },
  iconRight: {
    marginLeft: 10, // Increased for better spacing
  },
});