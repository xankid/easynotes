import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ReminderCard } from '@/components/ReminderCard';
import { EmptyState } from '@/components/EmptyState';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';
import { useReminderStore } from '@/store/reminderStore';
import { Reminder } from '@/types';
import { Bell, Search, Plus } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function RemindersScreen() {
  const router = useRouter();
  const { reminders, toggleComplete } = useReminderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  
  const filteredReminders = reminders
    .filter((reminder) => {
      const matchesSearch = 
        reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reminder.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filter === 'all' ||
        (filter === 'upcoming' && !reminder.isCompleted) ||
        (filter === 'completed' && reminder.isCompleted);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by completion status first, then by date
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  
  const handleReminderPress = (reminder: Reminder) => {
    router.push(`/reminder/${reminder.id}`);
  };
  
  const handleToggleComplete = (reminder: Reminder) => {
    toggleComplete(reminder.id);
  };
  
  const handleAddReminder = () => {
    router.push('/reminder/new');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="title">My Reminders</Typography>
        <Typography variant="caption" style={styles.reminderCount}>
          {reminders.length} reminders
        </Typography>
      </View>
      
      <Input
        placeholder="Search reminders..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Search size={22} color={colors.textLight} />}
        containerStyle={styles.searchContainer}
      />
      
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'all' && styles.selectedFilterTab,
          ]}
          onPress={() => setFilter('all')}
        >
          <Typography
            variant="body"
            color={filter === 'all' ? '#FFFFFF' : colors.text}
          >
            All
          </Typography>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'upcoming' && styles.selectedFilterTab,
          ]}
          onPress={() => setFilter('upcoming')}
        >
          <Typography
            variant="body"
            color={filter === 'upcoming' ? '#FFFFFF' : colors.text}
          >
            Upcoming
          </Typography>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'completed' && styles.selectedFilterTab,
          ]}
          onPress={() => setFilter('completed')}
        >
          <Typography
            variant="body"
            color={filter === 'completed' ? '#FFFFFF' : colors.text}
          >
            Completed
          </Typography>
        </TouchableOpacity>
      </View>
      
      {filteredReminders.length > 0 ? (
        <FlatList
          data={filteredReminders}
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
          title="No reminders found"
          description={
            searchQuery
              ? "We couldn't find any reminders matching your search."
              : "You don't have any reminders yet. Tap the + button to create one."
          }
          icon={<Bell size={48} color={colors.textLight} />}
          actionLabel="Create Reminder"
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
  header: {
    marginBottom: 20,
  },
  reminderCount: {
    marginTop: 4,
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  selectedFilterTab: {
    backgroundColor: colors.primary,
  },
  remindersList: {
    paddingBottom: 100,
  },
});