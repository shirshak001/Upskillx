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
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: Date;
  level: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  completedCourses: number;
  totalCourses: number;
  hoursLearned: number;
  linkedInConnected: boolean;
  department: string;
  role: string;
  location: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  category: 'skill' | 'achievement' | 'milestone';
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  dateEarned: Date;
  credentialId: string;
  skills: string[];
  verificationUrl: string;
}

interface SkillProgress {
  skill: string;
  level: number;
  xp: number;
  maxXP: number;
  percentComplete: number;
  category: 'AI' | 'Blockchain' | 'Product';
  endorsements: number;
}

interface ProfileScreenProps {
  onBack?: () => void;
  onEditProfile?: () => void;
  onSettings?: () => void;
}

const sampleProfile: UserProfile = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah.chen@company.com',
  avatar: '👩‍💻',
  bio: 'Passionate software engineer exploring AI and machine learning. Love building innovative solutions that make a difference.',
  joinDate: new Date('2024-03-15'),
  level: 8,
  totalXP: 3250,
  currentStreak: 12,
  longestStreak: 28,
  completedCourses: 15,
  totalCourses: 45,
  hoursLearned: 127,
  linkedInConnected: true,
  department: 'Engineering',
  role: 'Senior Software Engineer',
  location: 'Bangalore, India',
};

const sampleBadges: Badge[] = [
  {
    id: '1',
    name: 'AI Pioneer',
    description: 'Completed 10 AI courses with excellence',
    icon: 'psychology',
    color: Colors.primary[500],
    earnedAt: new Date('2025-08-20'),
    category: 'skill',
  },
  {
    id: '2',
    name: 'Blockchain Expert',
    description: 'Master of blockchain fundamentals',
    icon: 'link',
    color: Colors.secondary[500],
    earnedAt: new Date('2025-08-15'),
    category: 'skill',
  },
  {
    id: '3',
    name: 'Week Warrior',
    description: 'Maintained 7+ day learning streak',
    icon: 'local-fire-department',
    color: Colors.accent.orange,
    earnedAt: new Date('2025-08-10'),
    category: 'achievement',
  },
  {
    id: '4',
    name: 'Product Guru',
    description: 'Completed product management track',
    icon: 'lightbulb',
    color: Colors.accent.emerald,
    earnedAt: new Date('2025-08-05'),
    category: 'skill',
  },
  {
    id: '5',
    name: 'Mentor',
    description: 'Helped 5+ peers in community',
    icon: 'supervisor-account',
    color: Colors.accent.purple,
    earnedAt: new Date('2025-07-30'),
    category: 'achievement',
  },
  {
    id: '6',
    name: 'Rising Star',
    description: 'Reached Level 5 milestone',
    icon: 'star',
    color: Colors.warning,
    earnedAt: new Date('2025-07-25'),
    category: 'milestone',
  },
];

const sampleCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals',
    issuer: 'UpskillX Academy',
    dateEarned: new Date('2025-08-20'),
    credentialId: 'UX-ML-2025-001',
    skills: ['Machine Learning', 'Python', 'Data Analysis'],
    verificationUrl: 'https://verify.upskillx.com/cert/001',
  },
  {
    id: '2',
    title: 'Blockchain Development',
    issuer: 'UpskillX Academy',
    dateEarned: new Date('2025-08-15'),
    credentialId: 'UX-BC-2025-002',
    skills: ['Blockchain', 'Smart Contracts', 'Solidity'],
    verificationUrl: 'https://verify.upskillx.com/cert/002',
  },
  {
    id: '3',
    title: 'Product Strategy & Design',
    issuer: 'UpskillX Academy',
    dateEarned: new Date('2025-08-10'),
    credentialId: 'UX-PD-2025-003',
    skills: ['Product Management', 'UX Design', 'Strategy'],
    verificationUrl: 'https://verify.upskillx.com/cert/003',
  },
];

const sampleSkills: SkillProgress[] = [
  {
    skill: 'Machine Learning',
    level: 8,
    xp: 3200,
    maxXP: 4000,
    percentComplete: 80,
    category: 'AI',
    endorsements: 12,
  },
  {
    skill: 'Blockchain Development',
    level: 6,
    xp: 2400,
    maxXP: 3000,
    percentComplete: 80,
    category: 'Blockchain',
    endorsements: 8,
  },
  {
    skill: 'Product Strategy',
    level: 7,
    xp: 2800,
    maxXP: 3500,
    percentComplete: 80,
    category: 'Product',
    endorsements: 15,
  },
  {
    skill: 'Data Science',
    level: 5,
    xp: 1800,
    maxXP: 2500,
    percentComplete: 72,
    category: 'AI',
    endorsements: 6,
  },
  {
    skill: 'Smart Contracts',
    level: 4,
    xp: 1200,
    maxXP: 2000,
    percentComplete: 60,
    category: 'Blockchain',
    endorsements: 4,
  },
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onEditProfile,
  onSettings,
}) => {
  const [profile] = useState(sampleProfile);
  const [badges] = useState(sampleBadges);
  const [certificates] = useState(sampleCertificates);
  const [skills] = useState(sampleSkills);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'badges' | 'certificates' | 'skills'>('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedBio, setEditedBio] = useState(profile.bio);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSkillCategoryColor = (category: SkillProgress['category']) => {
    switch (category) {
      case 'AI':
        return Colors.primary[500];
      case 'Blockchain':
        return Colors.secondary[500];
      case 'Product':
        return Colors.accent.orange;
      default:
        return Colors.neutral[400];
    }
  };

  const getBadgeCategoryIcon = (category: Badge['category']) => {
    switch (category) {
      case 'skill':
        return 'school';
      case 'achievement':
        return 'emoji-events';
      case 'milestone':
        return 'flag';
      default:
        return 'star';
    }
  };

  const handleSaveBio = () => {
    // Here you would typically save to backend
    setShowEditModal(false);
    Alert.alert('Success', 'Bio updated successfully!');
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons name="school" size={24} color={Colors.primary[500]} />
          <Text style={styles.statValue}>{profile.completedCourses}</Text>
          <Text style={styles.statLabel}>Courses Completed</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name="schedule" size={24} color={Colors.secondary[500]} />
          <Text style={styles.statValue}>{profile.hoursLearned}h</Text>
          <Text style={styles.statLabel}>Hours Learned</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name="local-fire-department" size={24} color={Colors.accent.orange} />
          <Text style={styles.statValue}>{profile.currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name="workspace-premium" size={24} color={Colors.warning} />
          <Text style={styles.statValue}>{badges.length}</Text>
          <Text style={styles.statLabel}>Badges Earned</Text>
        </View>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Recent Achievements</Text>
        <View style={styles.achievementsList}>
          {badges.slice(0, 3).map((badge) => (
            <View key={badge.id} style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: badge.color }]}>
                <MaterialIcons name={badge.icon as any} size={20} color="white" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>{badge.name}</Text>
                <Text style={styles.achievementDate}>Earned {formatDate(badge.earnedAt)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Learning Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Learning Progress</Text>
        <View style={styles.progressOverview}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.round((profile.completedCourses / profile.totalCourses) * 100)}%`,
                      backgroundColor: Colors.primary[500],
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressPercentage}>
                {Math.round((profile.completedCourses / profile.totalCourses) * 100)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>XP Progress to Next Level</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${(profile.totalXP % 1000) / 10}%`,
                      backgroundColor: Colors.secondary[500],
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressPercentage}>
                {profile.totalXP % 1000}/1000 XP
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderBadgesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.badgesGrid}>
        {badges.map((badge) => (
          <View key={badge.id} style={styles.badgeCard}>
            <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
              <MaterialIcons name={badge.icon as any} size={32} color="white" />
            </View>
            <Text style={styles.badgeName}>{badge.name}</Text>
            <Text style={styles.badgeDescription}>{badge.description}</Text>
            <View style={styles.badgeFooter}>
              <MaterialIcons 
                name={getBadgeCategoryIcon(badge.category)} 
                size={14} 
                color={Colors.text.tertiary} 
              />
              <Text style={styles.badgeCategory}>{badge.category}</Text>
              <Text style={styles.badgeDate}>{formatDate(badge.earnedAt)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCertificatesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.certificatesList}>
        {certificates.map((cert) => (
          <View key={cert.id} style={styles.certificateCard}>
            <View style={styles.certificateHeader}>
              <View style={styles.certificateIcon}>
                <MaterialIcons name="verified" size={24} color={Colors.success} />
              </View>
              <View style={styles.certificateInfo}>
                <Text style={styles.certificateTitle}>{cert.title}</Text>
                <Text style={styles.certificateIssuer}>Issued by {cert.issuer}</Text>
                <Text style={styles.certificateDate}>Earned {formatDate(cert.dateEarned)}</Text>
              </View>
            </View>
            
            <View style={styles.certificateDetails}>
              <Text style={styles.credentialId}>ID: {cert.credentialId}</Text>
              <View style={styles.skillTags}>
                {cert.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <TouchableOpacity style={styles.verifyButton}>
              <MaterialIcons name="open-in-new" size={16} color={Colors.primary[500]} />
              <Text style={styles.verifyButtonText}>Verify Certificate</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSkillsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.skillsList}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.skillCard}>
            <View style={styles.skillHeader}>
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{skill.skill}</Text>
                <Text style={styles.skillLevel}>Level {skill.level}</Text>
              </View>
              <View style={styles.skillMeta}>
                <View style={styles.endorsements}>
                  <MaterialIcons name="thumb-up" size={16} color={Colors.text.tertiary} />
                  <Text style={styles.endorsementCount}>{skill.endorsements}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.skillProgress}>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${skill.percentComplete}%`,
                        backgroundColor: getSkillCategoryColor(skill.category),
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercentage}>
                  {skill.xp}/{skill.maxXP} XP
                </Text>
              </View>
            </View>
            
            <View style={styles.skillFooter}>
              <View style={[styles.categoryBadge, { backgroundColor: getSkillCategoryColor(skill.category) }]}>
                <Text style={styles.categoryBadgeText}>{skill.category}</Text>
              </View>
              <Text style={styles.skillPercentage}>{skill.percentComplete}% Complete</Text>
            </View>
          </View>
        ))}
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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={onSettings}>
          <MaterialIcons name="settings" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </Animated.View>

      {/* Profile Header */}
      <Animated.View 
        style={[
          styles.profileHeader,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{profile.avatar}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>L{profile.level}</Text>
            </View>
          </View>
          
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileRole}>{profile.role}</Text>
            <Text style={styles.profileDepartment}>{profile.department} • {profile.location}</Text>
            <View style={styles.xpContainer}>
              <MaterialIcons name="stars" size={16} color={Colors.warning} />
              <Text style={styles.xpText}>{profile.totalXP} XP</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.profileActions}>
          <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
            <MaterialIcons name="edit" size={16} color={Colors.primary[500]} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          {profile.linkedInConnected ? (
            <TouchableOpacity style={styles.linkedInButton}>
              <MaterialIcons name="link" size={16} color={Colors.primary[500]} />
              <Text style={styles.linkedInButtonText}>LinkedIn</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.connectLinkedInButton}>
              <MaterialIcons name="add-link" size={16} color="white" />
              <Text style={styles.connectLinkedInButtonText}>Connect</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Bio Section */}
      <Animated.View 
        style={[
          styles.bioSection,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <Text style={styles.bioText}>{profile.bio}</Text>
        <Text style={styles.joinDate}>Member since {formatDate(profile.joinDate)}</Text>
      </Animated.View>

      {/* Tab Navigation */}
      <Animated.View 
        style={[
          styles.tabNavigation,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        {(['overview', 'badges', 'certificates', 'skills'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.activeTabText,
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {selectedTab === 'overview' && renderOverviewTab()}
          {selectedTab === 'badges' && renderBadgesTab()}
          {selectedTab === 'certificates' && renderCertificatesTab()}
          {selectedTab === 'skills' && renderSkillsTab()}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Bio Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Bio</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.neutral[400]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={styles.textArea}
                value={editedBio}
                onChangeText={setEditedBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor={Colors.neutral[400]}
                multiline
                numberOfLines={6}
                maxLength={500}
              />
              <Text style={styles.characterCount}>{editedBio.length}/500</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveBio}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.tertiary,
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 80,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.accent.purple,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: Colors.background.dark,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  profileDepartment: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  profileActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary[500],
    gap: 4,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  linkedInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary[500],
    gap: 4,
  },
  linkedInButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  connectLinkedInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  connectLinkedInButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  bioSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  bioText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  joinDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.background.tertiary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary[500],
  },
  tabText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  tabContent: {
    gap: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: (width - Spacing.lg * 3) / 2,
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  achievementsList: {
    gap: Spacing.md,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  achievementDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  progressOverview: {
    gap: Spacing.md,
  },
  progressItem: {
    backgroundColor: Colors.background.tertiary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
    minWidth: 60,
    textAlign: 'right',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  badgeCard: {
    width: (width - Spacing.lg * 3) / 2,
    padding: Spacing.lg,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  badgeDescription: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  badgeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeCategory: {
    fontSize: 10,
    color: Colors.text.tertiary,
    textTransform: 'capitalize',
  },
  badgeDate: {
    fontSize: 10,
    color: Colors.text.tertiary,
    marginLeft: Spacing.xs,
  },
  certificatesList: {
    gap: Spacing.lg,
  },
  certificateCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  certificateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  certificateIssuer: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  certificateDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  certificateDetails: {
    marginBottom: Spacing.md,
  },
  credentialId: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  skillTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.sm,
  },
  skillTagText: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  verifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  skillsList: {
    gap: Spacing.lg,
  },
  skillCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  skillLevel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  skillMeta: {
    alignItems: 'flex-end',
  },
  endorsements: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  endorsementCount: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  skillProgress: {
    marginBottom: Spacing.md,
  },
  skillFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  skillPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
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
    maxHeight: '80%',
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 14,
    color: Colors.text.inverse,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: Spacing.xs,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'right',
    marginBottom: Spacing.lg,
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
  saveButton: {
    backgroundColor: Colors.primary[500],
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

export default ProfileScreen;
