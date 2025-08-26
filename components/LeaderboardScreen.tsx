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

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  badges: number;
  rank: number;
  isCurrentUser?: boolean;
  department?: string;
  completedCourses: number;
}

interface LeaderboardScreenProps {
  onBack?: () => void;
  currentUserId?: string;
}

const timeFilters = ['Weekly', 'Monthly', 'All-time'] as const;
type TimeFilter = typeof timeFilters[number];

const sampleLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '👩‍💻',
    xp: 4250,
    level: 8,
    streak: 15,
    badges: 12,
    rank: 1,
    department: 'Engineering',
    completedCourses: 24,
  },
  {
    id: '2',
    name: 'Alex Kumar',
    avatar: '👨‍🚀',
    xp: 4100,
    level: 7,
    streak: 12,
    badges: 10,
    rank: 2,
    department: 'Product',
    completedCourses: 22,
  },
  {
    id: '3',
    name: 'Maya Rodriguez',
    avatar: '👩‍🎨',
    xp: 3950,
    level: 7,
    streak: 18,
    badges: 11,
    rank: 3,
    department: 'Design',
    completedCourses: 20,
  },
  {
    id: '4',
    name: 'You',
    avatar: '🚀',
    xp: 2450,
    level: 5,
    streak: 7,
    badges: 8,
    rank: 4,
    isCurrentUser: true,
    department: 'Product',
    completedCourses: 12,
  },
  {
    id: '5',
    name: 'David Park',
    avatar: '👨‍💼',
    xp: 2200,
    level: 4,
    streak: 5,
    badges: 6,
    rank: 5,
    department: 'Business',
    completedCourses: 15,
  },
  {
    id: '6',
    name: 'Lisa Wang',
    avatar: '👩‍🔬',
    xp: 2100,
    level: 4,
    streak: 9,
    badges: 7,
    rank: 6,
    department: 'Data Science',
    completedCourses: 11,
  },
  {
    id: '7',
    name: 'James Wilson',
    avatar: '👨‍🎓',
    xp: 1950,
    level: 4,
    streak: 3,
    badges: 5,
    rank: 7,
    department: 'Marketing',
    completedCourses: 9,
  },
  {
    id: '8',
    name: 'Emma Thompson',
    avatar: '👩‍💻',
    xp: 1800,
    level: 3,
    streak: 11,
    badges: 4,
    rank: 8,
    department: 'Engineering',
    completedCourses: 8,
  },
];

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  onBack,
  currentUserId = '4',
}) => {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('Weekly');
  const [leaderboardData, setLeaderboardData] = useState(sampleLeaderboardData);
  const [animatedValues] = useState({
    fadeIn: new Animated.Value(0),
    slideUp: new Animated.Value(50),
    podiumScale: new Animated.Value(0.8),
  });

  const currentUser = leaderboardData.find(entry => entry.id === currentUserId);
  const topThree = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

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
      Animated.spring(animatedValues.podiumScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return Colors.accent.orange; // Gold
      case 2: return Colors.neutral[400]; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return Colors.primary[500];
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return 'emoji-events';
      case 2: return 'military-tech';
      case 3: return 'workspace-premium';
      default: return 'person';
    }
  };

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1: return 120;
      case 2: return 100;
      case 3: return 80;
      default: return 60;
    }
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
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={styles.headerRight}>
          <MaterialIcons name="leaderboard" size={24} color={Colors.accent.emerald} />
        </View>
      </Animated.View>

      {/* Time Filter */}
      <Animated.View 
        style={[
          styles.filterSection,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <View style={styles.filterContainer}>
          {timeFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top 3 Podium */}
        <Animated.View 
          style={[
            styles.podiumSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ scale: animatedValues.podiumScale }],
            },
          ]}
        >
          <View style={styles.podiumContainer}>
            {/* Second Place */}
            {topThree[1] && (
              <View style={styles.podiumPosition}>
                <View style={styles.podiumProfile}>
                  <View style={[styles.podiumAvatar, { borderColor: getRankColor(2) }]}>
                    <Text style={styles.podiumAvatarText}>{topThree[1].avatar}</Text>
                  </View>
                  <View style={styles.rankBadge}>
                    <MaterialIcons name={getRankIcon(2) as any} size={16} color={getRankColor(2)} />
                    <Text style={[styles.rankNumber, { color: getRankColor(2) }]}>2</Text>
                  </View>
                  <Text style={styles.podiumName}>{topThree[1].name}</Text>
                  <Text style={styles.podiumXP}>{topThree[1].xp.toLocaleString()} XP</Text>
                </View>
                <View style={[styles.podiumBase, { height: getPodiumHeight(2), backgroundColor: getRankColor(2) }]} />
              </View>
            )}

            {/* First Place */}
            {topThree[0] && (
              <View style={styles.podiumPosition}>
                <View style={styles.podiumProfile}>
                  <View style={[styles.podiumAvatar, styles.firstPlaceAvatar, { borderColor: getRankColor(1) }]}>
                    <Text style={styles.podiumAvatarText}>{topThree[0].avatar}</Text>
                    <View style={styles.crownIcon}>
                      <MaterialIcons name="emoji-events" size={20} color={Colors.accent.orange} />
                    </View>
                  </View>
                  <View style={styles.rankBadge}>
                    <MaterialIcons name={getRankIcon(1) as any} size={16} color={getRankColor(1)} />
                    <Text style={[styles.rankNumber, { color: getRankColor(1) }]}>1</Text>
                  </View>
                  <Text style={styles.podiumName}>{topThree[0].name}</Text>
                  <Text style={styles.podiumXP}>{topThree[0].xp.toLocaleString()} XP</Text>
                </View>
                <View style={[styles.podiumBase, { height: getPodiumHeight(1), backgroundColor: getRankColor(1) }]} />
              </View>
            )}

            {/* Third Place */}
            {topThree[2] && (
              <View style={styles.podiumPosition}>
                <View style={styles.podiumProfile}>
                  <View style={[styles.podiumAvatar, { borderColor: getRankColor(3) }]}>
                    <Text style={styles.podiumAvatarText}>{topThree[2].avatar}</Text>
                  </View>
                  <View style={styles.rankBadge}>
                    <MaterialIcons name={getRankIcon(3) as any} size={16} color={getRankColor(3)} />
                    <Text style={[styles.rankNumber, { color: getRankColor(3) }]}>3</Text>
                  </View>
                  <Text style={styles.podiumName}>{topThree[2].name}</Text>
                  <Text style={styles.podiumXP}>{topThree[2].xp.toLocaleString()} XP</Text>
                </View>
                <View style={[styles.podiumBase, { height: getPodiumHeight(3), backgroundColor: getRankColor(3) }]} />
              </View>
            )}
          </View>
        </Animated.View>

        {/* Current User Highlight (if not in top 3) */}
        {currentUser && currentUser.rank > 3 && (
          <Animated.View 
            style={[
              styles.currentUserSection,
              {
                opacity: animatedValues.fadeIn,
                transform: [{ translateY: animatedValues.slideUp }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Your Ranking</Text>
            <View style={[styles.leaderboardItem, styles.currentUserItem]}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>#{currentUser.rank}</Text>
              </View>
              
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{currentUser.avatar}</Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{currentUser.name}</Text>
                  <Text style={styles.userDepartment}>{currentUser.department}</Text>
                </View>
              </View>

              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{currentUser.xp.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>XP</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{currentUser.streak}</Text>
                  <Text style={styles.statLabel}>Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{currentUser.badges}</Text>
                  <Text style={styles.statLabel}>Badges</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Full Leaderboard */}
        <Animated.View 
          style={[
            styles.leaderboardSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Rankings</Text>
          {leaderboardData.map((entry, index) => (
            <View 
              key={entry.id} 
              style={[
                styles.leaderboardItem,
                entry.isCurrentUser && styles.currentUserItem,
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={[
                  styles.rankText,
                  entry.rank <= 3 && { color: getRankColor(entry.rank) }
                ]}>
                  #{entry.rank}
                </Text>
                {entry.rank <= 3 && (
                  <MaterialIcons 
                    name={getRankIcon(entry.rank) as any} 
                    size={12} 
                    color={getRankColor(entry.rank)} 
                  />
                )}
              </View>
              
              <View style={styles.userInfo}>
                <View style={[
                  styles.avatarContainer,
                  entry.isCurrentUser && styles.currentUserAvatar
                ]}>
                  <Text style={styles.avatarText}>{entry.avatar}</Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={[
                    styles.userName,
                    entry.isCurrentUser && styles.currentUserName
                  ]}>
                    {entry.name}
                  </Text>
                  <Text style={styles.userDepartment}>{entry.department}</Text>
                </View>
              </View>

              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{entry.xp.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>XP</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{entry.streak}</Text>
                  <Text style={styles.statLabel}>Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{entry.badges}</Text>
                  <Text style={styles.statLabel}>Badges</Text>
                </View>
              </View>

              {entry.rank <= 3 && (
                <View style={styles.topRankIndicator}>
                  <MaterialIcons 
                    name="star" 
                    size={16} 
                    color={getRankColor(entry.rank)} 
                  />
                </View>
              )}
            </View>
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
  headerRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  podiumSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  podiumPosition: {
    alignItems: 'center',
  },
  podiumProfile: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    position: 'relative',
  },
  firstPlaceAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  podiumAvatarText: {
    fontSize: 24,
  },
  crownIcon: {
    position: 'absolute',
    top: -10,
    right: -5,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginTop: 4,
    textAlign: 'center',
  },
  podiumXP: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  podiumBase: {
    width: 80,
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
    opacity: 0.8,
  },
  currentUserSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
  },
  leaderboardSection: {
    paddingHorizontal: Spacing.lg,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currentUserItem: {
    borderColor: Colors.primary[500],
    borderWidth: 2,
    backgroundColor: `${Colors.primary[500]}10`,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
    gap: 2,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: Spacing.md,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  currentUserAvatar: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  avatarText: {
    fontSize: 18,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  currentUserName: {
    color: Colors.primary[500],
  },
  userDepartment: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  userStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  topRankIndicator: {
    marginLeft: Spacing.sm,
  },
});

export default LeaderboardScreen;
