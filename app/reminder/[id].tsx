import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Typography } from '@/components/Typography';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useReminderStore } from '@/store/reminderStore';
import { useNoteStore } from '@/store/noteStore';
import { Priority } from '@/types';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { Trash2, FileText, Bell, Calendar, Clock, Save, Repeat, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function ReminderDetailScreen() {
  const { id, date: initialDate, title: initialTitle, description: initialDescription, fromNote } = 
    useLocalSearchParams<{ 
      id: string; 
      date?: string; 
      title?: string; 
      description?: string;
      fromNote?: string;
    }>();
    
  const router = useRouter();
  const isNewReminder = id === 'new';
  
  const { getReminderById, addReminder, updateReminder, deleteReminder, linkNoteToReminder } = useReminderStore();
  const { getNoteById, addNote } = useNoteStore();
  
  const [title, setTitle] = useState(initialTitle || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [date, setDate] = useState(initialDate ? new Date(initialDate) : new Date());
  const [priority, setPriority] = useState<Priority>('medium');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isSaving, setIsSaving] = useState(false);
  const [linkedNoteId, setLinkedNoteId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (!isNewReminder) {
      const reminder = getReminderById(id);
      if (reminder) {
        setTitle(reminder.title);
        setDescription(reminder.description);
        setDate(new Date(reminder.date));
        setPriority(reminder.priority);
        setIsRecurring(reminder.isRecurring);
        if (reminder.recurringType) {
          setRecurringType(reminder.recurringType as 'daily' | 'weekly' | 'monthly');
        }
        setLinkedNoteId(reminder.linkedNoteId);
      }
    }
  }, [id, isNewReminder]);
  
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your reminder.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const reminderData = {
        title,
        description,
        date: date.toISOString(),
        isCompleted: false,
        isRecurring,
        recurringType: isRecurring ? recurringType : undefined,
        priority,
        linkedNoteId,
      };
      
      if (isNewReminder) {
        const newReminderId = addReminder(reminderData);
        
        // If coming from a note, create a note and link it
        if (fromNote === 'true' && title && description) {
          const newNoteId = addNote({
            title,
            content: description,
            folder: 'Personal',
            tags: [],
            hasVoice: false,
            hasImage: false,
          });
          
          linkNoteToReminder(newReminderId, newNoteId);
        }
      } else {
        updateReminder(id, reminderData);
      }
      
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save reminder. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteReminder(id);
            router.back();
          },
        },
      ]
    );
  };
  
  const handleConvertToNote = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please save your reminder first.');
      return;
    }
    
    router.push({
      pathname: '/note/new',
      params: {
        title,
        content: `${description}\n\nDue: ${formatDate(date)} at ${formatTime(date)}`,
      },
    });
  };
  
  return (
    <>
      <Stack.Screen
        options={{
          title: isNewReminder ? 'New Reminder' : 'Edit Reminder',
          headerRight: () => (
            <Button
              title="Save"
              variant="text"
              onPress={handleSave}
              loading={isSaving}
              icon={<Save size={20} color={colors.primary} />}
            />
          ),
        }}
      />
      
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Reminder title"
          />
          
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Add details..."
            multiline
            numberOfLines={Platform.OS === 'ios' ? 0 : 5}
            textAlignVertical="top"
            style={styles.descriptionInput}
          />
          
          <Card style={styles.detailsCard}>
            <View style={styles.dateTimeSection}>
              <View style={styles.sectionHeader}>
                <Calendar size={20} color={colors.text} style={styles.sectionIcon} />
                <Typography variant="subtitle">Date & Time</Typography>
              </View>
              
              <View style={styles.dateTimeInputs}>
                <Typography variant="body">
                  {formatDate(date)} at {formatTime(date)}
                </Typography>
                <Typography
                  variant="body"
                  color={colors.primary}
                  style={styles.changeDateButton}
                  onPress={() => {
                    // In a real app, this would open a date/time picker
                    Alert.alert('Date Picker', 'This would open a date picker in a real app.');
                  }}
                >
                  Change
                </Typography>
              </View>
            </View>
            
            <View style={styles.prioritySection}>
              <View style={styles.sectionHeader}>
                <AlertCircle size={20} color={colors.text} style={styles.sectionIcon} />
                <Typography variant="subtitle">Priority</Typography>
              </View>
              
              <View style={styles.priorityOptions}>
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <Typography
                    key={p}
                    variant="body"
                    style={[
                      styles.priorityOption,
                      priority === p && styles.selectedPriority,
                      priority === p && {
                        backgroundColor:
                          p === 'low'
                            ? colors.lowPriority
                            : p === 'medium'
                            ? colors.mediumPriority
                            : colors.highPriority,
                      },
                    ]}
                    color={priority === p ? '#FFFFFF' : colors.text}
                    onPress={() => setPriority(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Typography>
                ))}
              </View>
            </View>
            
            <View style={styles.recurringSection}>
              <View style={styles.sectionHeader}>
                <Repeat size={20} color={colors.text} style={styles.sectionIcon} />
                <Typography variant="subtitle">Recurring</Typography>
              </View>
              
              <View style={styles.recurringToggle}>
                <Typography variant="body">Repeat this reminder</Typography>
                <Button
                  title={isRecurring ? 'Yes' : 'No'}
                  variant={isRecurring ? 'primary' : 'outline'}
                  size="small"
                  onPress={() => setIsRecurring(!isRecurring)}
                />
              </View>
              
              {isRecurring && (
                <View style={styles.recurringOptions}>
                  {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                    <Typography
                      key={type}
                      variant="body"
                      style={[
                        styles.recurringOption,
                        recurringType === type && styles.selectedRecurring,
                      ]}
                      color={recurringType === type ? '#FFFFFF' : colors.text}
                      onPress={() => setRecurringType(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                  ))}
                </View>
              )}
            </View>
          </Card>
          
          <View style={styles.actionsContainer}>
            <Button
              title="Convert to Note"
              variant="outline"
              icon={<FileText size={20} color={colors.primary} />}
              onPress={handleConvertToNote}
              style={styles.actionButton}
            />
            
            {!isNewReminder && (
              <Button
                title="Delete Reminder"
                variant="outline"
                icon={<Trash2 size={20} color={colors.error} />}
                onPress={handleDelete}
                style={[styles.actionButton, styles.deleteButton]}
              />
            )}
          </View>
          
          {linkedNoteId && (
            <Card style={styles.linkedNoteCard}>
              <View style={styles.linkedNoteHeader}>
                <FileText size={20} color={colors.primary} style={styles.sectionIcon} />
                <Typography variant="subtitle">Linked Note</Typography>
              </View>
              
              <Typography
                variant="body"
                color={colors.primary}
                onPress={() => router.push(`/note/${linkedNoteId}`)}
              >
                {getNoteById(linkedNoteId)?.title || 'View linked note'}
              </Typography>
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  detailsCard: {
    marginTop: 16,
  },
  dateTimeSection: {
    marginBottom: 16,
  },
  prioritySection: {
    marginBottom: 16,
  },
  recurringSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  dateTimeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeDateButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  priorityOptions: {
    flexDirection: 'row',
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    textAlign: 'center',
  },
  selectedPriority: {
    backgroundColor: colors.primary,
  },
  recurringToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recurringOptions: {
    flexDirection: 'row',
  },
  recurringOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    textAlign: 'center',
  },
  selectedRecurring: {
    backgroundColor: colors.primary,
  },
  actionsContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: colors.error,
  },
  linkedNoteCard: {
    marginBottom: 24,
  },
  linkedNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});