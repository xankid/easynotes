import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { NoteCard } from '@/components/NoteCard';
import { EmptyState } from '@/components/EmptyState';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';
import { useNoteStore } from '@/store/noteStore';
import { Note } from '@/types';
import { FileText, Search, Plus } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function NotesScreen() {
  const router = useRouter();
  const { notes, folders } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFolder = selectedFolder === 'All' || note.folder === selectedFolder;
    
    return matchesSearch && matchesFolder;
  });
  
  const handleNotePress = (note: Note) => {
    router.push(`/note/${note.id}`);
  };
  
  const handleAddNote = () => {
    router.push('/note/new');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="title">My Notes</Typography>
        <Typography variant="caption" style={styles.noteCount}>{notes.length} notes</Typography>
      </View>
      
      <Input
        placeholder="Search notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Search size={22} color={colors.textLight} />}
        containerStyle={styles.searchContainer}
      />
      
      <View style={styles.folderTabs}>
        <FlatList
          data={['All', ...folders]}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.folderTab,
                selectedFolder === item && styles.selectedFolderTab,
              ]}
              onPress={() => setSelectedFolder(item)}
            >
              <Typography
                variant="body"
                color={selectedFolder === item ? '#FFFFFF' : colors.text}
              >
                {item}
              </Typography>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.folderTabsContent}
        />
      </View>
      
      {filteredNotes.length > 0 ? (
        <FlatList
          data={filteredNotes}
          renderItem={({ item }) => (
            <NoteCard note={item} onPress={handleNotePress} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notesList}
        />
      ) : (
        <EmptyState
          title="No notes found"
          description={
            searchQuery
              ? "We couldn't find any notes matching your search."
              : "You don't have any notes yet. Tap the + button to create one."
          }
          icon={<FileText size={48} color={colors.textLight} />}
          actionLabel="Create Note"
          onAction={handleAddNote}
        />
      )}
      
      <FloatingActionButton onPress={handleAddNote} />
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
  noteCount: {
    marginTop: 4,
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  folderTabs: {
    marginBottom: 20,
  },
  folderTabsContent: {
    paddingRight: 20,
  },
  folderTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: colors.card,
  },
  selectedFolderTab: {
    backgroundColor: colors.primary,
  },
  notesList: {
    paddingBottom: 100,
  },
});