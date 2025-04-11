import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { Typography } from './Typography';
import { Note } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { Image, Mic, Paperclip } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {
  const { fontSize } = useSettingsStore();
  
  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.3;
      default: return 1;
    }
  };
  
  const multiplier = getFontSizeMultiplier();
  
  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(note)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Typography variant="subtitle" numberOfLines={1} style={{ flex: 1 }}>
            {note.title}
          </Typography>
          <Typography variant="caption" style={{ marginLeft: 8 }}>
            {formatDate(note.updatedAt)}
          </Typography>
        </View>
        
        <Typography variant="body" style={styles.content} numberOfLines={3}>
          {truncateContent(note.content)}
        </Typography>
        
        <View style={styles.footer}>
          <View style={styles.attachments}>
            {note.hasImage && (
              <View style={styles.attachmentIcon}>
                <Image size={18 * multiplier} color={colors.primary} />
              </View>
            )}
            {note.hasVoice && (
              <View style={styles.attachmentIcon}>
                <Mic size={18 * multiplier} color={colors.primary} />
              </View>
            )}
          </View>
          
          {note.tags.length > 0 && (
            <View style={styles.tags}>
              {note.tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Typography variant="caption" color={colors.primary}>
                    #{tag}
                  </Typography>
                </View>
              ))}
              {note.tags.length > 2 && (
                <Typography variant="caption" color={colors.primary}>
                  +{note.tags.length - 2}
                </Typography>
              )}
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16, // Increased for better spacing
    padding: 16, // Increased for better spacing
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Increased for better spacing
  },
  content: {
    marginBottom: 16, // Increased for better spacing
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachments: {
    flexDirection: 'row',
  },
  attachmentIcon: {
    marginRight: 12, // Increased for better spacing
  },
  tags: {
    flexDirection: 'row',
  },
  tag: {
    marginLeft: 10, // Increased for better spacing
  },
});