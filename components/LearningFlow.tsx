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

interface LearningModule {
  id: string;
  title: string;
  category: 'AI' | 'Blockchain' | 'Product';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  isLocked: boolean;
  lessons: Lesson[];
  description: string;
  prerequisites?: string[];
  skills: string[];
  xpReward: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'project' | 'interactive';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  xpReward: number;
}

interface LearningFlowProps {
  modules: LearningModule[];
  currentModule?: string;
  onSelectModule?: (moduleId: string) => void;
  onStartLesson?: (lessonId: string) => void;
  onBack?: () => void;
  userLevel?: number;
}

const sampleModules: LearningModule[] = [
  {
    id: 'ai-basics',
    title: 'AI Fundamentals for Startups',
    category: 'AI',
    difficulty: 'Beginner',
    duration: '4 hours',
    progress: 35,
    isLocked: false,
    description: 'Learn the essential AI concepts every startup founder needs to know',
    skills: ['Machine Learning Basics', 'AI Strategy', 'Data Understanding'],
    xpReward: 150,
    lessons: [
      { id: '1', title: 'What is AI?', type: 'video', duration: '15 min', isCompleted: true, isLocked: false, xpReward: 25 },
      { id: '2', title: 'Types of Machine Learning', type: 'article', duration: '20 min', isCompleted: true, isLocked: false, xpReward: 30 },
      { id: '3', title: 'AI in Business', type: 'interactive', duration: '25 min', isCompleted: false, isLocked: false, xpReward: 35 },
      { id: '4', title: 'Building Your First Model', type: 'project', duration: '45 min', isCompleted: false, isLocked: true, xpReward: 60 },
    ]
  },
  {
    id: 'blockchain-intro',
    title: 'Blockchain for Entrepreneurs',
    category: 'Blockchain',
    difficulty: 'Beginner',
    duration: '3.5 hours',
    progress: 0,
    isLocked: false,
    description: 'Understand blockchain technology and its business applications',
    skills: ['Blockchain Basics', 'Cryptocurrency', 'Smart Contracts'],
    xpReward: 140,
    lessons: [
      { id: '1', title: 'Blockchain Fundamentals', type: 'video', duration: '18 min', isCompleted: false, isLocked: false, xpReward: 25 },
      { id: '2', title: 'Cryptocurrencies Explained', type: 'article', duration: '22 min', isCompleted: false, isLocked: true, xpReward: 30 },
      { id: '3', title: 'Smart Contract Basics', type: 'interactive', duration: '30 min', isCompleted: false, isLocked: true, xpReward: 35 },
      { id: '4', title: 'DeFi Applications', type: 'quiz', duration: '15 min', isCompleted: false, isLocked: true, xpReward: 50 },
    ]
  },
  {
    id: 'product-strategy',
    title: 'Advanced Product Strategy',
    category: 'Product',
    difficulty: 'Intermediate',
    duration: '5 hours',
    progress: 0,
    isLocked: true,
    description: 'Master product management strategies for high-growth startups',
    prerequisites: ['AI Fundamentals', 'Basic Product Knowledge'],
    skills: ['Product Strategy', 'User Research', 'Growth Metrics'],
    xpReward: 200,
    lessons: [
      { id: '1', title: 'Product-Market Fit', type: 'video', duration: '25 min', isCompleted: false, isLocked: true, xpReward: 40 },
      { id: '2', title: 'User Research Methods', type: 'project', duration: '60 min', isCompleted: false, isLocked: true, xpReward: 60 },
      { id: '3', title: 'Growth Metrics That Matter', type: 'interactive', duration: '35 min', isCompleted: false, isLocked: true, xpReward: 50 },
      { id: '4', title: 'Building Product Roadmaps', type: 'article', duration: '30 min', isCompleted: false, isLocked: true, xpReward: 50 },
    ]
  },
];

const LearningFlow: React.FC<LearningFlowProps> = ({
  modules = sampleModules,
  currentModule,
  onSelectModule,
  onStartLesson,
  onBack,
  userLevel = 1,
}) => {
  const [selectedModule, setSelectedModule] = useState<string>(currentModule || '');
  const [expandedModule, setExpandedModule] = useState<string>('');

  // Animation values
  const fadeIn = useState(new Animated.Value(0))[0];
  const slideUp = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return 'play-circle-filled';
      case 'article': return 'article';
      case 'quiz': return 'quiz';
      case 'project': return 'build';
      case 'interactive': return 'touch-app';
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

  const handleModulePress = (moduleId: string) => {
    if (expandedModule === moduleId) {
      setExpandedModule('');
    } else {
      setExpandedModule(moduleId);
    }
    setSelectedModule(moduleId);
    onSelectModule?.(moduleId);
  };

  const calculateModuleProgress = (module: LearningModule) => {
    const completedLessons = module.lessons.filter(lesson => lesson.isCompleted).length;
    return (completedLessons / module.lessons.length) * 100;
  };

  return (
    <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[500]} />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Modules</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>L{userLevel}</Text>
        </View>
      </Animated.View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Progress Overview */}
        <Animated.View 
          style={[
            styles.progressOverview,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <Text style={styles.progressTitle}>Your Learning Journey</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.statNumber}>
                {modules.filter(m => calculateModuleProgress(m) === 100).length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.statNumber}>
                {modules.filter(m => calculateModuleProgress(m) > 0 && calculateModuleProgress(m) < 100).length}
              </Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.statNumber}>{modules.length}</Text>
              <Text style={styles.statLabel}>Total Modules</Text>
            </View>
          </View>
        </Animated.View>

        {/* Learning Modules */}
        <Animated.View 
          style={[
            styles.modulesSection,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          {modules.map((module, index) => (
            <View key={module.id} style={styles.moduleContainer}>
              <TouchableOpacity
                style={[
                  styles.moduleCard,
                  module.isLocked && styles.lockedModule,
                  expandedModule === module.id && styles.expandedModule,
                ]}
                onPress={() => !module.isLocked && handleModulePress(module.id)}
                disabled={module.isLocked}
              >
                <View style={styles.moduleHeader}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(module.category)}20` }]}>
                    <MaterialIcons 
                      name={getCategoryIcon(module.category) as any} 
                      size={24} 
                      color={getCategoryColor(module.category)} 
                    />
                  </View>
                  
                  <View style={styles.moduleInfo}>
                    <View style={styles.moduleTitleRow}>
                      <Text style={[styles.moduleTitle, module.isLocked && styles.lockedText]}>
                        {module.title}
                      </Text>
                      {module.isLocked && (
                        <MaterialIcons name="lock" size={16} color={Colors.neutral[400]} />
                      )}
                    </View>
                    
                    <Text style={styles.moduleDescription}>{module.description}</Text>
                    
                    <View style={styles.moduleMetadata}>
                      <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(module.difficulty)}20` }]}>
                        <Text style={[styles.difficultyText, { color: getDifficultyColor(module.difficulty) }]}>
                          {module.difficulty}
                        </Text>
                      </View>
                      <Text style={styles.duration}>{module.duration}</Text>
                      <Text style={styles.xpReward}>+{module.xpReward} XP</Text>
                    </View>
                  </View>
                  
                  <MaterialIcons 
                    name={expandedModule === module.id ? "expand-less" : "expand-more"} 
                    size={24} 
                    color={Colors.text.tertiary} 
                  />
                </View>

                {/* Progress Bar */}
                {!module.isLocked && (
                  <View style={styles.progressSection}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${calculateModuleProgress(module)}%`,
                            backgroundColor: getCategoryColor(module.category),
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {Math.round(calculateModuleProgress(module))}% Complete
                    </Text>
                  </View>
                )}

                {/* Prerequisites */}
                {module.prerequisites && module.prerequisites.length > 0 && (
                  <View style={styles.prerequisitesSection}>
                    <Text style={styles.prerequisitesTitle}>Prerequisites:</Text>
                    <Text style={styles.prerequisitesText}>
                      {module.prerequisites.join(', ')}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Expanded Lessons */}
              {expandedModule === module.id && !module.isLocked && (
                <Animated.View style={styles.lessonsContainer}>
                  <Text style={styles.lessonsTitle}>Lessons ({module.lessons.length})</Text>
                  {module.lessons.map((lesson, lessonIndex) => (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[
                        styles.lessonCard,
                        lesson.isLocked && styles.lockedLesson,
                        lesson.isCompleted && styles.completedLesson,
                      ]}
                      onPress={() => !lesson.isLocked && onStartLesson?.(lesson.id)}
                      disabled={lesson.isLocked}
                    >
                      <View style={styles.lessonIcon}>
                        <MaterialIcons 
                          name={lesson.isCompleted ? 'check-circle' : getLessonIcon(lesson.type) as any}
                          size={20} 
                          color={
                            lesson.isCompleted ? Colors.success :
                            lesson.isLocked ? Colors.neutral[400] :
                            getCategoryColor(module.category)
                          } 
                        />
                      </View>
                      
                      <View style={styles.lessonInfo}>
                        <Text style={[
                          styles.lessonTitle,
                          lesson.isLocked && styles.lockedText,
                          lesson.isCompleted && styles.completedText,
                        ]}>
                          {lesson.title}
                        </Text>
                        <View style={styles.lessonMeta}>
                          <Text style={styles.lessonType}>{lesson.type}</Text>
                          <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                          <Text style={styles.lessonXP}>+{lesson.xpReward} XP</Text>
                        </View>
                      </View>
                      
                      {lesson.isLocked && (
                        <MaterialIcons name="lock" size={16} color={Colors.neutral[400]} />
                      )}
                    </TouchableOpacity>
                  ))}
                  
                  {/* Skills You'll Learn */}
                  <View style={styles.skillsSection}>
                    <Text style={styles.skillsTitle}>Skills you'll learn:</Text>
                    <View style={styles.skillsTags}>
                      {module.skills.map((skill, skillIndex) => (
                        <View key={skillIndex} style={styles.skillTag}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Animated.View>
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
  levelBadge: {
    backgroundColor: Colors.accent.emerald,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  progressOverview: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'space-around',
  },
  progressStat: {
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
  modulesSection: {
    paddingHorizontal: Spacing.lg,
  },
  moduleContainer: {
    marginBottom: Spacing.lg,
  },
  moduleCard: {
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
  expandedModule: {
    borderColor: Colors.primary[500],
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  duration: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  xpReward: {
    fontSize: 12,
    color: Colors.accent.orange,
    fontWeight: '500',
  },
  progressSection: {
    marginTop: Spacing.md,
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
  progressText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 4,
    textAlign: 'right',
  },
  prerequisitesSection: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  prerequisitesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: 4,
  },
  prerequisitesText: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  lessonsContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  lessonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  lockedLesson: {
    opacity: 0.5,
  },
  completedLesson: {
    backgroundColor: `${Colors.success}20`,
  },
  lessonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  completedText: {
    color: Colors.success,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  lessonType: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textTransform: 'capitalize',
  },
  lessonDuration: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  lessonXP: {
    fontSize: 12,
    color: Colors.accent.orange,
    fontWeight: '500',
  },
  skillsSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  skillsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  skillTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: Colors.text.inverse,
  },
});

export default LearningFlow;
