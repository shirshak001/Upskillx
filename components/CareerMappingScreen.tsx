import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: 'ai' | 'blockchain' | 'product' | 'general';
  isRequired: boolean;
  timeToAcquire?: string;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  industry: string;
  salaryRange: string;
  timeToAchieve: string;
  demandLevel: 'low' | 'medium' | 'high' | 'very-high';
  matchPercentage: number;
  requiredSkills: Skill[];
  currentProgress: number;
  growthProjection: string;
  companies: string[];
  nextSteps: string[];
}

interface CareerMappingScreenProps {
  onBack?: () => void;
  onStartLearningPath?: (pathId: string) => void;
  onSkillDetails?: (skillId: string) => void;
  onCareerDetails?: (careerId: string) => void;
}

const sampleUserSkills: Skill[] = [
  { id: '1', name: 'JavaScript', level: 85, category: 'general', isRequired: true },
  { id: '2', name: 'React Native', level: 70, category: 'general', isRequired: true },
  { id: '3', name: 'Machine Learning', level: 40, category: 'ai', isRequired: false, timeToAcquire: '3 months' },
  { id: '4', name: 'Blockchain Development', level: 25, category: 'blockchain', isRequired: false, timeToAcquire: '4 months' },
  { id: '5', name: 'Product Strategy', level: 60, category: 'product', isRequired: true },
  { id: '6', name: 'Data Analysis', level: 55, category: 'ai', isRequired: false, timeToAcquire: '2 months' },
];

const sampleCareerPaths: CareerPath[] = [
  {
    id: '1',
    title: 'AI Product Manager',
    description: 'Lead AI-driven product development and strategy in tech companies',
    industry: 'Technology',
    salaryRange: '₹25-45 LPA',
    timeToAchieve: '6 months',
    demandLevel: 'very-high',
    matchPercentage: 87,
    requiredSkills: [
      { id: '1', name: 'Machine Learning', level: 70, category: 'ai', isRequired: true, timeToAcquire: '3 months' },
      { id: '2', name: 'Product Strategy', level: 80, category: 'product', isRequired: true, timeToAcquire: '2 months' },
      { id: '3', name: 'Data Analysis', level: 75, category: 'ai', isRequired: true, timeToAcquire: '2 months' },
      { id: '4', name: 'Python', level: 60, category: 'ai', isRequired: false, timeToAcquire: '2 months' },
    ],
    currentProgress: 65,
    growthProjection: '+180% job growth by 2026',
    companies: ['Google', 'Microsoft', 'Swiggy', 'Flipkart', 'BYJU\'S'],
    nextSteps: ['Complete AI Fundamentals', 'Build ML Portfolio', 'Product Management Certification'],
  },
  {
    id: '2',
    title: 'Blockchain Architect',
    description: 'Design and implement blockchain solutions for enterprise applications',
    industry: 'FinTech',
    salaryRange: '₹30-60 LPA',
    timeToAchieve: '8 months',
    demandLevel: 'high',
    matchPercentage: 72,
    requiredSkills: [
      { id: '1', name: 'Solidity', level: 80, category: 'blockchain', isRequired: true, timeToAcquire: '4 months' },
      { id: '2', name: 'Smart Contracts', level: 85, category: 'blockchain', isRequired: true, timeToAcquire: '5 months' },
      { id: '3', name: 'Web3.js', level: 70, category: 'blockchain', isRequired: true, timeToAcquire: '3 months' },
      { id: '4', name: 'Cryptography', level: 65, category: 'blockchain', isRequired: false, timeToAcquire: '3 months' },
    ],
    currentProgress: 35,
    growthProjection: '+300% demand in Web3 space',
    companies: ['Polygon', 'CoinDCX', 'WazirX', 'Nium', 'Razorpay'],
    nextSteps: ['Master Solidity', 'Build DApp Portfolio', 'Blockchain Certification'],
  },
  {
    id: '3',
    title: 'Full Stack AI Developer',
    description: 'Build end-to-end AI applications with modern web technologies',
    industry: 'Software Development',
    salaryRange: '₹20-35 LPA',
    timeToAchieve: '4 months',
    demandLevel: 'very-high',
    matchPercentage: 91,
    requiredSkills: [
      { id: '1', name: 'React', level: 85, category: 'general', isRequired: true, timeToAcquire: '1 month' },
      { id: '2', name: 'Node.js', level: 75, category: 'general', isRequired: true, timeToAcquire: '2 months' },
      { id: '3', name: 'TensorFlow', level: 60, category: 'ai', isRequired: true, timeToAcquire: '3 months' },
      { id: '4', name: 'MongoDB', level: 70, category: 'general', isRequired: false, timeToAcquire: '1 month' },
    ],
    currentProgress: 78,
    growthProjection: '+150% growth in AI development roles',
    companies: ['Zomato', 'Ola', 'Paytm', 'PhonePe', 'Freshworks'],
    nextSteps: ['Advanced React Patterns', 'AI Model Integration', 'System Design'],
  },
];

const CareerMappingScreen: React.FC<CareerMappingScreenProps> = ({
  onBack,
  onStartLearningPath,
  onSkillDetails,
  onCareerDetails,
}) => {
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  const getDemandColor = (level: CareerPath['demandLevel']) => {
    switch (level) {
      case 'very-high': return Colors.success;
      case 'high': return Colors.accent.emerald;
      case 'medium': return Colors.warning;
      case 'low': return Colors.neutral[400];
    }
  };

  const getSkillCategoryColor = (category: Skill['category']) => {
    switch (category) {
      case 'ai': return Colors.primary[500];
      case 'blockchain': return Colors.secondary[500];
      case 'product': return Colors.accent.orange;
      case 'general': return Colors.accent.purple;
    }
  };

  const handlePathPress = (path: CareerPath) => {
    setSelectedPath(path);
    setModalVisible(true);
  };

  const renderProgressRing = (progress: number, size: number = 60) => {
    const radius = size / 2 - 4;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={[styles.progressRing, { width: size, height: size }]}>
        <View style={styles.progressRingInner}>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </View>
    );
  };

  const renderCareerPath = (path: CareerPath, index: number) => (
    <TouchableOpacity
      key={path.id}
      style={[
        styles.careerCard,
        { marginTop: index > 0 ? Spacing.lg : 0 }
      ]}
      onPress={() => handlePathPress(path)}
    >
      <LinearGradient
        colors={[
          path.matchPercentage >= 80 ? Colors.success : 
          path.matchPercentage >= 60 ? Colors.warning : Colors.neutral[400],
          'transparent'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.careerCardGradient}
      >
        <View style={styles.careerCardContent}>
          <View style={styles.careerHeader}>
            <View style={styles.careerTitleSection}>
              <Text style={styles.careerTitle}>{path.title}</Text>
              <Text style={styles.careerIndustry}>{path.industry}</Text>
            </View>
            
            <View style={styles.matchSection}>
              {renderProgressRing(path.matchPercentage, 50)}
              <Text style={styles.matchLabel}>Match</Text>
            </View>
          </View>

          <Text style={styles.careerDescription}>{path.description}</Text>

          <View style={styles.careerMetrics}>
            <View style={styles.metricItem}>
              <MaterialIcons name="schedule" size={16} color={Colors.accent.emerald} />
              <Text style={styles.metricText}>{path.timeToAchieve}</Text>
            </View>
            
            <View style={styles.metricItem}>
              <MaterialIcons name="trending-up" size={16} color={getDemandColor(path.demandLevel)} />
              <Text style={[styles.metricText, { color: getDemandColor(path.demandLevel) }]}>
                {path.demandLevel.replace('-', ' ').toUpperCase()} DEMAND
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <MaterialIcons name="account-balance-wallet" size={16} color={Colors.warning} />
              <Text style={styles.metricText}>{path.salaryRange}</Text>
            </View>
          </View>

          <View style={styles.skillsPreview}>
            <Text style={styles.skillsLabel}>Required Skills:</Text>
            <View style={styles.skillsRow}>
              {path.requiredSkills.slice(0, 3).map(skill => {
                const userSkill = sampleUserSkills.find(s => s.name === skill.name);
                const hasSkill = userSkill && userSkill.level >= skill.level;
                
                return (
                  <View
                    key={skill.id}
                    style={[
                      styles.skillChip,
                      { 
                        backgroundColor: hasSkill ? 
                          `${getSkillCategoryColor(skill.category)}20` : 
                          'rgba(255, 255, 255, 0.1)',
                        borderColor: hasSkill ? 
                          getSkillCategoryColor(skill.category) : 
                          Colors.neutral[400]
                      }
                    ]}
                  >
                    <Text style={[
                      styles.skillChipText,
                      { color: hasSkill ? getSkillCategoryColor(skill.category) : Colors.neutral[400] }
                    ]}>
                      {skill.name}
                    </Text>
                    {hasSkill && (
                      <MaterialIcons name="check-circle" size={12} color={getSkillCategoryColor(skill.category)} />
                    )}
                  </View>
                );
              })}
              {path.requiredSkills.length > 3 && (
                <Text style={styles.moreSkills}>+{path.requiredSkills.length - 3} more</Text>
              )}
            </View>
          </View>

          <View style={styles.careerActions}>
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handlePathPress(path)}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
              <MaterialIcons name="arrow-forward" size={16} color={Colors.primary[500]} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.startLearningButton}
              onPress={() => onStartLearningPath?.(path.id)}
            >
              <Text style={styles.startLearningText}>Start Learning Path</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
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
        <Text style={styles.headerTitle}>Career Mapping</Text>
        <TouchableOpacity style={styles.aiButton}>
          <MaterialIcons name="psychology" size={20} color={Colors.primary[500]} />
          <Text style={styles.aiButtonText}>AI</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* AI Insight Banner */}
      <Animated.View 
        style={[
          styles.insightBanner,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <LinearGradient colors={[Colors.primary[500], Colors.secondary[500]]} style={styles.insightGradient}>
          <MaterialIcons name="auto-awesome" size={24} color="white" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>AI Career Insight</Text>
            <Text style={styles.insightText}>
              Based on your skills, you're 87% ready for AI Product Manager role! 
              Complete 3 more courses to become job-ready.
            </Text>
          </View>
        </LinearGradient>
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
          {/* Career Paths Section */}
          <View style={styles.pathsSection}>
            <Text style={styles.sectionTitle}>Recommended Career Paths</Text>
            <Text style={styles.sectionSubtitle}>
              AI-curated paths based on your current skills and market demand
            </Text>
            
            {sampleCareerPaths.map((path, index) => renderCareerPath(path, index))}
          </View>

          {/* Current Skills Overview */}
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>Your Skills Portfolio</Text>
            <View style={styles.skillsGrid}>
              {sampleUserSkills.map(skill => (
                <TouchableOpacity
                  key={skill.id}
                  style={styles.skillCard}
                  onPress={() => onSkillDetails?.(skill.id)}
                >
                  <View style={styles.skillHeader}>
                    <View style={[
                      styles.skillIcon,
                      { backgroundColor: `${getSkillCategoryColor(skill.category)}20` }
                    ]}>
                      <MaterialIcons 
                        name={
                          skill.category === 'ai' ? 'psychology' :
                          skill.category === 'blockchain' ? 'link' :
                          skill.category === 'product' ? 'lightbulb' : 'code'
                        } 
                        size={20} 
                        color={getSkillCategoryColor(skill.category)} 
                      />
                    </View>
                    <Text style={styles.skillLevel}>{skill.level}%</Text>
                  </View>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <View style={styles.skillProgress}>
                    <View 
                      style={[
                        styles.skillProgressFill,
                        { 
                          width: `${skill.level}%`,
                          backgroundColor: getSkillCategoryColor(skill.category)
                        }
                      ]} 
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Career Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedPath && (
          <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.text.inverse} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedPath.title}</Text>
              <TouchableOpacity onPress={() => onCareerDetails?.(selectedPath.id)}>
                <MaterialIcons name="launch" size={20} color={Colors.primary[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Career Overview</Text>
                <Text style={styles.modalDescription}>{selectedPath.description}</Text>
                
                <View style={styles.modalMetrics}>
                  <View style={styles.modalMetricCard}>
                    <Text style={styles.modalMetricValue}>{selectedPath.salaryRange}</Text>
                    <Text style={styles.modalMetricLabel}>Salary Range</Text>
                  </View>
                  <View style={styles.modalMetricCard}>
                    <Text style={styles.modalMetricValue}>{selectedPath.timeToAchieve}</Text>
                    <Text style={styles.modalMetricLabel}>Time to Achieve</Text>
                  </View>
                  <View style={styles.modalMetricCard}>
                    <Text style={[
                      styles.modalMetricValue,
                      { color: getDemandColor(selectedPath.demandLevel) }
                    ]}>
                      {selectedPath.demandLevel.replace('-', ' ').toUpperCase()}
                    </Text>
                    <Text style={styles.modalMetricLabel}>Market Demand</Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Required Skills</Text>
                {selectedPath.requiredSkills.map(skill => {
                  const userSkill = sampleUserSkills.find(s => s.name === skill.name);
                  const currentLevel = userSkill?.level || 0;
                  const gap = Math.max(0, skill.level - currentLevel);
                  
                  return (
                    <View key={skill.id} style={styles.skillRequirement}>
                      <View style={styles.skillReqHeader}>
                        <Text style={styles.skillReqName}>{skill.name}</Text>
                        <Text style={styles.skillReqLevel}>
                          {currentLevel}% → {skill.level}%
                        </Text>
                      </View>
                      <View style={styles.skillReqProgress}>
                        <View style={styles.skillReqProgressBg}>
                          <View 
                            style={[
                              styles.skillReqProgressFill,
                              { 
                                width: `${(currentLevel / skill.level) * 100}%`,
                                backgroundColor: currentLevel >= skill.level ? 
                                  Colors.success : getSkillCategoryColor(skill.category)
                              }
                            ]} 
                          />
                        </View>
                        {gap > 0 && skill.timeToAcquire && (
                          <Text style={styles.skillGap}>{skill.timeToAcquire} to master</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Next Steps</Text>
                {selectedPath.nextSteps.map((step, index) => (
                  <View key={index} style={styles.nextStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Top Companies</Text>
                <View style={styles.companiesGrid}>
                  {selectedPath.companies.map((company, index) => (
                    <View key={index} style={styles.companyChip}>
                      <Text style={styles.companyText}>{company}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={styles.startPathButton}
                onPress={() => {
                  setModalVisible(false);
                  onStartLearningPath?.(selectedPath.id);
                }}
              >
                <Text style={styles.startPathButtonText}>Start This Career Path</Text>
                <MaterialIcons name="rocket-launch" size={20} color="white" />
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        )}
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
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  insightBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  insightGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  pathsSection: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xl,
  },
  careerCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  careerCardGradient: {
    padding: 2,
  },
  careerCardContent: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  careerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  careerTitleSection: {
    flex: 1,
  },
  careerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  careerIndustry: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  matchSection: {
    alignItems: 'center',
  },
  matchLabel: {
    fontSize: 10,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  careerDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  careerMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  skillsPreview: {
    marginBottom: Spacing.md,
  },
  skillsLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 4,
  },
  skillChipText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 10,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  careerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  viewDetailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  startLearningButton: {
    flex: 2,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  startLearningText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  progressRing: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressRingInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  skillsSection: {
    marginBottom: Spacing['2xl'],
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  skillCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  skillIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  skillName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  skillProgress: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  skillProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  modalContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 44,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  modalSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  modalMetrics: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalMetricCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  modalMetricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  modalMetricLabel: {
    fontSize: 11,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  skillRequirement: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  skillReqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  skillReqName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  skillReqLevel: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  skillReqProgress: {
    gap: Spacing.xs,
  },
  skillReqProgressBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillReqProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  skillGap: {
    fontSize: 11,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  companiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  companyChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  companyText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  startPathButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    marginVertical: Spacing.xl,
    gap: Spacing.sm,
    ...Shadows.lg,
  },
  startPathButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CareerMappingScreen;
