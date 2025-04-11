import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/types';

interface NoteState {
  notes: Note[];
  folders: string[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  getNotesByFolder: (folder: string) => Note[];
  getNotesByTag: (tag: string) => Note[];
  addFolder: (name: string) => void;
  deleteFolder: (name: string) => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      folders: ['Personal', 'Work', 'Health'],
      
      addNote: (note) => {
        const id = Date.now().toString();
        const now = new Date().toISOString();
        
        const newNote: Note = {
          id,
          createdAt: now,
          updatedAt: now,
          ...note,
        };
        
        set((state) => ({
          notes: [newNote, ...state.notes],
        }));
        
        return id;
      },
      
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) => 
            note.id === id 
              ? { 
                  ...note, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                } 
              : note
          ),
        }));
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },
      
      getNoteById: (id) => {
        return get().notes.find((note) => note.id === id);
      },
      
      getNotesByFolder: (folder) => {
        return get().notes.filter((note) => note.folder === folder);
      },
      
      getNotesByTag: (tag) => {
        return get().notes.filter((note) => note.tags.includes(tag));
      },
      
      addFolder: (name) => {
        if (!get().folders.includes(name)) {
          set((state) => ({
            folders: [...state.folders, name],
          }));
        }
      },
      
      deleteFolder: (name) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder !== name),
          notes: state.notes.map((note) => 
            note.folder === name 
              ? { ...note, folder: '' } 
              : note
          ),
        }));
      },
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);