import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Typography } from '@/components/Typography';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useNoteStore } from '@/store/noteStore';
import { useReminderStore } from '@/store/reminderStore';
import { formatDate } from '@/utils/dateUtils';
import { Trash2, Bell, Tag, Folder, ArrowLeft, Save } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNewNote = id === 'new';
  
  const { getNoteById, addNote, updateNote, deleteNote, folders } = useNoteStore();
  const { addReminder } = useReminderStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState(folders[0] || '');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!isNewNote) {
      const note = getNoteById(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setFolder(note.folder);
        setTags(note.tags);
      }
    }
  }, [id, isNewNote]);
  
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isNewNote) {
        addNote({
          title,
          content,
          folder,
          tags,
          hasVoice: false,
          hasImage: false,
        });
      } else {
        updateNote(id, {
          title,
          content,
          folder,
          tags,
        });
      }
      
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteNote(id);
            router.back();
          },
        },
      ]
    );
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };
  
  const handleConvertToReminder = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please save your note first.');
      return;
    }
    
    router.push({
      pathname: '/reminder/new',
      params: {
        title,
        description: content,
        fromNote: 'true',
      },
    });
  };
  
  return (
    <>
      <Stack.Screen
        options={{
          title: isNewNote ? 'New Note' : 'Edit Note',
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
            placeholder="Note title"
          />
          
          <Input
            label="Content"
            value={content}
            onChangeText={setContent}
            placeholder="Write your note here..."
            multiline
            numberOfLines={Platform.OS === 'ios' ? 0 : 10}
            textAlignVertical="top"
            style={styles.contentInput}
          />
          
          <Card style={styles.metadataCard}>
            <View style={styles.folderSection}>
              <View style={styles.sectionHeader}>
                <Folder size={20} color={colors.text} style={styles.sectionIcon} />
                <Typography variant="subtitle">Folder</Typography>
              </View>
              
              <View style={styles.folderOptions}>
                {folders.map((f) => (
                  <Typography
                    key={f}
                    variant="body"
                    style={[
                      styles.folderOption,
                      folder === f && styles.selectedFolder,
                    ]}
                    color={folder === f ? '#FFFFFF' : colors.text}
                    onPress={() => setFolder(f)}
                  >
                    {f}
                  </Typography>
                ))}
              </View>
            </View>
            
            <View style={styles.tagsSection}>
              <View style={styles.sectionHeader}>
                <Tag size={20} color={colors.text} style={styles.sectionIcon} />
                <Typography variant="subtitle">Tags</Typography>
              </View>
              
              <View style={styles.tagInput}>
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={handleAddTag}
                  returnKeyType="done"
                />
              </View>
              
              <View style={styles.tagsList}>
                {tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Typography variant="body" color="#FFFFFF">
                      #{tag}
                    </Typography>
                    <Typography
                      variant="body"
                      color="#FFFFFF"
                      style={styles.removeTag}
                      onPress={() => handleRemoveTag(tag)}
                    >
                      ×
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          </Card>
          
          <View style={styles.actionsContainer}>
            <Button
              title="Convert to Reminder"
              variant="outline"
              icon={<Bell size={20} color={colors.primary} />}
              onPress={handleConvertToReminder}
              style={styles.actionButton}
            />
            
            {!isNewNote && (
              <Button
                title="Delete Note"
                variant="outline"
                icon={<Trash2 size={20} color={colors.error} />}
                onPress={handleDelete}
                style={[styles.actionButton, styles.deleteButton]}
              />
            )}
          </View>
          
          {!isNewNote && (
            <Typography variant="caption" align="center" style={styles.lastUpdated}>
              Last updated: {formatDate(getNoteById(id)?.updatedAt || '')}
            </Typography>
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
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  metadataCard: {
    marginTop: 16,
  },
  folderSection: {
    marginBottom: 16,
  },
  tagsSection: {
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
  folderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  folderOption: {
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  selectedFolder: {
    backgroundColor: colors.primary,
  },
  tagInput: {
    marginBottom: 12,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  removeTag: {
    marginLeft: 4,
    fontSize: 18,
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
  lastUpdated: {
    marginBottom: 24,
  },
});