import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { Card } from './Card';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { getDaysInMonth, getMonthName } from '@/utils/dateUtils';
import { useReminderStore } from '@/store/reminderStore';
import { useSettingsStore } from '@/store/settingsStore';

interface CalendarViewProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onSelectDate,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  
  const { reminders } = useReminderStore();
  const { fontSize } = useSettingsStore();
  
  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.3;
      default: return 1;
    }
  };
  
  const multiplier = getFontSizeMultiplier();
  
  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth, currentYear]);
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days: Date[] = [];
    
    // Add days from previous month to fill the first row
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(new Date(prevMonthYear, prevMonth, daysInPrevMonth - i));
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    
    // Add days from next month to complete the last row
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(nextMonthYear, nextMonth, i));
    }
    
    setCalendarDays(days);
  };
  
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };
  
  const hasReminders = (date: Date) => {
    return reminders.some(reminder => {
      const reminderDate = new Date(reminder.date);
      return (
        reminderDate.getDate() === date.getDate() &&
        reminderDate.getMonth() === date.getMonth() &&
        reminderDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={goToPreviousMonth} 
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={styles.navButton}
        >
          <ChevronLeft size={28 * multiplier} color={colors.primary} />
        </TouchableOpacity>
        
        <Typography variant="subtitle" style={{ fontSize: 20 * multiplier }}>
          {getMonthName(currentMonth)} {currentYear}
        </Typography>
        
        <TouchableOpacity 
          onPress={goToNextMonth} 
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={styles.navButton}
        >
          <ChevronRight size={28 * multiplier} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <Typography 
              variant="body" 
              align="center"
              bold
              style={{ fontSize: 16 * multiplier }}
            >
              {day}
            </Typography>
          </View>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {calendarDays.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.day,
              { 
                width: `${100/7}%`,
                height: 45 * multiplier,
              },
              isToday(date) && styles.today,
              isSelectedDate(date) && styles.selected,
              !isCurrentMonth(date) && styles.otherMonth,
            ]}
            onPress={() => onSelectDate(date)}
          >
            <Typography
              variant="body"
              align="center"
              color={!isCurrentMonth(date) ? colors.textLight : undefined}
              style={{ fontSize: 16 * multiplier }}
            >
              {date.getDate()}
            </Typography>
            
            {hasReminders(date) && (
              <View
                style={[
                  styles.reminderDot,
                  isSelectedDate(date) && { backgroundColor: '#FFFFFF' },
                  { width: 8 * multiplier, height: 8 * multiplier }
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // Increased for better spacing
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Increased for better spacing
  },
  navButton: {
    padding: 8, // Added for better touch target
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 12, // Increased for better spacing
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10, // Increased for better spacing
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Increased for better visual
    padding: 4,
  },
  today: {
    backgroundColor: colors.today,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  otherMonth: {
    opacity: 0.5,
  },
  reminderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 4, // Increased for better spacing
  },
});