import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarView } from '@/components/CalendarView';
import { ReminderCard } from '@/components/ReminderCard';
import { EmptyState } from '@/components/EmptyState';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Typography } from '@/components/Typography';
import { useReminderStore } from '@/store/reminderStore';
import { Reminder } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { Calendar as CalendarIcon, Plus } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { reminders, toggleComplete } = useReminderStore();
  
  const remindersForSelectedDate = reminders.filter((reminder) => {
    const reminderDate = new Date(reminder.date);
    return (
      reminderDate.getDate() === selectedDate.getDate() &&
      reminderDate.getMonth() === selectedDate.getMonth() &&
      reminderDate.getFullYear() === selectedDate.getFullYear()
    );
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleReminderPress = (reminder: Reminder) => {
    router.push(`/reminder/${reminder.id}`);
  };
  
  const handleToggleComplete = (reminder: Reminder) => {
    toggleComplete(reminder.id);
  };
  
  const handleAddReminder = () => {
    router.push({
      pathname: '/reminder/new',
      params: { date: selectedDate.toISOString() }
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="title" style={styles.pageTitle}>Calendar</Typography>
      
      <CalendarView
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />
      
      <View style={styles.selectedDateHeader}>
        <Typography variant="subtitle">
          {formatDate(selectedDate)}
        </Typography>
        <Typography variant="caption" style={styles.reminderCount}>
          {remindersForSelectedDate.length} reminders
        </Typography>
      </View>
      
      {remindersForSelectedDate.length > 0 ? (
        <FlatList
          data={remindersForSelectedDate}
          renderItem={({ item }) => (
            <ReminderCard
              reminder={item}
              onPress={handleReminderPress}
              onToggleComplete={handleToggleComplete}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.remindersList}
        />
      ) : (
        <EmptyState
          title="No reminders for this day"
          description="Tap the + button to add a reminder for this date."
          icon={<CalendarIcon size={48} color={colors.textLight} />}
          actionLabel="Add Reminder"
          onAction={handleAddReminder}
        />
      )}
      
      <FloatingActionButton onPress={handleAddReminder} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  pageTitle: {
    marginBottom: 20,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  reminderCount: {
    fontSize: 16,
  },
  remindersList: {
    paddingBottom: 100,
  },
});