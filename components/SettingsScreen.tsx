import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

interface SettingsState {
  appearance: {
    darkMode: boolean;
    systemTheme: boolean;
  };
  notifications: {
    pushNotifications: boolean;
    courseReminders: boolean;
    streakReminders: boolean;
    teamChallenges: boolean;
    communityUpdates: boolean;
    emailDigest: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    showBadges: boolean;
    allowMentorRequests: boolean;
  };
  learning: {
    defaultLanguage: string;
    autoplayVideos: boolean;
    downloadQuality: 'high' | 'medium' | 'low';
    offlineMode: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  account: {
    twoFactorAuth: boolean;
    dataDownload: boolean;
    accountDeletion: boolean;
  };
}

interface SettingsScreenProps {
  onBack?: () => void;
  onLanguageSelect?: (language: string) => void;
  onThemeChange?: (isDark: boolean) => void;
}

const indianLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
];

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onLanguageSelect,
  onThemeChange,
}) => {
  const [settings, setSettings] = useState<SettingsState>({
    appearance: {
      darkMode: true,
      systemTheme: false,
    },
    notifications: {
      pushNotifications: true,
      courseReminders: true,
      streakReminders: true,
      teamChallenges: true,
      communityUpdates: false,
      emailDigest: true,
      weeklyReport: true,
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      showBadges: true,
      allowMentorRequests: true,
    },
    learning: {
      defaultLanguage: 'en',
      autoplayVideos: true,
      downloadQuality: 'high',
      offlineMode: false,
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
    },
    account: {
      twoFactorAuth: false,
      dataDownload: false,
      accountDeletion: false,
    },
  });

  const [animatedValues] = useState({
    fadeIn: new Animated.Value(0),
    slideUp: new Animated.Value(50),
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValues.fadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues.slideUp, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateSetting = <T extends keyof SettingsState>(
    section: T,
    key: keyof SettingsState[T],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));

    // Handle specific setting changes
    if (section === 'appearance' && key === 'darkMode') {
      onThemeChange?.(value);
    }
    if (section === 'learning' && key === 'defaultLanguage') {
      onLanguageSelect?.(value);
    }
  };

  const getLanguageName = (code: string) => {
    const lang = indianLanguages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : '🇺🇸 English';
  };

  const renderSettingSection = (
    title: string,
    icon: string,
    children: React.ReactNode
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name={icon as any} size={20} color={Colors.primary[500]} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const renderToggleSetting = (
    label: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void,
    iconName?: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        {iconName && (
          <MaterialIcons name={iconName as any} size={20} color={Colors.text.tertiary} />
        )}
        <View style={styles.settingText}>
          <Text style={styles.settingLabel}>{label}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.neutral[300], true: 'rgba(59, 130, 246, 0.5)' }}
        thumbColor={value ? Colors.primary[500] : Colors.neutral[400]}
      />
    </View>
  );

  const renderSelectionSetting = (
    label: string,
    subtitle: string,
    value: string,
    onPress: () => void,
    iconName?: string
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        {iconName && (
          <MaterialIcons name={iconName as any} size={20} color={Colors.text.tertiary} />
        )}
        <View style={styles.settingText}>
          <Text style={styles.settingLabel}>{label}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.settingValue}>
        <Text style={styles.settingValueText}>{value}</Text>
        <MaterialIcons name="chevron-right" size={20} color={Colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );

  const renderActionSetting = (
    label: string,
    subtitle: string,
    onPress: () => void,
    iconName: string,
    color: string = Colors.text.tertiary,
    showChevron: boolean = true
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <MaterialIcons name={iconName as any} size={20} color={color} />
        <View style={styles.settingText}>
          <Text style={[styles.settingLabel, { color: color }]}>{label}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {showChevron && (
        <MaterialIcons name="chevron-right" size={20} color={Colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );

  const handleLanguageSelection = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language for the app interface',
      [
        ...indianLanguages.map(lang => ({
          text: `${lang.flag} ${lang.name}`,
          onPress: () => updateSetting('learning', 'defaultLanguage', lang.code),
        })),
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handlePrivacySelection = () => {
    Alert.alert(
      'Profile Visibility',
      'Choose who can see your profile and progress',
      [
        {
          text: '🌍 Public - Everyone can see',
          onPress: () => updateSetting('privacy', 'profileVisibility', 'public'),
        },
        {
          text: '👥 Friends - Only connections',
          onPress: () => updateSetting('privacy', 'profileVisibility', 'friends'),
        },
        {
          text: '🔒 Private - Only you',
          onPress: () => updateSetting('privacy', 'profileVisibility', 'private'),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleFontSizeSelection = () => {
    Alert.alert(
      'Font Size',
      'Choose your preferred text size',
      [
        {
          text: 'Small',
          onPress: () => updateSetting('accessibility', 'fontSize', 'small'),
        },
        {
          text: 'Medium (Default)',
          onPress: () => updateSetting('accessibility', 'fontSize', 'medium'),
        },
        {
          text: 'Large',
          onPress: () => updateSetting('accessibility', 'fontSize', 'large'),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleQualitySelection = () => {
    Alert.alert(
      'Download Quality',
      'Choose video download quality for offline viewing',
      [
        {
          text: 'High (Best quality, larger size)',
          onPress: () => updateSetting('learning', 'downloadQuality', 'high'),
        },
        {
          text: 'Medium (Balanced)',
          onPress: () => updateSetting('learning', 'downloadQuality', 'medium'),
        },
        {
          text: 'Low (Smaller size, faster download)',
          onPress: () => updateSetting('learning', 'downloadQuality', 'low'),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleDataDownload = () => {
    Alert.alert(
      'Download Your Data',
      'We\'ll prepare a file with all your learning data, progress, and achievements. This may take a few minutes.',
      [
        {
          text: 'Request Download',
          onPress: () => {
            Alert.alert('Request Submitted', 'You\'ll receive an email with your data within 24 hours.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAccountDeletion = () => {
    Alert.alert(
      'Delete Account',
      '⚠️ This action cannot be undone. All your progress, certificates, and data will be permanently deleted.',
      [
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Are you absolutely sure? Type "DELETE" to confirm.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Deletion',
                  style: 'destructive',
                  onPress: () => {
                    // Handle account deletion
                    console.log('Account deletion requested');
                  },
                },
              ]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[500]} />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {/* Appearance Section */}
          {renderSettingSection('🎨 Appearance', 'palette', (
            <>
              {renderToggleSetting(
                'Dark Mode',
                'Use dark theme for better viewing in low light',
                settings.appearance.darkMode,
                () => updateSetting('appearance', 'darkMode', !settings.appearance.darkMode),
                'dark-mode'
              )}
              {renderToggleSetting(
                'System Theme',
                'Follow device theme settings automatically',
                settings.appearance.systemTheme,
                () => updateSetting('appearance', 'systemTheme', !settings.appearance.systemTheme),
                'sync'
              )}
            </>
          ))}

          {/* Notifications Section */}
          {renderSettingSection('🔔 Notifications', 'notifications', (
            <>
              {renderToggleSetting(
                'Push Notifications',
                'Receive notifications on your device',
                settings.notifications.pushNotifications,
                () => updateSetting('notifications', 'pushNotifications', !settings.notifications.pushNotifications),
                'notifications-active'
              )}
              {renderToggleSetting(
                'Course Reminders',
                'Get reminded about incomplete courses',
                settings.notifications.courseReminders,
                () => updateSetting('notifications', 'courseReminders', !settings.notifications.courseReminders),
                'school'
              )}
              {renderToggleSetting(
                'Streak Reminders',
                'Daily reminders to maintain your learning streak',
                settings.notifications.streakReminders,
                () => updateSetting('notifications', 'streakReminders', !settings.notifications.streakReminders),
                'local-fire-department'
              )}
              {renderToggleSetting(
                'Team Challenges',
                'Notifications about new team challenges',
                settings.notifications.teamChallenges,
                () => updateSetting('notifications', 'teamChallenges', !settings.notifications.teamChallenges),
                'emoji-events'
              )}
              {renderToggleSetting(
                'Community Updates',
                'New posts and discussions in community',
                settings.notifications.communityUpdates,
                () => updateSetting('notifications', 'communityUpdates', !settings.notifications.communityUpdates),
                'forum'
              )}
              {renderToggleSetting(
                'Email Digest',
                'Weekly summary of your learning progress',
                settings.notifications.emailDigest,
                () => updateSetting('notifications', 'emailDigest', !settings.notifications.emailDigest),
                'email'
              )}
            </>
          ))}

          {/* Privacy Section */}
          {renderSettingSection('🔒 Privacy', 'privacy-tip', (
            <>
              {renderSelectionSetting(
                'Profile Visibility',
                'Control who can see your profile and progress',
                settings.privacy.profileVisibility === 'public' ? '🌍 Public' :
                settings.privacy.profileVisibility === 'friends' ? '👥 Friends' : '🔒 Private',
                handlePrivacySelection,
                'visibility'
              )}
              {renderToggleSetting(
                'Show Progress',
                'Display your learning progress on profile',
                settings.privacy.showProgress,
                () => updateSetting('privacy', 'showProgress', !settings.privacy.showProgress),
                'trending-up'
              )}
              {renderToggleSetting(
                'Show Badges',
                'Display earned badges on your profile',
                settings.privacy.showBadges,
                () => updateSetting('privacy', 'showBadges', !settings.privacy.showBadges),
                'military-tech'
              )}
              {renderToggleSetting(
                'Allow Mentor Requests',
                'Let others request mentorship from you',
                settings.privacy.allowMentorRequests,
                () => updateSetting('privacy', 'allowMentorRequests', !settings.privacy.allowMentorRequests),
                'supervisor-account'
              )}
            </>
          ))}

          {/* Learning Preferences */}
          {renderSettingSection('📚 Learning', 'school', (
            <>
              {renderSelectionSetting(
                'Language',
                'Choose your preferred interface language',
                getLanguageName(settings.learning.defaultLanguage),
                handleLanguageSelection,
                'language'
              )}
              {renderToggleSetting(
                'Autoplay Videos',
                'Automatically play next video in sequence',
                settings.learning.autoplayVideos,
                () => updateSetting('learning', 'autoplayVideos', !settings.learning.autoplayVideos),
                'play-circle'
              )}
              {renderSelectionSetting(
                'Download Quality',
                'Video quality for offline downloads',
                settings.learning.downloadQuality.charAt(0).toUpperCase() + settings.learning.downloadQuality.slice(1),
                handleQualitySelection,
                'hd'
              )}
              {renderToggleSetting(
                'Offline Mode',
                'Download courses for offline learning',
                settings.learning.offlineMode,
                () => updateSetting('learning', 'offlineMode', !settings.learning.offlineMode),
                'cloud-download'
              )}
            </>
          ))}

          {/* Accessibility */}
          {renderSettingSection('♿ Accessibility', 'accessibility', (
            <>
              {renderSelectionSetting(
                'Font Size',
                'Adjust text size for better readability',
                settings.accessibility.fontSize.charAt(0).toUpperCase() + settings.accessibility.fontSize.slice(1),
                handleFontSizeSelection,
                'text-fields'
              )}
              {renderToggleSetting(
                'High Contrast',
                'Increase contrast for better visibility',
                settings.accessibility.highContrast,
                () => updateSetting('accessibility', 'highContrast', !settings.accessibility.highContrast),
                'contrast'
              )}
              {renderToggleSetting(
                'Reduce Motion',
                'Minimize animations and transitions',
                settings.accessibility.reducedMotion,
                () => updateSetting('accessibility', 'reducedMotion', !settings.accessibility.reducedMotion),
                'slow-motion-video'
              )}
              {renderToggleSetting(
                'Screen Reader Support',
                'Optimize for screen reading software',
                settings.accessibility.screenReader,
                () => updateSetting('accessibility', 'screenReader', !settings.accessibility.screenReader),
                'record-voice-over'
              )}
            </>
          ))}

          {/* Account & Security */}
          {renderSettingSection('🔐 Account & Security', 'security', (
            <>
              {renderToggleSetting(
                'Two-Factor Authentication',
                'Add extra security to your account',
                settings.account.twoFactorAuth,
                () => updateSetting('account', 'twoFactorAuth', !settings.account.twoFactorAuth),
                'security'
              )}
              {renderActionSetting(
                'Download My Data',
                'Request a copy of all your data',
                handleDataDownload,
                'download',
                Colors.primary[500]
              )}
              {renderActionSetting(
                'Delete Account',
                'Permanently delete your account and data',
                handleAccountDeletion,
                'delete-forever',
                Colors.error
              )}
            </>
          ))}

          {/* About */}
          {renderSettingSection('ℹ️ About', 'info', (
            <>
              {renderActionSetting(
                'Terms of Service',
                'Read our terms and conditions',
                () => console.log('Open Terms'),
                'description'
              )}
              {renderActionSetting(
                'Privacy Policy',
                'Learn how we protect your data',
                () => console.log('Open Privacy Policy'),
                'policy'
              )}
              {renderActionSetting(
                'Help & Support',
                'Get help or contact support',
                () => console.log('Open Help'),
                'help'
              )}
              {renderActionSetting(
                'App Version',
                'v1.0.0 (Build 100)',
                () => {},
                'info',
                Colors.text.tertiary,
                false
              )}
            </>
          ))}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  sectionContent: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    lineHeight: 16,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  settingValueText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});

export default SettingsScreen;
