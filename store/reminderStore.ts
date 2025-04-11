import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '@/types';

interface ReminderState {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => string;
  updateReminder: (id: string, updates: Partial<Omit<Reminder, 'id'>>) => void;
  deleteReminder: (id: string) => void;
  getReminderById: (id: string) => Reminder | undefined;
  getRemindersByDate: (date: string) => Reminder[];
  getUpcomingReminders: (days: number) => Reminder[];
  toggleComplete: (id: string) => void;
  linkNoteToReminder: (reminderId: string, noteId: string) => void;
  unlinkNoteFromReminder: (reminderId: string) => void;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      
      addReminder: (reminder) => {
        const id = Date.now().toString();
        
        const newReminder: Reminder = {
          id,
          ...reminder,
        };
        
        set((state) => ({
          reminders: [newReminder, ...state.reminders],
        }));
        
        return id;
      },
      
      updateReminder: (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) => 
            reminder.id === id 
              ? { ...reminder, ...updates } 
              : reminder
          ),
        }));
      },
      
      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },
      
      getReminderById: (id) => {
        return get().reminders.find((reminder) => reminder.id === id);
      },
      
      getRemindersByDate: (dateString) => {
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        
        return get().reminders.filter((reminder) => {
          const reminderDate = new Date(reminder.date);
          reminderDate.setHours(0, 0, 0, 0);
          return reminderDate.getTime() === date.getTime();
        });
      },
      
      getUpcomingReminders: (days) => {
        const now = new Date();
        const future = new Date();
        future.setDate(future.getDate() + days);
        
        return get().reminders.filter((reminder) => {
          const reminderDate = new Date(reminder.date);
          return reminderDate >= now && reminderDate <= future && !reminder.isCompleted;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
      
      toggleComplete: (id) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) => 
            reminder.id === id 
              ? { ...reminder, isCompleted: !reminder.isCompleted } 
              : reminder
          ),
        }));
      },
      
      linkNoteToReminder: (reminderId, noteId) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) => 
            reminder.id === reminderId 
              ? { ...reminder, linkedNoteId: noteId } 
              : reminder
          ),
        }));
      },
      
      unlinkNoteFromReminder: (reminderId) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) => 
            reminder.id === reminderId 
              ? { ...reminder, linkedNoteId: undefined } 
              : reminder
          ),
        }));
      },
    }),
    {
      name: 'reminders-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);