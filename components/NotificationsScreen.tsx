import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

interface Notification {
  id: string;
  type: 'course' | 'streak' | 'achievement' | 'challenge' | 'community' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired?: boolean;
  metadata?: {
    courseId?: string;
    achievementId?: string;
    challengeId?: string;
    userId?: string;
    url?: string;
  };
}

interface NotificationGroup {
  title: string;
  notifications: Notification[];
}

interface NotificationsScreenProps {
  onBack?: () => void;
  onNotificationPress?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'streak',
    title: '🔥 Keep Your Streak Going!',
    message: 'You\'re on a 12-day learning streak! Complete today\'s lesson to continue.',
    timestamp: new Date('2025-08-26T08:00:00'),
    isRead: false,
    actionRequired: true,
  },
  {
    id: '2',
    type: 'achievement',
    title: '🏆 New Badge Earned!',
    message: 'Congratulations! You\'ve earned the "AI Pioneer" badge for completing 10 AI courses.',
    timestamp: new Date('2025-08-25T16:30:00'),
    isRead: false,
    metadata: { achievementId: 'ai-pioneer' },
  },
  {
    id: '3',
    type: 'challenge',
    title: '🚀 New Team Challenge Available',
    message: 'Join the "AI Innovation Hackathon" - 48 hours to build the next big thing!',
    timestamp: new Date('2025-08-25T14:15:00'),
    isRead: true,
    actionRequired: true,
    metadata: { challengeId: 'ai-hackathon-2025' },
  },
  {
    id: '4',
    type: 'course',
    title: '📚 Resume Your Learning',
    message: 'You\'re 75% through "Machine Learning Fundamentals". Ready to finish strong?',
    timestamp: new Date('2025-08-25T10:00:00'),
    isRead: true,
    metadata: { courseId: 'ml-fundamentals' },
  },
  {
    id: '5',
    type: 'community',
    title: '💬 New Comment on Your Project',
    message: 'Sarah Chen commented on your "Smart Home IoT" project: "Great implementation!"',
    timestamp: new Date('2025-08-24T18:45:00'),
    isRead: false,
    metadata: { userId: 'sarah-chen', url: '/projects/smart-home-iot' },
  },
  {
    id: '6',
    type: 'system',
    title: '🆕 New Course Added',
    message: 'Check out "Advanced Neural Networks" - perfect for your learning path!',
    timestamp: new Date('2025-08-24T12:00:00'),
    isRead: true,
    metadata: { courseId: 'advanced-neural-networks' },
  },
  {
    id: '7',
    type: 'course',
    title: '⏰ Course Reminder',
    message: 'Your enrolled course "Blockchain Development" has a new module available.',
    timestamp: new Date('2025-08-24T09:30:00'),
    isRead: true,
    metadata: { courseId: 'blockchain-dev' },
  },
  {
    id: '8',
    type: 'achievement',
    title: '🎯 Milestone Reached!',
    message: 'You\'ve completed 15 courses! You\'re now at Level 8.',
    timestamp: new Date('2025-08-23T20:15:00'),
    isRead: true,
  },
  {
    id: '9',
    type: 'community',
    title: '👥 New Mentorship Request',
    message: 'Alex Johnson wants to connect for blockchain development guidance.',
    timestamp: new Date('2025-08-23T15:20:00'),
    isRead: true,
    actionRequired: true,
    metadata: { userId: 'alex-johnson' },
  },
  {
    id: '10',
    type: 'challenge',
    title: '🏁 Challenge Results',
    message: 'Great job! You finished 2nd in the "Blockchain Knowledge Quiz" challenge.',
    timestamp: new Date('2025-08-22T19:00:00'),
    isRead: true,
    metadata: { challengeId: 'blockchain-quiz-aug-2025' },
  },
];

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onNotificationPress,
  onMarkAllRead,
}) => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [refreshing, setRefreshing] = useState(false);
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

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'course':
        return { name: 'school', color: Colors.primary[500] };
      case 'streak':
        return { name: 'local-fire-department', color: Colors.accent.orange };
      case 'achievement':
        return { name: 'emoji-events', color: Colors.warning };
      case 'challenge':
        return { name: 'emoji-events', color: Colors.secondary[500] };
      case 'community':
        return { name: 'forum', color: Colors.accent.purple };
      case 'system':
        return { name: 'info', color: Colors.accent.emerald };
      default:
        return { name: 'notifications', color: Colors.neutral[400] };
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return timestamp.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const groupNotificationsByDate = (notifications: Notification[]): NotificationGroup[] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups: NotificationGroup[] = [
      { title: 'Today', notifications: [] },
      { title: 'Yesterday', notifications: [] },
      { title: 'This Week', notifications: [] },
      { title: 'Earlier', notifications: [] },
    ];

    notifications.forEach(notification => {
      const notifDate = notification.timestamp;
      
      if (notifDate.toDateString() === today.toDateString()) {
        groups[0].notifications.push(notification);
      } else if (notifDate.toDateString() === yesterday.toDateString()) {
        groups[1].notifications.push(notification);
      } else if (notifDate >= thisWeek) {
        groups[2].notifications.push(notification);
      } else {
        groups[3].notifications.push(notification);
      }
    });

    return groups.filter(group => group.notifications.length > 0);
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
    
    onNotificationPress?.(notification);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    onMarkAllRead?.();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const groupedNotifications = groupNotificationsByDate(notifications);

  const renderNotification = (notification: Notification) => {
    const icon = getNotificationIcon(notification.type);
    
    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationItem,
          !notification.isRead && styles.unreadNotification,
        ]}
        onPress={() => handleNotificationPress(notification)}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.notificationIcon, { backgroundColor: `${icon.color}20` }]}>
            <MaterialIcons name={icon.name as any} size={20} color={icon.color} />
          </View>
          
          <View style={styles.notificationText}>
            <Text style={[
              styles.notificationTitle,
              !notification.isRead && styles.unreadTitle,
            ]}>
              {notification.title}
            </Text>
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
            <View style={styles.notificationMeta}>
              <Text style={styles.notificationTime}>
                {formatTimestamp(notification.timestamp)}
              </Text>
              {notification.actionRequired && (
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>Action Required</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        {!notification.isRead && (
          <View style={styles.unreadDot} />
        )}
        
        <MaterialIcons name="chevron-right" size={20} color={Colors.neutral[400]} />
      </TouchableOpacity>
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.markAllButton} 
          onPress={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          <MaterialIcons 
            name="done-all" 
            size={20} 
            color={unreadCount > 0 ? Colors.primary[500] : Colors.neutral[400]} 
          />
          <Text style={[
            styles.markAllText,
            { color: unreadCount > 0 ? Colors.primary[500] : Colors.neutral[400] }
          ]}>
            Mark All
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Stats */}
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <View style={styles.statItem}>
          <MaterialIcons name="circle-notifications" size={16} color={Colors.primary[500]} />
          <Text style={styles.statText}>{notifications.length} Total</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialIcons name="fiber-new" size={16} color={Colors.accent.orange} />
          <Text style={styles.statText}>{unreadCount} Unread</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialIcons name="priority-high" size={16} color={Colors.error} />
          <Text style={styles.statText}>
            {notifications.filter(n => n.actionRequired).length} Action Required
          </Text>
        </View>
      </Animated.View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary[500]}
            colors={[Colors.primary[500]]}
          />
        }
      >
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {groupedNotifications.length > 0 ? (
            groupedNotifications.map((group, groupIndex) => (
              <View key={groupIndex} style={styles.notificationGroup}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                <View style={styles.groupContent}>
                  {group.notifications.map(renderNotification)}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="notifications-none" size={64} color={Colors.neutral[400]} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySubtitle}>
                You're all caught up! We'll notify you when there's something new.
              </Text>
            </View>
          )}
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
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  unreadBadge: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  notificationGroup: {
    marginBottom: Spacing.xl,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  groupContent: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  unreadNotification: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: Spacing.md,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  unreadTitle: {
    color: Colors.text.inverse,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notificationTime: {
    fontSize: 11,
    color: Colors.text.tertiary,
  },
  actionBadge: {
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  actionBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
    marginRight: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['5xl'],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});

export default NotificationsScreen;
