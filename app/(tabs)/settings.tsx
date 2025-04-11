import React from 'react';
import { View, StyleSheet, ScrollView, Switch, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/Typography';
import { Card } from '@/components/Card';
import { useSettingsStore } from '@/store/settingsStore';
import { Sun, Moon, Type, Eye, Bell, Vibrate } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function SettingsScreen() {
  const settings = useSettingsStore();
  
  const handleThemeChange = (value: boolean) => {
    settings.updateSettings({ theme: value ? 'dark' : 'light' });
  };
  
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    settings.updateSettings({ fontSize: size });
  };
  
  const handleHighContrastChange = (value: boolean) => {
    settings.updateSettings({ highContrast: value });
  };
  
  const handleNotificationSoundsChange = (value: boolean) => {
    settings.updateSettings({ notificationSounds: value });
  };
  
  const handleNotificationVibrationChange = (value: boolean) => {
    settings.updateSettings({ notificationVibration: value });
  };
  
  const handleDefaultReminderAlertChange = (minutes: number) => {
    settings.updateSettings({ defaultReminderAlert: minutes });
  };
  
  const getFontSizeMultiplier = () => {
    switch (settings.fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.3;
      default: return 1;
    }
  };
  
  const multiplier = getFontSizeMultiplier();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Typography variant="title" style={styles.title}>Settings</Typography>
        
        <Card style={styles.section}>
          <Typography variant="subtitle" style={styles.sectionTitle}>Appearance</Typography>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              {settings.theme === 'dark' ? (
                <Moon size={24 * multiplier} color={colors.text} style={styles.settingIcon} />
              ) : (
                <Sun size={24 * multiplier} color={colors.text} style={styles.settingIcon} />
              )}
              <Typography variant="body" bold>Dark Mode</Typography>
            </View>
            <Switch
              value={settings.theme === 'dark'}
              onValueChange={handleThemeChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scale: multiplier }] }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Type size={24 * multiplier} color={colors.text} style={styles.settingIcon} />
              <Typography variant="body" bold>Font Size</Typography>
            </View>
            <View style={styles.fontSizeOptions}>
              <TouchableOpacity
                style={[
                  styles.fontSizeOption,
                  settings.fontSize === 'small' && styles.selectedFontSize,
                ]}
                onPress={() => handleFontSizeChange('small')}
              >
                <Typography
                  variant="body"
                  color={settings.fontSize === 'small' ? '#FFFFFF' : colors.text}
                >
                  Small
                </Typography>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.fontSizeOption,
                  settings.fontSize === 'medium' && styles.selectedFontSize,
                ]}
                onPress={() => handleFontSizeChange('medium')}
              >
                <Typography
                  variant="body"
                  color={settings.fontSize === 'medium' ? '#FFFFFF' : colors.text}
                >
                  Medium
                </Typography>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.fontSizeOption,
                  settings.fontSize === 'large' && styles.selectedFontSize,
                ]}
                onPress={() => handleFontSizeChange('large')}
              >
                <Typography
                  variant="body"
                  color={settings.fontSize === 'large' ? '#FFFFFF' : colors.text}
                >
                  Large
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Eye size={24 * multiplier} color={colors.text} style={styles.settingIcon} />
              <Typography variant="body" bold>High Contrast</Typography>
            </View>
            <Switch
              value={settings.highContrast}
              onValueChange={handleHighContrastChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scale: multiplier }] }}
            />
          </View>
        </Card>
        
        <Card style={styles.section}>
          <Typography variant="subtitle" style={styles.sectionTitle}>Notifications</Typography>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Bell size={24 * multiplier} color={colors.text} style={styles.settingIcon} />
              <Typography variant="body" bold>Notification Sounds</Typography>
            </View>
            <Switch
              value={settings.notificationSounds}
              onValueChange={handleNotificationSoundsChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scale: multiplier }] }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Vibrate size={24 * multiplier} color={colors.text} style={styles.settingIcon} />
              <Typography variant="body" bold>Vibration</Typography>
            </View>
            <Switch
              value={settings.notificationVibration}
              onValueChange={handleNotificationVibrationChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scale: multiplier }] }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Typography variant="body" bold>Default Reminder Alert</Typography>
            </View>
            <View style={styles.reminderAlertOptions}>
              {[5, 15, 30, 60].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.reminderAlertOption,
                    settings.defaultReminderAlert === minutes && styles.selectedReminderAlert,
                  ]}
                  onPress={() => handleDefaultReminderAlertChange(minutes)}
                >
                  <Typography
                    variant="body"
                    color={settings.defaultReminderAlert === minutes ? '#FFFFFF' : colors.text}
                  >
                    {minutes} min
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>
        
        <Card style={styles.section}>
          <Typography variant="subtitle" style={styles.sectionTitle}>About</Typography>
          
          <View style={styles.aboutItem}>
            <Typography variant="body" bold>Version</Typography>
            <Typography variant="body" color={colors.textLight}>1.0.0</Typography>
          </View>
          
          <View style={styles.aboutItem}>
            <Typography variant="body" align="center" style={styles.aboutText}>
              Made with ❤️ for simplicity
            </Typography>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  fontSizeOptions: {
    flexDirection: 'row',
  },
  fontSizeOption: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedFontSize: {
    backgroundColor: colors.primary,
  },
  reminderAlertOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  reminderAlertOption: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedReminderAlert: {
    backgroundColor: colors.primary,
  },
  aboutItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutText: {
    width: '100%',
    paddingVertical: 8,
  },
});