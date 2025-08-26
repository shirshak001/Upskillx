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
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'hackathon' | 'quiz' | 'project' | 'skill';
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'AI' | 'Blockchain' | 'Product' | 'General';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  currentParticipants: number;
  teamSize: number;
  reward: {
    type: 'xp' | 'badge' | 'prize';
    value: string;
  };
  createdBy: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    department: string;
    teamName?: string;
  }>;
  leaderboard: Array<{
    rank: number;
    teamName: string;
    members: string[];
    score: number;
    progress: number;
  }>;
}

interface TeamChallengesProps {
  onBack?: () => void;
  onChallengeDetails?: (challengeId: string) => void;
}

const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: 'AI Innovation Hackathon',
    description: 'Build an innovative AI solution that can improve workplace productivity. Teams have 48 hours to develop and present their solution.',
    type: 'hackathon',
    difficulty: 'hard',
    category: 'AI',
    status: 'active',
    startDate: new Date('2025-08-24T09:00:00'),
    endDate: new Date('2025-08-26T18:00:00'),
    maxParticipants: 20,
    currentParticipants: 18,
    teamSize: 4,
    reward: { type: 'prize', value: '$5,000 + Premium Courses' },
    createdBy: 'HR Team',
    participants: [
      { id: '1', name: 'David Kim', avatar: '👨‍🚀', department: 'Engineering' },
      { id: '2', name: 'Sarah Chen', avatar: '👩‍💻', department: 'Engineering' },
      { id: '3', name: 'Marcus Rodriguez', avatar: '👨‍💼', department: 'Product' },
      { id: '4', name: 'Emily Park', avatar: '👩‍🎨', department: 'Design' },
    ],
    leaderboard: [
      { rank: 1, teamName: 'Neural Ninjas', members: ['David Kim', 'Sarah Chen'], score: 95, progress: 85 },
      { rank: 2, teamName: 'AI Pioneers', members: ['Marcus Rodriguez', 'Emily Park'], score: 88, progress: 75 },
    ],
  },
  {
    id: '2',
    title: 'Blockchain Knowledge Quiz',
    description: 'Test your blockchain knowledge in this comprehensive quiz covering fundamentals, smart contracts, and DeFi.',
    type: 'quiz',
    difficulty: 'medium',
    category: 'Blockchain',
    status: 'active',
    startDate: new Date('2025-08-25T10:00:00'),
    endDate: new Date('2025-08-30T23:59:00'),
    maxParticipants: 50,
    currentParticipants: 32,
    teamSize: 1,
    reward: { type: 'badge', value: 'Blockchain Expert Badge' },
    createdBy: 'Tech Lead',
    participants: [
      { id: '5', name: 'Alex Johnson', avatar: '👨‍🔬', department: 'Research' },
      { id: '6', name: 'Lisa Wang', avatar: '👩‍💼', department: 'Product' },
    ],
    leaderboard: [
      { rank: 1, teamName: 'Alex Johnson', members: ['Alex Johnson'], score: 92, progress: 100 },
      { rank: 2, teamName: 'Lisa Wang', members: ['Lisa Wang'], score: 89, progress: 100 },
    ],
  },
  {
    id: '3',
    title: 'Product Strategy Workshop',
    description: 'Collaborative workshop to develop product strategies for emerging markets. Teams will present their go-to-market plans.',
    type: 'project',
    difficulty: 'medium',
    category: 'Product',
    status: 'draft',
    startDate: new Date('2025-09-01T09:00:00'),
    endDate: new Date('2025-09-15T17:00:00'),
    maxParticipants: 24,
    currentParticipants: 0,
    teamSize: 3,
    reward: { type: 'xp', value: '1000 XP + Certificate' },
    createdBy: 'Product Team',
    participants: [],
    leaderboard: [],
  },
  {
    id: '4',
    title: 'Cross-Skill Challenge',
    description: 'Complete modules across all three skill areas (AI, Blockchain, Product) within the time limit.',
    type: 'skill',
    difficulty: 'easy',
    category: 'General',
    status: 'completed',
    startDate: new Date('2025-08-15T00:00:00'),
    endDate: new Date('2025-08-22T23:59:00'),
    maxParticipants: 100,
    currentParticipants: 67,
    teamSize: 1,
    reward: { type: 'badge', value: 'Renaissance Learner Badge' },
    createdBy: 'Learning Team',
    participants: [
      { id: '7', name: 'Michael Brown', avatar: '👨‍💻', department: 'Engineering' },
      { id: '8', name: 'Jennifer Lee', avatar: '👩‍🚀', department: 'Research' },
    ],
    leaderboard: [
      { rank: 1, teamName: 'Michael Brown', members: ['Michael Brown'], score: 98, progress: 100 },
      { rank: 2, teamName: 'Jennifer Lee', members: ['Jennifer Lee'], score: 95, progress: 100 },
    ],
  },
];

const TeamChallenges: React.FC<TeamChallengesProps> = ({
  onBack,
  onChallengeDetails,
}) => {
  const [challenges, setChallenges] = useState(sampleChallenges);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'draft' | 'completed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    type: 'hackathon' as Challenge['type'],
    difficulty: 'medium' as Challenge['difficulty'],
    category: 'AI' as Challenge['category'],
    maxParticipants: 20,
    teamSize: 4,
    duration: 7, // days
    rewardType: 'xp' as Challenge['reward']['type'],
    rewardValue: '',
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

  const getStatusColor = (status: Challenge['status']) => {
    switch (status) {
      case 'active':
        return Colors.success;
      case 'draft':
        return Colors.warning;
      case 'completed':
        return Colors.neutral[400];
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.neutral[400];
    }
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return Colors.success;
      case 'medium':
        return Colors.warning;
      case 'hard':
        return Colors.error;
      default:
        return Colors.neutral[400];
    }
  };

  const getCategoryColor = (category: Challenge['category']) => {
    switch (category) {
      case 'AI':
        return Colors.primary[500];
      case 'Blockchain':
        return Colors.secondary[500];
      case 'Product':
        return Colors.accent.orange;
      case 'General':
        return Colors.accent.purple;
      default:
        return Colors.neutral[400];
    }
  };

  const getTypeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'hackathon':
        return 'code';
      case 'quiz':
        return 'quiz';
      case 'project':
        return 'assignment';
      case 'skill':
        return 'school';
      default:
        return 'event';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (selectedFilter === 'all') return true;
    return challenge.status === selectedFilter;
  });

  const handleCreateChallenge = () => {
    if (!newChallenge.title.trim() || !newChallenge.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const challenge: Challenge = {
      id: (challenges.length + 1).toString(),
      title: newChallenge.title,
      description: newChallenge.description,
      type: newChallenge.type,
      difficulty: newChallenge.difficulty,
      category: newChallenge.category,
      status: 'draft',
      startDate: new Date(),
      endDate: new Date(Date.now() + newChallenge.duration * 24 * 60 * 60 * 1000),
      maxParticipants: newChallenge.maxParticipants,
      currentParticipants: 0,
      teamSize: newChallenge.teamSize,
      reward: {
        type: newChallenge.rewardType,
        value: newChallenge.rewardValue,
      },
      createdBy: 'Admin',
      participants: [],
      leaderboard: [],
    };

    setChallenges([challenge, ...challenges]);
    setShowCreateModal(false);
    setNewChallenge({
      title: '',
      description: '',
      type: 'hackathon',
      difficulty: 'medium',
      category: 'AI',
      maxParticipants: 20,
      teamSize: 4,
      duration: 7,
      rewardType: 'xp',
      rewardValue: '',
    });

    Alert.alert('Success', 'Challenge created successfully!');
  };

  const renderChallengeCard = (challenge: Challenge) => (
    <TouchableOpacity
      key={challenge.id}
      style={styles.challengeCard}
      onPress={() => onChallengeDetails?.(challenge.id)}
    >
      {/* Challenge Header */}
      <View style={styles.challengeHeader}>
        <View style={styles.challengeHeaderLeft}>
          <View style={[styles.typeIcon, { backgroundColor: getCategoryColor(challenge.category) }]}>
            <MaterialIcons name={getTypeIcon(challenge.type) as any} size={20} color="white" />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeCreator}>by {challenge.createdBy}</Text>
          </View>
        </View>
        
        <View style={styles.challengeHeaderRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(challenge.status) }]}>
            <Text style={styles.statusText}>{challenge.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Challenge Description */}
      <Text style={styles.challengeDescription} numberOfLines={2}>
        {challenge.description}
      </Text>

      {/* Challenge Meta */}
      <View style={styles.challengeMeta}>
        <View style={styles.metaItem}>
          <MaterialIcons name="category" size={16} color={getCategoryColor(challenge.category)} />
          <Text style={styles.metaText}>{challenge.category}</Text>
        </View>
        
        <View style={styles.metaItem}>
          <MaterialIcons name="signal-cellular-alt" size={16} color={getDifficultyColor(challenge.difficulty)} />
          <Text style={styles.metaText}>{challenge.difficulty}</Text>
        </View>
        
        <View style={styles.metaItem}>
          <MaterialIcons name="people" size={16} color={Colors.text.tertiary} />
          <Text style={styles.metaText}>
            {challenge.currentParticipants}/{challenge.maxParticipants}
          </Text>
        </View>
        
        <View style={styles.metaItem}>
          <MaterialIcons name="groups" size={16} color={Colors.text.tertiary} />
          <Text style={styles.metaText}>Team of {challenge.teamSize}</Text>
        </View>
      </View>

      {/* Challenge Timeline */}
      <View style={styles.challengeTimeline}>
        <View style={styles.timelineItem}>
          <MaterialIcons name="play-arrow" size={16} color={Colors.success} />
          <Text style={styles.timelineText}>Start: {formatDate(challenge.startDate)}</Text>
        </View>
        
        <View style={styles.timelineItem}>
          <MaterialIcons name="flag" size={16} color={Colors.error} />
          <Text style={styles.timelineText}>End: {formatDate(challenge.endDate)}</Text>
        </View>
      </View>

      {/* Reward */}
      <View style={styles.rewardSection}>
        <MaterialIcons name="emoji-events" size={16} color={Colors.accent.orange} />
        <Text style={styles.rewardText}>{challenge.reward.value}</Text>
      </View>

      {/* Progress Bar for Active Challenges */}
      {challenge.status === 'active' && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Participation Progress</Text>
            <Text style={styles.progressPercentage}>
              {Math.round((challenge.currentParticipants / challenge.maxParticipants) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(challenge.currentParticipants / challenge.maxParticipants) * 100}%`,
                  backgroundColor: Colors.primary[500],
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Leaderboard Preview */}
      {challenge.leaderboard.length > 0 && (
        <View style={styles.leaderboardPreview}>
          <Text style={styles.leaderboardTitle}>🏆 Leading Teams</Text>
          {challenge.leaderboard.slice(0, 2).map((team) => (
            <View key={team.rank} style={styles.teamRankItem}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{team.rank}</Text>
              </View>
              <Text style={styles.teamName}>{team.teamName}</Text>
              <Text style={styles.teamScore}>{team.score}pts</Text>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.challengeActions}>
        {challenge.status === 'draft' && (
          <>
            <TouchableOpacity style={[styles.actionButton, styles.publishButton]}>
              <MaterialIcons name="publish" size={16} color="white" />
              <Text style={styles.actionButtonText}>Publish</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
              <MaterialIcons name="edit" size={16} color={Colors.warning} />
              <Text style={[styles.actionButtonText, { color: Colors.warning }]}>Edit</Text>
            </TouchableOpacity>
          </>
        )}
        
        {challenge.status === 'active' && (
          <TouchableOpacity style={[styles.actionButton, styles.viewButton]}>
            <MaterialIcons name="visibility" size={16} color={Colors.primary[500]} />
            <Text style={[styles.actionButtonText, { color: Colors.primary[500] }]}>View Details</Text>
          </TouchableOpacity>
        )}
        
        {challenge.status === 'completed' && (
          <TouchableOpacity style={[styles.actionButton, styles.resultsButton]}>
            <MaterialIcons name="analytics" size={16} color={Colors.secondary[500]} />
            <Text style={[styles.actionButtonText, { color: Colors.secondary[500] }]}>View Results</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Team Challenges</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
          <MaterialIcons name="add" size={20} color="white" />
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View 
        style={[
          styles.filterContainer,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <View style={styles.filterTabs}>
          {(['all', 'active', 'draft', 'completed'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.activeFilterTab,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter && styles.activeFilterTabText,
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Challenges List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.challengesContainer,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map(renderChallengeCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="emoji-events" size={64} color={Colors.neutral[400]} />
              <Text style={styles.emptyTitle}>No Challenges Found</Text>
              <Text style={styles.emptySubtitle}>
                {selectedFilter === 'all' 
                  ? 'Create your first team challenge to get started!' 
                  : `No ${selectedFilter} challenges at the moment.`}
              </Text>
              <TouchableOpacity style={styles.emptyAction} onPress={() => setShowCreateModal(true)}>
                <MaterialIcons name="add" size={20} color="white" />
                <Text style={styles.emptyActionText}>Create Challenge</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Create Challenge Modal */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Challenge</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.neutral[400]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Challenge Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Challenge Title *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newChallenge.title}
                  onChangeText={(text) => setNewChallenge({...newChallenge, title: text})}
                  placeholder="Enter challenge title"
                  placeholderTextColor={Colors.neutral[400]}
                />
              </View>

              {/* Challenge Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newChallenge.description}
                  onChangeText={(text) => setNewChallenge({...newChallenge, description: text})}
                  placeholder="Describe the challenge objectives and rules"
                  placeholderTextColor={Colors.neutral[400]}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Challenge Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Challenge Type</Text>
                <View style={styles.segmentedControl}>
                  {(['hackathon', 'quiz', 'project', 'skill'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.segmentButton,
                        newChallenge.type === type && styles.activeSegmentButton,
                      ]}
                      onPress={() => setNewChallenge({...newChallenge, type})}
                    >
                      <Text style={[
                        styles.segmentButtonText,
                        newChallenge.type === type && styles.activeSegmentButtonText,
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.segmentedControl}>
                  {(['AI', 'Blockchain', 'Product', 'General'] as const).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.segmentButton,
                        newChallenge.category === category && styles.activeSegmentButton,
                      ]}
                      onPress={() => setNewChallenge({...newChallenge, category})}
                    >
                      <Text style={[
                        styles.segmentButtonText,
                        newChallenge.category === category && styles.activeSegmentButtonText,
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Difficulty */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Difficulty</Text>
                <View style={styles.segmentedControl}>
                  {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                    <TouchableOpacity
                      key={difficulty}
                      style={[
                        styles.segmentButton,
                        newChallenge.difficulty === difficulty && styles.activeSegmentButton,
                      ]}
                      onPress={() => setNewChallenge({...newChallenge, difficulty})}
                    >
                      <Text style={[
                        styles.segmentButtonText,
                        newChallenge.difficulty === difficulty && styles.activeSegmentButtonText,
                      ]}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Participants and Team Size */}
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.md }]}>
                  <Text style={styles.inputLabel}>Max Participants</Text>
                  <TextInput
                    style={styles.numberInput}
                    value={newChallenge.maxParticipants.toString()}
                    onChangeText={(text) => setNewChallenge({...newChallenge, maxParticipants: parseInt(text) || 20})}
                    keyboardType="numeric"
                    placeholder="20"
                    placeholderTextColor={Colors.neutral[400]}
                  />
                </View>
                
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Team Size</Text>
                  <TextInput
                    style={styles.numberInput}
                    value={newChallenge.teamSize.toString()}
                    onChangeText={(text) => setNewChallenge({...newChallenge, teamSize: parseInt(text) || 1})}
                    keyboardType="numeric"
                    placeholder="4"
                    placeholderTextColor={Colors.neutral[400]}
                  />
                </View>
              </View>

              {/* Duration */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration (days)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={newChallenge.duration.toString()}
                  onChangeText={(text) => setNewChallenge({...newChallenge, duration: parseInt(text) || 7})}
                  keyboardType="numeric"
                  placeholder="7"
                  placeholderTextColor={Colors.neutral[400]}
                />
              </View>

              {/* Reward */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reward Type</Text>
                <View style={styles.segmentedControl}>
                  {(['xp', 'badge', 'prize'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.segmentButton,
                        newChallenge.rewardType === type && styles.activeSegmentButton,
                      ]}
                      onPress={() => setNewChallenge({...newChallenge, rewardType: type})}
                    >
                      <Text style={[
                        styles.segmentButtonText,
                        newChallenge.rewardType === type && styles.activeSegmentButtonText,
                      ]}>
                        {type.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reward Value</Text>
                <TextInput
                  style={styles.textInput}
                  value={newChallenge.rewardValue}
                  onChangeText={(text) => setNewChallenge({...newChallenge, rewardValue: text})}
                  placeholder="e.g., 1000 XP, Expert Badge, $500 Prize"
                  placeholderTextColor={Colors.neutral[400]}
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.createModalButton]} 
                onPress={handleCreateChallenge}
              >
                <Text style={styles.createModalButtonText}>Create Challenge</Text>
              </TouchableOpacity>
            </View>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  createText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: 4,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: Colors.primary[500],
  },
  filterTabText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  challengesContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  challengeCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.sm,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  challengeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  challengeCreator: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  challengeHeaderRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  challengeDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  challengeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  challengeTimeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timelineText: {
    fontSize: 11,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  rewardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  rewardText: {
    fontSize: 14,
    color: Colors.accent.orange,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 12,
    color: Colors.text.inverse,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  leaderboardPreview: {
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  leaderboardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  teamRankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  teamName: {
    flex: 1,
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  teamScore: {
    fontSize: 12,
    color: Colors.text.inverse,
    fontWeight: 'bold',
  },
  challengeActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: 4,
    borderWidth: 1,
  },
  publishButton: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  editButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.warning,
  },
  viewButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.primary[500],
  },
  resultsButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.secondary[500],
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
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
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  emptyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    flex: 1,
  },
  modalBody: {
    paddingHorizontal: Spacing.xl,
    flex: 1,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 14,
    color: Colors.text.inverse,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  numberInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 14,
    color: Colors.text.inverse,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.md,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  activeSegmentButton: {
    backgroundColor: Colors.primary[500],
  },
  segmentButtonText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activeSegmentButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.neutral[400],
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[400],
  },
  createModalButton: {
    backgroundColor: Colors.primary[500],
  },
  createModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

export default TeamChallenges;
