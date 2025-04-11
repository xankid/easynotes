import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Plus } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  style,
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
  
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        { 
          width: 64 * multiplier, 
          height: 64 * multiplier,
          borderRadius: 32 * multiplier,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon || <Plus size={28 * multiplier} color="#FFFFFF" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});