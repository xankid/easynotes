import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
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
    <View style={styles.container}>
      {icon && (
        <View style={[
          styles.iconContainer, 
          { transform: [{ scale: multiplier }] }
        ]}>
          {icon}
        </View>
      )}
      
      <Typography variant="subtitle" align="center" style={styles.title}>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body" align="center" color={colors.textLight} style={styles.description}>
          {description}
        </Typography>
      )}
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
          size="large"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24, // Increased for better spacing
  },
  title: {
    marginBottom: 12, // Increased for better spacing
  },
  description: {
    marginBottom: 32, // Increased for better spacing
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  button: {
    minWidth: 220, // Increased for better touch target
  },
});