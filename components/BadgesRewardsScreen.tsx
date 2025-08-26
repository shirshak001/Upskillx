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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'Achievement' | 'Streak' | 'Skill' | 'Special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  isEarned: boolean;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
  coinReward: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  category: 'Perks' | 'Customization' | 'Learning' | 'Physical';
  availability: 'Available' | 'Limited' | 'Sold Out';
  isRedeemed?: boolean;
}

interface BadgesRewardsScreenProps {
  onBack?: () => void;
  userCoins?: number;
}

const sampleBadges: Badge[] = [
  {
    id: '1',
    name: 'AI Explorer',
    description: 'Complete your first AI course',
    icon: 'psychology',
    color: Colors.primary[500],
    category: 'Skill',
    rarity: 'Common',
    isEarned: true,
    earnedAt: new Date('2025-08-20'),
    xpReward: 100,
    coinReward: 50,
  },
  {
    id: '2',
    name: 'Blockchain Pioneer',
    description: 'Master blockchain fundamentals',
    icon: 'link',
    color: Colors.secondary[500],
    category: 'Skill',
    rarity: 'Rare',
    isEarned: true,
    earnedAt: new Date('2025-08-22'),
    xpReward: 200,
    coinReward: 100,
  },
  {
    id: '3',
    name: 'Product Guru',
    description: 'Complete 5 product management courses',
    icon: 'lightbulb',
    color: Colors.accent.orange,
    category: 'Achievement',
    rarity: 'Epic',
    isEarned: true,
    earnedAt: new Date('2025-08-25'),
    xpReward: 300,
    coinReward: 150,
  },
  {
    id: '4',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: 'emoji-events',
    color: Colors.accent.emerald,
    category: 'Streak',
    rarity: 'Common',
    isEarned: true,
    earnedAt: new Date('2025-08-26'),
    xpReward: 150,
    coinReward: 75,
  },
  {
    id: '5',
    name: 'Speed Learner',
    description: 'Complete 3 courses in one day',
    icon: 'flash-on',
    color: Colors.accent.purple,
    category: 'Achievement',
    rarity: 'Rare',
    isEarned: false,
    progress: 1,
    maxProgress: 3,
    xpReward: 250,
    coinReward: 125,
  },
  {
    id: '6',
    name: 'Perfectionist',
    description: 'Score 100% on 10 quizzes',
    icon: 'grade',
    color: Colors.warning,
    category: 'Achievement',
    rarity: 'Epic',
    isEarned: false,
    progress: 6,
    maxProgress: 10,
    xpReward: 400,
    coinReward: 200,
  },
  {
    id: '7',
    name: 'Community Helper',
    description: 'Help 20 fellow learners',
    icon: 'group',
    color: Colors.secondary[500],
    category: 'Special',
    rarity: 'Rare',
    isEarned: false,
    progress: 3,
    maxProgress: 20,
    xpReward: 300,
    coinReward: 150,
  },
  {
    id: '8',
    name: 'Streak Master',
    description: 'Maintain a 30-day learning streak',
    icon: 'local-fire-department',
    color: Colors.error,
    category: 'Streak',
    rarity: 'Legendary',
    isEarned: false,
    progress: 7,
    maxProgress: 30,
    xpReward: 500,
    coinReward: 300,
  },
];

const sampleRewards: Reward[] = [
  {
    id: '1',
    name: 'Premium Avatar',
    description: 'Unlock exclusive avatar customization',
    icon: 'face',
    cost: 500,
    category: 'Customization',
    availability: 'Available',
  },
  {
    id: '2',
    name: 'Private Mentor Session',
    description: '1-on-1 session with industry expert',
    icon: 'school',
    cost: 2000,
    category: 'Learning',
    availability: 'Limited',
  },
  {
    id: '3',
    name: 'Coffee Voucher',
    description: '$10 coffee shop gift card',
    icon: 'local-cafe',
    cost: 800,
    category: 'Physical',
    availability: 'Available',
  },
  {
    id: '4',
    name: 'Early Course Access',
    description: 'Get new courses 1 week early',
    icon: 'new-releases',
    cost: 1200,
    category: 'Perks',
    availability: 'Available',
  },
  {
    id: '5',
    name: 'Company Swag Pack',
    description: 'T-shirt, stickers, and more',
    icon: 'card-giftcard',
    cost: 1500,
    category: 'Physical',
    availability: 'Limited',
  },
  {
    id: '6',
    name: 'Skip Quiz Pass',
    description: 'Skip any quiz and get full points',
    icon: 'skip-next',
    cost: 300,
    category: 'Perks',
    availability: 'Available',
  },
];

const BadgesRewardsScreen: React.FC<BadgesRewardsScreenProps> = ({
  onBack,
  userCoins = 1250,
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'rewards'>('badges');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [animatedValues] = useState({
    fadeIn: new Animated.Value(0),
    slideUp: new Animated.Value(50),
    badgeScale: new Animated.Value(0.8),
  });

  const earnedBadges = sampleBadges.filter(badge => badge.isEarned);
  const unlockedBadges = sampleBadges.filter(badge => !badge.isEarned);

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
      Animated.spring(animatedValues.badgeScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return Colors.neutral[400];
      case 'Rare': return Colors.primary[500];
      case 'Epic': return Colors.accent.purple;
      case 'Legendary': return Colors.accent.orange;
      default: return Colors.neutral[400];
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return Colors.success;
      case 'Limited': return Colors.warning;
      case 'Sold Out': return Colors.error;
      default: return Colors.neutral[400];
    }
  };

  const renderBadgeCard = (badge: Badge) => (
    <TouchableOpacity
      key={badge.id}
      style={[
        styles.badgeCard,
        !badge.isEarned && styles.unlockedBadgeCard,
      ]}
      onPress={() => setSelectedBadge(badge)}
    >
      <LinearGradient
        colors={badge.isEarned ? [badge.color, `${badge.color}80`] : [Colors.neutral[700], Colors.neutral[800]]}
        style={styles.badgeGradient}
      >
        <View style={styles.badgeHeader}>
          <View style={[styles.badgeIcon, { backgroundColor: badge.isEarned ? 'rgba(255,255,255,0.2)' : Colors.neutral[600] }]}>
            <MaterialIcons 
              name={badge.icon as any} 
              size={24} 
              color={badge.isEarned ? 'white' : Colors.neutral[400]} 
            />
          </View>
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(badge.rarity) }]}>
            <Text style={styles.rarityText}>{badge.rarity}</Text>
          </View>
        </View>
        
        <Text style={[styles.badgeName, !badge.isEarned && styles.unlockedBadgeName]}>
          {badge.name}
        </Text>
        
        <Text style={[styles.badgeDescription, !badge.isEarned && styles.unlockedBadgeDescription]}>
          {badge.description}
        </Text>

        {!badge.isEarned && badge.progress !== undefined && badge.maxProgress && (
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(badge.progress / badge.maxProgress) * 100}%`,
                    backgroundColor: badge.color,
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {badge.progress}/{badge.maxProgress}
            </Text>
          </View>
        )}

        {badge.isEarned && (
          <View style={styles.badgeFooter}>
            <View style={styles.rewardInfo}>
              <MaterialIcons name="monetization-on" size={14} color={Colors.accent.orange} />
              <Text style={styles.rewardText}>{badge.coinReward}</Text>
            </View>
            <Text style={styles.earnedDate}>
              {badge.earnedAt?.toLocaleDateString()}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderRewardCard = (reward: Reward) => (
    <View key={reward.id} style={styles.rewardCard}>
      <View style={styles.rewardHeader}>
        <View style={[styles.rewardIcon, { backgroundColor: `${Colors.primary[500]}20` }]}>
          <MaterialIcons name={reward.icon as any} size={24} color={Colors.primary[500]} />
        </View>
        <View style={styles.rewardInfo}>
          <Text style={styles.rewardName}>{reward.name}</Text>
          <Text style={styles.rewardDescription}>{reward.description}</Text>
        </View>
        <View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor(reward.availability) }]}>
          <Text style={styles.availabilityText}>{reward.availability}</Text>
        </View>
      </View>

      <View style={styles.rewardFooter}>
        <View style={styles.costContainer}>
          <MaterialIcons name="monetization-on" size={16} color={Colors.accent.orange} />
          <Text style={styles.costText}>{reward.cost} coins</Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.redeemButton,
            (userCoins < reward.cost || reward.availability === 'Sold Out') && styles.disabledButton,
          ]}
          disabled={userCoins < reward.cost || reward.availability === 'Sold Out'}
        >
          <Text style={[
            styles.redeemButtonText,
            (userCoins < reward.cost || reward.availability === 'Sold Out') && styles.disabledButtonText,
          ]}>
            {reward.availability === 'Sold Out' ? 'Sold Out' : 'Redeem'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Badges & Rewards</Text>
        <View style={styles.coinsContainer}>
          <MaterialIcons name="monetization-on" size={20} color={Colors.accent.orange} />
          <Text style={styles.coinsText}>{userCoins.toLocaleString()}</Text>
        </View>
      </Animated.View>

      {/* Tab Selector */}
      <Animated.View 
        style={[
          styles.tabSection,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'badges' && styles.activeTabButton]}
            onPress={() => setActiveTab('badges')}
          >
            <MaterialIcons name="military-tech" size={20} color={activeTab === 'badges' ? 'white' : Colors.text.tertiary} />
            <Text style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}>
              Badges
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'rewards' && styles.activeTabButton]}
            onPress={() => setActiveTab('rewards')}
          >
            <MaterialIcons name="redeem" size={20} color={activeTab === 'rewards' ? 'white' : Colors.text.tertiary} />
            <Text style={[styles.tabText, activeTab === 'rewards' && styles.activeTabText]}>
              Rewards
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'badges' ? (
          <>
            {/* Earned Badges */}
            <Animated.View 
              style={[
                styles.section,
                {
                  opacity: animatedValues.fadeIn,
                  transform: [{ scale: animatedValues.badgeScale }],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Earned Badges ({earnedBadges.length})</Text>
              <View style={styles.badgesGrid}>
                {earnedBadges.map(renderBadgeCard)}
              </View>
            </Animated.View>

            {/* Progress Badges */}
            <Animated.View 
              style={[
                styles.section,
                {
                  opacity: animatedValues.fadeIn,
                  transform: [{ scale: animatedValues.badgeScale }],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>In Progress ({unlockedBadges.length})</Text>
              <View style={styles.badgesGrid}>
                {unlockedBadges.map(renderBadgeCard)}
              </View>
            </Animated.View>
          </>
        ) : (
          /* Rewards */
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: animatedValues.fadeIn,
                transform: [{ translateY: animatedValues.slideUp }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Available Rewards</Text>
            {sampleRewards.map(renderRewardCard)}
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Badge Detail Modal */}
      <Modal
        visible={selectedBadge !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBadge && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalBadgeIcon, { backgroundColor: selectedBadge.color }]}>
                    <MaterialIcons 
                      name={selectedBadge.icon as any} 
                      size={32} 
                      color="white" 
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.modalCloseButton}
                    onPress={() => setSelectedBadge(null)}
                  >
                    <MaterialIcons name="close" size={24} color={Colors.neutral[400]} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalBadgeName}>{selectedBadge.name}</Text>
                <Text style={styles.modalBadgeDescription}>{selectedBadge.description}</Text>

                <View style={styles.modalBadgeDetails}>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Category:</Text>
                    <Text style={styles.modalDetailValue}>{selectedBadge.category}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Rarity:</Text>
                    <Text style={[styles.modalDetailValue, { color: getRarityColor(selectedBadge.rarity) }]}>
                      {selectedBadge.rarity}
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Rewards:</Text>
                    <Text style={styles.modalDetailValue}>
                      {selectedBadge.xpReward} XP + {selectedBadge.coinReward} coins
                    </Text>
                  </View>
                </View>

                {selectedBadge.isEarned ? (
                  <View style={styles.modalEarnedStatus}>
                    <MaterialIcons name="check-circle" size={20} color={Colors.success} />
                    <Text style={styles.modalEarnedText}>
                      Earned on {selectedBadge.earnedAt?.toLocaleDateString()}
                    </Text>
                  </View>
                ) : (
                  selectedBadge.progress !== undefined && selectedBadge.maxProgress && (
                    <View style={styles.modalProgressSection}>
                      <Text style={styles.modalProgressLabel}>Progress</Text>
                      <View style={styles.modalProgressBar}>
                        <View 
                          style={[
                            styles.modalProgressFill, 
                            { 
                              width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%`,
                              backgroundColor: selectedBadge.color,
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.modalProgressText}>
                        {selectedBadge.progress} / {selectedBadge.maxProgress}
                      </Text>
                    </View>
                  )
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
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
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
  },
  coinsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent.orange,
  },
  tabSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  activeTabButton: {
    backgroundColor: Colors.primary[500],
  },
  tabText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  badgeCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  unlockedBadgeCard: {
    opacity: 0.7,
  },
  badgeGradient: {
    padding: Spacing.md,
    minHeight: 140,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  unlockedBadgeName: {
    color: Colors.neutral[400],
  },
  badgeDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  unlockedBadgeDescription: {
    color: Colors.neutral[500],
  },
  progressSection: {
    marginTop: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: Colors.text.tertiary,
    textAlign: 'right',
  },
  badgeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.accent.orange,
  },
  earnedDate: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  rewardCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    flex: 1,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: Spacing.sm,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  redeemButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  disabledButton: {
    backgroundColor: Colors.neutral[600],
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  disabledButtonText: {
    color: Colors.neutral[400],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    margin: Spacing.lg,
    maxWidth: width - Spacing.lg * 2,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  modalBadgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBadgeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  modalBadgeDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  modalBadgeDetails: {
    marginBottom: Spacing.lg,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.inverse,
  },
  modalEarnedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.success}20`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  modalEarnedText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  modalProgressSection: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  modalProgressLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
  },
  modalProgressBar: {
    height: 8,
    backgroundColor: Colors.neutral[700],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  modalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalProgressText: {
    fontSize: 14,
    color: Colors.text.inverse,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BadgesRewardsScreen;
