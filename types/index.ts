export type Priority = 'low' | 'medium' | 'high';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  hasVoice: boolean;
  voicePath?: string;
  hasImage: boolean;
  imagePath?: string;
  folder: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  isCompleted: boolean;
  isRecurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurringInterval?: number;
  priority: Priority;
  linkedNoteId?: string;
  notificationTime?: string; // minutes before
  notificationSound?: string;
  notificationVibration?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  notificationSounds: boolean;
  notificationVibration: boolean;
  defaultReminderAlert: number; // minutes before
}

export interface CalendarDay {
  date: Date;
  reminders: Reminder[];
  isToday: boolean;
  isSelected: boolean;
}