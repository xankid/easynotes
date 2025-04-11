import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { Typography } from './Typography';
import { PriorityBadge } from './PriorityBadge';
import { Reminder } from '@/types';
import { formatTime, getRelativeTimeString } from '@/utils/dateUtils';
import { CheckCircle, Circle, Clock, FileText } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

interface ReminderCardProps {
  reminder: Reminder;
  onPress: (reminder: Reminder) => void;
  onToggleComplete: (reminder: Reminder) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onPress,
  onToggleComplete,
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
    <Card style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(reminder)}
        style={styles.container}
      >
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={() => onToggleComplete(reminder)}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            {reminder.isCompleted ? (
              <CheckCircle size={28 * multiplier} color={colors.success} />
            ) : (
              <Circle size={28 * multiplier} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentSection}>
          <View style={styles.header}>
            <Typography
              variant="subtitle"
              numberOfLines={1}
              style={[
                { flex: 1 },
                reminder.isCompleted && styles.completedText
              ]}
            >
              {reminder.title}
            </Typography>
            <PriorityBadge priority={reminder.priority} size="small" />
          </View>
          
          {reminder.description ? (
            <Typography
              variant="body"
              numberOfLines={2}
              style={[
                styles.description,
                reminder.isCompleted && styles.completedText,
              ]}
            >
              {reminder.description}
            </Typography>
          ) : null}
          
          <View style={styles.footer}>
            <View style={styles.timeContainer}>
              <Clock size={16 * multiplier} color={colors.textLight} style={styles.icon} />
              <Typography variant="caption">
                {getRelativeTimeString(reminder.date)}
              </Typography>
            </View>
            
            {reminder.isRecurring && (
              <Typography 
                variant="caption" 
                color={colors.primary}
                style={styles.recurringText}
              >
                {reminder.recurringType === 'daily'
                  ? 'Daily'
                  : reminder.recurringType === 'weekly'
                  ? 'Weekly'
                  : reminder.recurringType === 'monthly'
                  ? 'Monthly'
                  : 'Custom'}
              </Typography>
            )}
            
            {reminder.linkedNoteId && (
              <View style={styles.linkedNote}>
                <FileText size={16 * multiplier} color={colors.primary} style={styles.icon} />
                <Typography variant="caption" color={colors.primary}>
                  Note attached
                </Typography>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16, // Increased for better spacing
  },
  container: {
    flexDirection: 'row',
  },
  leftSection: {
    paddingRight: 16, // Increased for better spacing
    justifyContent: 'center',
  },
  contentSection: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Increased for better spacing
  },
  description: {
    marginBottom: 12, // Increased for better spacing
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16, // Increased for better spacing
  },
  recurringText: {
    marginRight: 16, // Increased for better spacing
  },
  linkedNote: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6, // Increased for better spacing
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
});