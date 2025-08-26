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

const { width, height } = Dimensions.get('window');

interface LearningPathModule {
  id: string;
  title: string;
  category: 'AI' | 'Blockchain' | 'Product';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  progress: number;
  isCompleted: boolean;
  isLocked: boolean;
  isRecommended: boolean;
  xpReward: number;
  lessons: PathLesson[];
  prerequisites: string[];
  description: string;
  skills: string[];
}

interface PathLesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'project' | 'interactive';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  xpReward: number;
}

interface LearningPathScreenProps {
  userProfile?: any;
  assessmentResults?: any;
  onModuleSelect?: (moduleId: string) => void;
  onBack?: () => void;
  currentProgress?: any;
}

const adaptiveLearningPath: LearningPathModule[] = [
  {
    id: 'foundations',
    title: 'Tech Foundations for Startups',
    category: 'Product',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    progress: 100,
    isCompleted: true,
    isLocked: false,
    isRecommended: false,
    xpReward: 120,
    prerequisites: [],
    description: 'Essential technology concepts every startup founder needs',
    skills: ['Tech Literacy', 'Startup Fundamentals', 'Digital Strategy'],
    lessons: [
      { id: '1', title: 'Understanding Tech Stack', type: 'video', duration: '15 min', isCompleted: true, isLocked: false, xpReward: 30 },
      { id: '2', title: 'MVP Development Strategy', type: 'article', duration: '20 min', isCompleted: true, isLocked: false, xpReward: 25 },
      { id: '3', title: 'Tech Team Building', type: 'interactive', duration: '25 min', isCompleted: true, isLocked: false, xpReward: 35 },
      { id: '4', title: 'Startup Tech Assessment', type: 'quiz', duration: '10 min', isCompleted: true, isLocked: false, xpReward: 30 },
    ]
  },
  {
    id: 'ai-fundamentals',
    title: 'AI for Business Innovation',
    category: 'AI',
    difficulty: 'Beginner',
    estimatedTime: '4-5 hours',
    progress: 75,
    isCompleted: false,
    isLocked: false,
    isRecommended: true,
    xpReward: 180,
    prerequisites: ['Tech Foundations'],
    description: 'Learn how AI can transform your business and create competitive advantages',
    skills: ['AI Strategy', 'Machine Learning Basics', 'AI Implementation'],
    lessons: [
      { id: '1', title: 'AI Business Applications', type: 'video', duration: '20 min', isCompleted: true, isLocked: false, xpReward: 35 },
      { id: '2', title: 'Machine Learning for Startups', type: 'article', duration: '25 min', isCompleted: true, isLocked: false, xpReward: 30 },
      { id: '3', title: 'AI Implementation Strategy', type: 'interactive', duration: '30 min', isCompleted: true, isLocked: false, xpReward: 45 },
      { id: '4', title: 'Building Your First AI Feature', type: 'project', duration: '60 min', isCompleted: false, isLocked: false, xpReward: 70 },
    ]
  },
  {
    id: 'blockchain-business',
    title: 'Blockchain & Web3 Opportunities',
    category: 'Blockchain',
    difficulty: 'Intermediate',
    estimatedTime: '3-4 hours',
    progress: 0,
    isCompleted: false,
    isLocked: false,
    isRecommended: false,
    xpReward: 160,
    prerequisites: ['AI Fundamentals'],
    description: 'Explore blockchain technology and decentralized business models',
    skills: ['Blockchain Strategy', 'Web3 Understanding', 'DeFi Applications'],
    lessons: [
      { id: '1', title: 'Blockchain for Business', type: 'video', duration: '18 min', isCompleted: false, isLocked: false, xpReward: 30 },
      { id: '2', title: 'Smart Contracts Explained', type: 'article', duration: '22 min', isCompleted: false, isLocked: true, xpReward: 35 },
      { id: '3', title: 'DeFi Applications Workshop', type: 'interactive', duration: '40 min', isCompleted: false, isLocked: true, xpReward: 50 },
      { id: '4', title: 'Web3 Business Model Design', type: 'project', duration: '45 min', isCompleted: false, isLocked: true, xpReward: 45 },
    ]
  },
  {
    id: 'advanced-product',
    title: 'Advanced Product Strategy',
    category: 'Product',
    difficulty: 'Advanced',
    estimatedTime: '5-6 hours',
    progress: 0,
    isCompleted: false,
    isLocked: true,
    isRecommended: false,
    xpReward: 220,
    prerequisites: ['AI Fundamentals', 'Blockchain Business'],
    description: 'Master advanced product management and growth strategies',
    skills: ['Product Strategy', 'Growth Hacking', 'Data-Driven Decisions'],
    lessons: [
      { id: '1', title: 'Product-Market Fit Mastery', type: 'video', duration: '25 min', isCompleted: false, isLocked: true, xpReward: 40 },
      { id: '2', title: 'Growth Metrics & Analytics', type: 'article', duration: '30 min', isCompleted: false, isLocked: true, xpReward: 45 },
      { id: '3', title: 'User Behavior Analysis', type: 'interactive', duration: '45 min', isCompleted: false, isLocked: true, xpReward: 60 },
      { id: '4', title: 'Scaling Product Strategy', type: 'project', duration: '90 min', isCompleted: false, isLocked: true, xpReward: 75 },
    ]
  },
  {
    id: 'ai-integration',
    title: 'AI Integration & Automation',
    category: 'AI',
    difficulty: 'Advanced',
    estimatedTime: '6-7 hours',
    progress: 0,
    isCompleted: false,
    isLocked: true,
    isRecommended: false,
    xpReward: 250,
    prerequisites: ['Advanced Product Strategy'],
    description: 'Deep dive into AI integration and business automation',
    skills: ['AI Integration', 'Automation Strategy', 'AI Ethics'],
    lessons: [
      { id: '1', title: 'Advanced AI Applications', type: 'video', duration: '30 min', isCompleted: false, isLocked: true, xpReward: 45 },
      { id: '2', title: 'AI Ethics & Governance', type: 'article', duration: '25 min', isCompleted: false, isLocked: true, xpReward: 40 },
      { id: '3', title: 'Automation Workflow Design', type: 'interactive', duration: '60 min', isCompleted: false, isLocked: true, xpReward: 70 },
      { id: '4', title: 'AI-Powered Product Development', type: 'project', duration: '120 min', isCompleted: false, isLocked: true, xpReward: 95 },
    ]
  }
];

const LearningPathScreen: React.FC<LearningPathScreenProps> = ({
  userProfile,
  assessmentResults,
  onModuleSelect,
  onBack,
  currentProgress,
}) => {
  const [selectedModule, setSelectedModule] = useState<string>('');
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

  const getNextBestLesson = () => {
    // AI-powered recommendation logic
    const currentModule = adaptiveLearningPath.find(m => m.isRecommended);
    if (currentModule) {
      const nextLesson = currentModule.lessons.find(l => !l.isCompleted && !l.isLocked);
      return {
        module: currentModule,
        lesson: nextLesson,
      };
    }
    return null;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return Colors.primary[500];
      case 'Blockchain': return Colors.secondary[500];
      case 'Product': return Colors.accent.orange;
      default: return Colors.neutral[500];
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI': return 'psychology';
      case 'Blockchain': return 'link';
      case 'Product': return 'lightbulb';
      default: return 'book';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return Colors.success;
      case 'Intermediate': return Colors.warning;
      case 'Advanced': return Colors.error;
      default: return Colors.neutral[500];
    }
  };

  const calculateOverallProgress = () => {
    const totalModules = adaptiveLearningPath.length;
    const completedModules = adaptiveLearningPath.filter(m => m.isCompleted).length;
    const inProgressModules = adaptiveLearningPath.filter(m => m.progress > 0 && !m.isCompleted);
    
    let totalProgress = completedModules * 100;
    inProgressModules.forEach(m => totalProgress += m.progress);
    
    return Math.round(totalProgress / totalModules);
  };

  const nextRecommendation = getNextBestLesson();

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
        <Text style={styles.headerTitle}>Learning Path</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{calculateOverallProgress()}%</Text>
        </View>
      </Animated.View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* AI Recommendation Card */}
        {nextRecommendation && (
          <Animated.View 
            style={[
              styles.recommendationSection,
              {
                opacity: animatedValues.fadeIn,
                transform: [{ translateY: animatedValues.slideUp }],
              },
            ]}
          >
            <LinearGradient colors={[Colors.accent.purple, Colors.primary[500]]} style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <MaterialIcons name="auto-awesome" size={24} color="white" />
                <Text style={styles.recommendationTitle}>Next Best Lesson</Text>
              </View>
              <Text style={styles.recommendationLesson}>
                {nextRecommendation.lesson?.title || 'Continue with current module'}
              </Text>
              <Text style={styles.recommendationModule}>
                in {nextRecommendation.module.title}
              </Text>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => onModuleSelect?.(nextRecommendation.module.id)}
              >
                <Text style={styles.startButtonText}>Start Learning</Text>
                <MaterialIcons name="play-arrow" size={20} color={Colors.primary[500]} />
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Learning Path Overview */}
        <Animated.View 
          style={[
            styles.overviewSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Your Personalized Roadmap</Text>
          <View style={styles.pathStats}>
            <View style={styles.pathStat}>
              <Text style={styles.statNumber}>
                {adaptiveLearningPath.filter(m => m.isCompleted).length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.pathStat}>
              <Text style={styles.statNumber}>
                {adaptiveLearningPath.filter(m => m.progress > 0 && !m.isCompleted).length}
              </Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.pathStat}>
              <Text style={styles.statNumber}>
                {adaptiveLearningPath.reduce((sum, m) => sum + m.xpReward, 0)}
              </Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
          </View>
        </Animated.View>

        {/* Learning Path Modules */}
        <Animated.View 
          style={[
            styles.pathSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <View style={styles.pathTimeline}>
            {adaptiveLearningPath.map((module, index) => (
              <View key={module.id} style={styles.moduleContainer}>
                {/* Timeline Connector */}
                <View style={styles.timelineConnector}>
                  <View style={[
                    styles.timelineNode,
                    {
                      backgroundColor: module.isCompleted 
                        ? Colors.success 
                        : module.progress > 0 
                          ? getCategoryColor(module.category)
                          : module.isLocked 
                            ? Colors.neutral[400]
                            : Colors.neutral[300]
                    }
                  ]}>
                    <MaterialIcons 
                      name={
                        module.isCompleted ? 'check' : 
                        module.isLocked ? 'lock' : 
                        getCategoryIcon(module.category)
                      } 
                      size={16} 
                      color="white" 
                    />
                  </View>
                  {index < adaptiveLearningPath.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      {
                        backgroundColor: module.isCompleted 
                          ? Colors.success 
                          : Colors.neutral[600]
                      }
                    ]} />
                  )}
                </View>

                {/* Module Card */}
                <TouchableOpacity
                  style={[
                    styles.moduleCard,
                    module.isLocked && styles.lockedModule,
                    module.isRecommended && styles.recommendedModule,
                  ]}
                  onPress={() => !module.isLocked && onModuleSelect?.(module.id)}
                  disabled={module.isLocked}
                >
                  <View style={styles.moduleHeader}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(module.category)}20` }]}>
                      <MaterialIcons 
                        name={getCategoryIcon(module.category) as any} 
                        size={20} 
                        color={getCategoryColor(module.category)} 
                      />
                    </View>
                    <View style={styles.moduleInfo}>
                      <View style={styles.moduleTitleRow}>
                        <Text style={[styles.moduleTitle, module.isLocked && styles.lockedText]}>
                          {module.title}
                        </Text>
                        {module.isRecommended && (
                          <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedBadgeText}>NEXT</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.moduleDescription}>{module.description}</Text>
                      
                      <View style={styles.moduleMetadata}>
                        <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(module.difficulty)}20` }]}>
                          <Text style={[styles.difficultyText, { color: getDifficultyColor(module.difficulty) }]}>
                            {module.difficulty}
                          </Text>
                        </View>
                        <Text style={styles.estimatedTime}>{module.estimatedTime}</Text>
                        <Text style={styles.xpReward}>+{module.xpReward} XP</Text>
                      </View>

                      {/* Prerequisites */}
                      {module.prerequisites.length > 0 && (
                        <View style={styles.prerequisitesContainer}>
                          <Text style={styles.prerequisitesLabel}>Requires:</Text>
                          <Text style={styles.prerequisitesText}>
                            {module.prerequisites.join(', ')}
                          </Text>
                        </View>
                      )}

                      {/* Progress Bar */}
                      {module.progress > 0 && (
                        <View style={styles.moduleProgressSection}>
                          <View style={styles.moduleProgressBar}>
                            <View 
                              style={[
                                styles.moduleProgressFill, 
                                { 
                                  width: `${module.progress}%`,
                                  backgroundColor: getCategoryColor(module.category),
                                }
                              ]} 
                            />
                          </View>
                          <Text style={styles.moduleProgressText}>
                            {module.progress}% Complete
                          </Text>
                        </View>
                      )}

                      {/* Skills Preview */}
                      <View style={styles.skillsPreview}>
                        <Text style={styles.skillsLabel}>Skills:</Text>
                        <View style={styles.skillsTags}>
                          {module.skills.slice(0, 2).map((skill, skillIndex) => (
                            <View key={skillIndex} style={styles.skillTag}>
                              <Text style={styles.skillText}>{skill}</Text>
                            </View>
                          ))}
                          {module.skills.length > 2 && (
                            <Text style={styles.moreSkills}>+{module.skills.length - 2} more</Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
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
  progressBadge: {
    backgroundColor: Colors.accent.emerald,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  recommendationSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  recommendationCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  recommendationLesson: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  recommendationModule: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.lg,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
    gap: Spacing.sm,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  overviewSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
  },
  pathStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'space-around',
  },
  pathStat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  pathSection: {
    paddingHorizontal: Spacing.lg,
  },
  pathTimeline: {
    paddingLeft: Spacing.md,
  },
  moduleContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  timelineConnector: {
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  timelineNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    height: 60,
    marginTop: 8,
  },
  moduleCard: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lockedModule: {
    opacity: 0.6,
    backgroundColor: Colors.neutral[800],
  },
  recommendedModule: {
    borderColor: Colors.accent.purple,
    borderWidth: 2,
  },
  moduleHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    flex: 1,
  },
  lockedText: {
    color: Colors.neutral[400],
  },
  recommendedBadge: {
    backgroundColor: Colors.accent.purple,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  moduleDescription: {
    fontSize: 14,
    color: Colors.text.tertiary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  moduleMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  estimatedTime: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  xpReward: {
    fontSize: 12,
    color: Colors.accent.orange,
    fontWeight: '500',
  },
  prerequisitesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  prerequisitesLabel: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '500',
  },
  prerequisitesText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    flex: 1,
  },
  moduleProgressSection: {
    marginBottom: Spacing.sm,
  },
  moduleProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  moduleProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  moduleProgressText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 4,
    textAlign: 'right',
  },
  skillsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  skillsLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  skillsTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  skillTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 10,
    color: Colors.text.inverse,
  },
  moreSkills: {
    fontSize: 10,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
});

export default LearningPathScreen;
