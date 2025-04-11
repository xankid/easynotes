import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Typography } from './Typography';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}) => {
  const { fontSize, highContrast } = useSettingsStore();
  
  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.3;
      default: return 1;
    }
  };
  
  const multiplier = getFontSizeMultiplier();
  
  const getBorderColor = () => {
    if (error) return colors.error;
    return highContrast ? colors.highContrast.border : colors.border;
  };
  
  const getTextColor = () => {
    return highContrast ? colors.highContrast.text : colors.text;
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography
          variant="body"
          style={[styles.label, { fontSize: 16 * multiplier }]}
          color={highContrast ? colors.highContrast.text : undefined}
          bold
        >
          {label}
        </Typography>
      )}
      
      <View style={[
        styles.inputContainer,
        { 
          borderColor: getBorderColor(),
          borderWidth: highContrast ? 2 : 1,
          minHeight: 54 * multiplier, // Increased for better touch targets
        },
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            {
              color: getTextColor(),
              fontSize: 18 * multiplier, // Increased for better readability
              marginLeft: leftIcon ? 10 : 0,
              marginRight: rightIcon ? 10 : 0,
            },
            style,
          ]}
          placeholderTextColor={colors.textLight}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Typography
          variant="caption"
          color={colors.error}
          style={styles.error}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // Increased for better spacing
  },
  label: {
    marginBottom: 8, // Increased for better spacing
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10, // Increased for better visual
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    paddingVertical: 14, // Increased for better touch targets
    paddingHorizontal: 16, // Increased for better spacing
  },
  leftIcon: {
    paddingLeft: 16, // Increased for better spacing
  },
  rightIcon: {
    paddingRight: 16, // Increased for better spacing
  },
  error: {
    marginTop: 6, // Increased for better spacing
  },
});