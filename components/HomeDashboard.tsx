import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface UserProgress {
  currentStreak: number;
  weeklyProgress: number;
  monthlyProgress: number;
  totalXP: number;
  level: number;
  badges: Badge[];
  completedCourses: number;
  totalCourses: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

interface LearningRecommendation {
  id: string;
  title: string;
  category: 'AI' | 'Blockchain' | 'Product';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  thumbnail: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface HomeDashboardProps {
  userProgress: UserProgress;
  recommendations: LearningRecommendation[];
  assessmentResults?: any;
  personalizationData?: any;
  onStartLesson?: (lessonId: string) => void;
  onNavigateToLearningPath?: () => void;
  onModuleSelect?: (moduleId: string) => void;
  onViewProgress?: () => void;
  onViewLeaderboard?: () => void;
  onViewCertifications?: () => void;
  onProfile?: () => void;
  onDailyChallenge?: () => void;
  onCommunityFeed?: () => void;
  onPeerProjects?: () => void;
  onMentorship?: () => void;
  onAdminDashboard?: () => void;
  onSettings?: () => void;
  onNotifications?: () => void;
  onHelpSupport?: () => void;
  onCareerMapping?: () => void;
  onJobMarketplace?: () => void;
  onSkillWallet?: () => void;
}

const sampleUserProgress: UserProgress = {
  currentStreak: 7,
  weeklyProgress: 65,
  monthlyProgress: 78,
  totalXP: 2450,
  level: 5,
  badges: [
    { id: '1', name: 'AI Explorer', icon: 'psychology', color: Colors.primary[500], earnedAt: new Date() },
    { id: '2', name: 'Blockchain Pioneer', icon: 'link', color: Colors.secondary[500], earnedAt: new Date() },
    { id: '3', name: 'Product Guru', icon: 'lightbulb', color: Colors.accent.orange, earnedAt: new Date() },
    { id: '4', name: 'Week Warrior', icon: 'emoji-events', color: Colors.accent.emerald, earnedAt: new Date() },
  ],
  completedCourses: 12,
  totalCourses: 45,
};

const sampleRecommendations: LearningRecommendation[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    category: 'AI',
    difficulty: 'Intermediate',
    duration: '45 min',
    progress: 30,
    thumbnail: '🤖',
    description: 'Learn the fundamentals of ML algorithms and applications',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Smart Contract Development',
    category: 'Blockchain',
    difficulty: 'Advanced',
    duration: '60 min',
    progress: 0,
    thumbnail: '⛓️',
    description: 'Build and deploy smart contracts on Ethereum',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Product Market Fit Analysis',
    category: 'Product',
    difficulty: 'Intermediate',
    duration: '35 min',
    progress: 75,
    thumbnail: '📈',
    description: 'Strategies to achieve and validate product-market fit',
    priority: 'high',
  },
];

const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProgress = sampleUserProgress,
  recommendations = sampleRecommendations,
  assessmentResults,
  personalizationData,
  onStartLesson,
  onNavigateToLearningPath,
  onModuleSelect,
  onViewProgress,
  onViewLeaderboard,
  onViewCertifications,
  onProfile,
  onDailyChallenge,
  onCommunityFeed,
  onPeerProjects,
  onMentorship,
  onAdminDashboard,
  onSettings,
  onNotifications,
  onHelpSupport,
  onCareerMapping,
  onJobMarketplace,
  onSkillWallet,
}) => {
  const [greeting, setGreeting] = useState('');
  const [animatedValues] = useState({
    fadeIn: new Animated.Value(0),
    slideUp: new Animated.Value(50),
  });

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Animate entrance
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

  const getStreakMessage = () => {
    const streak = userProgress.currentStreak;
    if (streak >= 30) return '🔥 Legendary Streak!';
    if (streak >= 14) return '⭐ Amazing Streak!';
    if (streak >= 7) return '🚀 Great Streak!';
    if (streak >= 3) return '✨ Building Momentum!';
    return '💪 Keep Going!';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return Colors.primary[500];
      case 'Blockchain': return Colors.secondary[500];
      case 'Product': return Colors.accent.orange;
      default: return Colors.neutral[500];
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high': return { color: Colors.error, icon: 'priority-high' };
      case 'medium': return { color: Colors.warning, icon: 'remove' };
      case 'low': return { color: Colors.success, icon: 'keyboard-arrow-down' };
      default: return { color: Colors.neutral[500], icon: 'remove' };
    }
  };

  const ProgressRing = ({ progress, size = 60, strokeWidth = 6, color = Colors.primary[500] }: {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
  }) => {
    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ 
          width: size - strokeWidth, 
          height: size - strokeWidth,
          borderRadius: (size - strokeWidth) / 2,
          borderWidth: strokeWidth,
          borderColor: 'rgba(255,255,255,0.1)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: Colors.text.inverse, fontSize: 12, fontWeight: 'bold' }}>
            {progress}%
          </Text>
        </View>
      </View>
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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{greeting}! 👋</Text>
            <Text style={styles.userName}>Ready to level up?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={onProfile}>
            <LinearGradient colors={[Colors.primary[500], Colors.secondary[500]]} style={styles.profileGradient}>
              <Text style={styles.profileLevel}>L{userProgress.level}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Utility Navigation */}
      <Animated.View 
        style={[
          styles.utilityNav,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <TouchableOpacity style={styles.utilityButton} onPress={onNotifications}>
          <View style={[styles.utilityIcon, { backgroundColor: `${Colors.accent.orange}20` }]}>
            <MaterialIcons name="notifications" size={20} color={Colors.accent.orange} />
          </View>
          <Text style={styles.utilityLabel}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.utilityButton} onPress={onSettings}>
          <View style={[styles.utilityIcon, { backgroundColor: `${Colors.primary[500]}20` }]}>
            <MaterialIcons name="settings" size={20} color={Colors.primary[500]} />
          </View>
          <Text style={styles.utilityLabel}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.utilityButton} onPress={onHelpSupport}>
          <View style={[styles.utilityIcon, { backgroundColor: `${Colors.secondary[500]}20` }]}>
            <MaterialIcons name="help" size={20} color={Colors.secondary[500]} />
          </View>
          <Text style={styles.utilityLabel}>Help & Support</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Differentiator Features */}
      <Animated.View 
        style={[
          styles.differentiatorSection,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>🌟 Revolutionary Features</Text>
        <View style={styles.differentiatorNav}>
          <TouchableOpacity style={styles.differentiatorCard} onPress={onCareerMapping}>
            <LinearGradient 
              colors={[Colors.accent.purple, Colors.primary[500]]} 
              style={styles.differentiatorGradient}
            >
              <MaterialIcons name="trending-up" size={24} color={Colors.text.inverse} />
              <Text style={styles.differentiatorTitle}>Career Mapping</Text>
              <Text style={styles.differentiatorSubtitle}>AI-powered career guidance</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.differentiatorCard} onPress={onJobMarketplace}>
            <LinearGradient 
              colors={[Colors.accent.emerald, Colors.secondary[500]]} 
              style={styles.differentiatorGradient}
            >
              <MaterialIcons name="work" size={24} color={Colors.text.inverse} />
              <Text style={styles.differentiatorTitle}>Job Marketplace</Text>
              <Text style={styles.differentiatorSubtitle}>Internal gig board</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.differentiatorCard} onPress={onSkillWallet}>
            <LinearGradient 
              colors={[Colors.accent.orange, Colors.accent.purple]} 
              style={styles.differentiatorGradient}
            >
              <MaterialIcons name="account-balance-wallet" size={24} color={Colors.text.inverse} />
              <Text style={styles.differentiatorTitle}>Skill Wallet</Text>
              <Text style={styles.differentiatorSubtitle}>Blockchain certificates</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Progress Overview */}
        <Animated.View 
          style={[
            styles.progressSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Your Progress</Text>
          
          <View style={styles.progressCards}>
            {/* Streak Card */}
            <TouchableOpacity style={styles.streakCard}>
              <LinearGradient colors={[Colors.accent.orange, Colors.accent.pink]} style={styles.streakGradient}>
                <MaterialIcons name="local-fire-department" size={24} color="white" />
                <Text style={styles.streakNumber}>{userProgress.currentStreak}</Text>
                <Text style={styles.streakLabel}>Day Streak</Text>
                <Text style={styles.streakMessage}>{getStreakMessage()}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Progress Stats */}
            <View style={styles.progressStats}>
              <TouchableOpacity style={styles.progressCard} onPress={onViewProgress}>
                <Text style={styles.progressLabel}>Weekly Goal</Text>
                <ProgressRing progress={userProgress.weeklyProgress} size={50} color={Colors.accent.emerald} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.progressCard} onPress={onViewProgress}>
                <Text style={styles.progressLabel}>Monthly Goal</Text>
                <ProgressRing progress={userProgress.monthlyProgress} size={50} color={Colors.accent.purple} />
              </TouchableOpacity>
            </View>
          </View>

          {/* XP and Level */}
          <View style={styles.xpSection}>
            <View style={styles.xpCard}>
              <MaterialIcons name="star" size={20} color={Colors.accent.orange} />
              <Text style={styles.xpText}>{userProgress.totalXP} XP</Text>
            </View>
            <View style={styles.courseProgress}>
              <Text style={styles.courseText}>
                {userProgress.completedCourses}/{userProgress.totalCourses} Courses
              </Text>
              <View style={styles.courseProgressBar}>
                <View 
                  style={[
                    styles.courseProgressFill, 
                    { width: `${(userProgress.completedCourses / userProgress.totalCourses) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Today's Recommendations */}
        <Animated.View 
          style={[
            styles.recommendationsSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Recommendations</Text>
            <TouchableOpacity 
              style={styles.viewPathButton}
              onPress={onNavigateToLearningPath}
            >
              <Text style={styles.viewPathText}>View Path</Text>
              <MaterialIcons name="auto-awesome" size={16} color={Colors.accent.orange} />
            </TouchableOpacity>
          </View>

          {recommendations.map((recommendation) => (
            <TouchableOpacity
              key={recommendation.id}
              style={styles.recommendationCard}
              onPress={() => onStartLesson?.(recommendation.id)}
            >
              <View style={styles.recommendationHeader}>
                <View style={styles.recommendationThumbnail}>
                  <Text style={styles.thumbnailEmoji}>{recommendation.thumbnail}</Text>
                </View>
                <View style={styles.recommendationInfo}>
                  <View style={styles.recommendationTitleRow}>
                    <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                    <View style={styles.priorityIndicator}>
                      <MaterialIcons 
                        name={getPriorityIndicator(recommendation.priority).icon as any} 
                        size={12} 
                        color={getPriorityIndicator(recommendation.priority).color} 
                      />
                    </View>
                  </View>
                  <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
                  <View style={styles.recommendationMeta}>
                    <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(recommendation.category)}20` }]}>
                      <Text style={[styles.categoryText, { color: getCategoryColor(recommendation.category) }]}>
                        {recommendation.category}
                      </Text>
                    </View>
                    <Text style={styles.duration}>{recommendation.duration}</Text>
                    <Text style={styles.difficulty}>{recommendation.difficulty}</Text>
                  </View>
                </View>
              </View>
              
              {recommendation.progress > 0 && (
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${recommendation.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{recommendation.progress}% Complete</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Badges & Achievements */}
        <Animated.View 
          style={[
            styles.badgesSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
            {userProgress.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={[styles.badgeIcon, { backgroundColor: `${badge.color}20` }]}>
                  <MaterialIcons name={badge.icon as any} size={24} color={badge.color} />
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.quickActionsSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={onViewLeaderboard}>
              <MaterialIcons name="leaderboard" size={24} color={Colors.accent.emerald} />
              <Text style={styles.actionText}>Leaderboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={onViewCertifications}>
              <MaterialIcons name="verified" size={24} color={Colors.accent.purple} />
              <Text style={styles.actionText}>Certificates</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={onViewProgress}>
              <MaterialIcons name="analytics" size={24} color={Colors.accent.orange} />
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={onDailyChallenge}>
              <MaterialIcons name="flash-on" size={24} color={Colors.warning} />
              <Text style={styles.actionText}>Daily Challenge</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Community & Peer Learning Section */}
        <Animated.View 
          style={[
            styles.xpSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
              flexDirection: 'column',
              alignItems: 'stretch',
              paddingHorizontal: Spacing.lg,
              paddingVertical: Spacing.md,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>🟣 Community & Peer Learning</Text>
          <View style={styles.communityActions}>
            <TouchableOpacity style={styles.communityCard} onPress={onCommunityFeed}>
              <MaterialIcons name="forum" size={24} color={Colors.primary[500]} />
              <Text style={styles.communityTitle}>Community Feed</Text>
              <Text style={styles.communitySubtitle}>Discussion threads, Q&A, tips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.communityCard} onPress={onPeerProjects}>
              <MaterialIcons name="work" size={24} color={Colors.secondary[500]} />
              <Text style={styles.communityTitle}>Peer Projects</Text>
              <Text style={styles.communitySubtitle}>Showcase & discover projects</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.communityCard} onPress={onMentorship}>
              <MaterialIcons name="supervisor-account" size={24} color={Colors.accent.orange} />
              <Text style={styles.communityTitle}>1:1 Mentorship</Text>
              <Text style={styles.communitySubtitle}>Book sessions with experts</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Admin & Management Section */}
        <Animated.View 
          style={[
            styles.xpSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
              flexDirection: 'column',
              alignItems: 'stretch',
              paddingHorizontal: Spacing.lg,
              paddingVertical: Spacing.md,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>🔴 Admin & Company-Facing</Text>
          <View style={styles.communityActions}>
            <TouchableOpacity style={styles.communityCard} onPress={onAdminDashboard}>
              <MaterialIcons name="admin-panel-settings" size={24} color={Colors.error} />
              <Text style={styles.communityTitle}>Admin Dashboard</Text>
              <Text style={styles.communitySubtitle}>Track employee progress & ROI</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: Colors.text.tertiary,
  },
  profileButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  progressSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  progressCards: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  streakCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  streakGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 4,
  },
  streakLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  streakMessage: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginTop: 4,
  },
  progressStats: {
    flex: 1,
    gap: Spacing.md,
  },
  progressCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
  },
  xpSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  courseProgress: {
    flex: 1,
  },
  courseText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  courseProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  courseProgressFill: {
    height: '100%',
    backgroundColor: Colors.accent.emerald,
    borderRadius: 3,
  },
  recommendationsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  recommendationCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recommendationHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  recommendationThumbnail: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailEmoji: {
    fontSize: 24,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    flex: 1,
  },
  priorityIndicator: {
    marginLeft: Spacing.sm,
  },
  recommendationDescription: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  recommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  difficulty: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent.emerald,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 4,
    textAlign: 'right',
  },
  badgesSection: {
    marginBottom: Spacing.xl,
  },
  badgesScroll: {
    paddingLeft: Spacing.lg,
  },
  badgeCard: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 80,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badgeName: {
    fontSize: 12,
    color: Colors.text.inverse,
    textAlign: 'center',
    fontWeight: '500',
  },
  quickActionsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionText: {
    fontSize: 14,
    color: Colors.text.inverse,
    marginTop: Spacing.sm,
    fontWeight: '500',
  },
  viewPathButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
  },
  viewPathText: {
    fontSize: 12,
    color: Colors.accent.orange,
    fontWeight: '500',
  },
  communityActions: {
    gap: Spacing.md,
  },
  communityCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  communityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  communitySubtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  utilityNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  utilityButton: {
    alignItems: 'center',
    flex: 1,
  },
  utilityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  utilityLabel: {
    fontSize: 11,
    color: Colors.text.tertiary,
    fontWeight: '500',
    textAlign: 'center',
  },
  differentiatorSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  differentiatorNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  differentiatorCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  differentiatorGradient: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  differentiatorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  differentiatorSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: Spacing.xs / 2,
  },
});

export default HomeDashboard;
