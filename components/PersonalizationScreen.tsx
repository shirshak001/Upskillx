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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface PersonalizationData {
  role: string;
  interests: string[];
  experienceLevel: string;
  preferredLearningStyle: string;
  timeCommitment: string;
  goals: string[];
}

interface PersonalizationScreenProps {
  onPersonalizationComplete?: (data: PersonalizationData) => void;
  onBack?: () => void;
  assessmentResults?: any;
}

const roles = [
  {
    id: 'developer',
    title: 'Developer',
    icon: 'code',
    description: 'Building products with code',
    color: Colors.primary[500],
  },
  {
    id: 'pm',
    title: 'Product Manager',
    icon: 'dashboard',
    description: 'Leading product strategy',
    color: Colors.secondary[500],
  },
  {
    id: 'designer',
    title: 'Designer',
    icon: 'palette',
    description: 'Creating user experiences',
    color: Colors.accent.pink,
  },
  {
    id: 'analyst',
    title: 'Data Analyst',
    icon: 'analytics',
    description: 'Extracting insights from data',
    color: Colors.accent.purple,
  },
  {
    id: 'founder',
    title: 'Founder/CEO',
    icon: 'rocket-launch',
    description: 'Building the company',
    color: Colors.accent.orange,
  },
  {
    id: 'marketing',
    title: 'Marketing',
    icon: 'campaign',
    description: 'Growing user base',
    color: Colors.accent.emerald,
  },
];

const interests = [
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    icon: 'psychology',
    description: 'Machine learning, neural networks, NLP',
    color: Colors.primary[500],
  },
  {
    id: 'blockchain',
    title: 'Blockchain & Web3',
    icon: 'link',
    description: 'Cryptocurrency, DeFi, smart contracts',
    color: Colors.secondary[500],
  },
  {
    id: 'product',
    title: 'Product Strategy',
    icon: 'lightbulb',
    description: 'Product management, user research, growth',
    color: Colors.accent.orange,
  },
  {
    id: 'data',
    title: 'Data Science',
    icon: 'analytics',
    description: 'Analytics, visualization, insights',
    color: Colors.accent.purple,
  },
  {
    id: 'design',
    title: 'UX/UI Design',
    icon: 'palette',
    description: 'User experience, interface design',
    color: Colors.accent.pink,
  },
  {
    id: 'growth',
    title: 'Growth & Marketing',
    icon: 'trending-up',
    description: 'User acquisition, retention, virality',
    color: Colors.accent.emerald,
  },
];

const experienceLevels = [
  { id: 'beginner', title: 'Beginner', description: '0-1 years experience' },
  { id: 'intermediate', title: 'Intermediate', description: '2-4 years experience' },
  { id: 'advanced', title: 'Advanced', description: '5+ years experience' },
];

const learningStyles = [
  { id: 'visual', title: 'Visual Learning', icon: 'visibility', description: 'Videos, diagrams, infographics' },
  { id: 'hands-on', title: 'Hands-on Practice', icon: 'build', description: 'Projects, coding, experiments' },
  { id: 'reading', title: 'Reading & Research', icon: 'menu-book', description: 'Articles, documentation, guides' },
  { id: 'interactive', title: 'Interactive Content', icon: 'quiz', description: 'Quizzes, simulations, discussions' },
];

const timeCommitments = [
  { id: 'light', title: '1-2 hours/week', description: 'Casual learning' },
  { id: 'moderate', title: '3-5 hours/week', description: 'Regular practice' },
  { id: 'intensive', title: '6+ hours/week', description: 'Accelerated growth' },
];

const goals = [
  { id: 'career-change', title: 'Career Change', icon: 'swap-horiz' },
  { id: 'skill-upgrade', title: 'Skill Upgrade', icon: 'trending-up' },
  { id: 'startup-launch', title: 'Launch Startup', icon: 'rocket-launch' },
  { id: 'team-leading', title: 'Lead a Team', icon: 'group' },
  { id: 'freelancing', title: 'Start Freelancing', icon: 'work' },
  { id: 'certification', title: 'Get Certified', icon: 'verified' },
];

const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({
  onPersonalizationComplete,
  onBack,
  assessmentResults
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<string>('');
  const [selectedTimeCommitment, setSelectedTimeCommitment] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Animation values
  const slideAnim = useState(new Animated.Value(0))[0];
  const progressAnim = useState(new Animated.Value(0))[0];

  const steps = [
    'Choose Your Role',
    'Select Interests',
    'Experience Level',
    'Learning Style',
    'Time Commitment',
    'Your Goals'
  ];

  const progress = (currentStep + 1) / steps.length;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Slide in animation
    slideAnim.setValue(-50);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const personalizationData: PersonalizationData = {
      role: selectedRole,
      interests: selectedInterests,
      experienceLevel: selectedExperience,
      preferredLearningStyle: selectedLearningStyle,
      timeCommitment: selectedTimeCommitment,
      goals: selectedGoals,
    };

    onPersonalizationComplete?.(personalizationData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedRole !== '';
      case 1: return selectedInterests.length > 0;
      case 2: return selectedExperience !== '';
      case 3: return selectedLearningStyle !== '';
      case 4: return selectedTimeCommitment !== '';
      case 5: return selectedGoals.length > 0;
      default: return false;
    }
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your primary role?</Text>
            <Text style={styles.stepDescription}>
              Help us tailor content to your professional focus
            </Text>
            <View style={styles.optionsGrid}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleCard,
                    selectedRole === role.id && styles.selectedCard
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                >
                  <View style={[styles.roleIcon, { backgroundColor: `${role.color}20` }]}>
                    <MaterialIcons name={role.icon as any} size={24} color={role.color} />
                  </View>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What interests you most?</Text>
            <Text style={styles.stepDescription}>
              Select multiple areas you want to learn about (2-3 recommended)
            </Text>
            <View style={styles.interestsList}>
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestCard,
                    selectedInterests.includes(interest.id) && styles.selectedCard
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                >
                  <View style={[styles.interestIcon, { backgroundColor: `${interest.color}20` }]}>
                    <MaterialIcons name={interest.icon as any} size={20} color={interest.color} />
                  </View>
                  <View style={styles.interestContent}>
                    <Text style={styles.interestTitle}>{interest.title}</Text>
                    <Text style={styles.interestDescription}>{interest.description}</Text>
                  </View>
                  {selectedInterests.includes(interest.id) && (
                    <MaterialIcons name="check-circle" size={20} color={Colors.accent.emerald} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your experience level?</Text>
            <Text style={styles.stepDescription}>
              This helps us recommend the right difficulty level
            </Text>
            <View style={styles.levelsList}>
              {experienceLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.levelCard,
                    selectedExperience === level.id && styles.selectedCard
                  ]}
                  onPress={() => setSelectedExperience(level.id)}
                >
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>How do you learn best?</Text>
            <Text style={styles.stepDescription}>
              Choose your preferred learning method
            </Text>
            <View style={styles.stylesList}>
              {learningStyles.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  style={[
                    styles.styleCard,
                    selectedLearningStyle === style.id && styles.selectedCard
                  ]}
                  onPress={() => setSelectedLearningStyle(style.id)}
                >
                  <MaterialIcons name={style.icon as any} size={24} color={Colors.primary[500]} />
                  <Text style={styles.styleTitle}>{style.title}</Text>
                  <Text style={styles.styleDescription}>{style.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>How much time can you commit?</Text>
            <Text style={styles.stepDescription}>
              We'll adjust your learning path accordingly
            </Text>
            <View style={styles.timeList}>
              {timeCommitments.map((time) => (
                <TouchableOpacity
                  key={time.id}
                  style={[
                    styles.timeCard,
                    selectedTimeCommitment === time.id && styles.selectedCard
                  ]}
                  onPress={() => setSelectedTimeCommitment(time.id)}
                >
                  <Text style={styles.timeTitle}>{time.title}</Text>
                  <Text style={styles.timeDescription}>{time.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What are your goals?</Text>
            <Text style={styles.stepDescription}>
              Select what you want to achieve (multiple selections allowed)
            </Text>
            <View style={styles.goalsGrid}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    selectedGoals.includes(goal.id) && styles.selectedCard
                  ]}
                  onPress={() => toggleGoal(goal.id)}
                >
                  <MaterialIcons name={goal.icon as any} size={24} color={Colors.secondary[500]} />
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  {selectedGoals.includes(goal.id) && (
                    <View style={styles.checkIcon}>
                      <MaterialIcons name="check" size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[500]} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personalize Your Journey</Text>
        <Text style={styles.stepCounter}>
          {currentStep + 1} of {steps.length}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{steps[currentStep]}</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.contentContainer, { transform: [{ translateX: slideAnim }] }]}>
          {renderStepContent()}
        </Animated.View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        {currentStep > 0 && (
          <TouchableOpacity 
            style={styles.backStepButton}
            onPress={() => setCurrentStep(prev => prev - 1)}
          >
            <Text style={styles.backStepText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.nextButton, !canProceed() && styles.disabledButton]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <LinearGradient 
            colors={canProceed() ? [Colors.primary[500], Colors.secondary[500]] : [Colors.neutral[400], Colors.neutral[500]]} 
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    flex: 1,
    textAlign: 'center',
  },
  stepCounter: {
    fontSize: 14,
    color: Colors.text.tertiary,
    width: 60,
    textAlign: 'right',
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent.emerald,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text.inverse,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  stepContent: {
    paddingBottom: Spacing.xl,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  roleCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: Colors.primary[500],
    backgroundColor: `${Colors.primary[500]}10`,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  interestsList: {
    gap: Spacing.md,
  },
  interestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  interestIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  interestContent: {
    flex: 1,
  },
  interestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  interestDescription: {
    fontSize: 13,
    color: Colors.text.tertiary,
  },
  levelsList: {
    gap: Spacing.md,
  },
  levelCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  stylesList: {
    gap: Spacing.md,
  },
  styleCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  styleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginTop: Spacing.sm,
    marginBottom: 4,
    textAlign: 'center',
  },
  styleDescription: {
    fontSize: 13,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  timeList: {
    gap: Spacing.md,
  },
  timeCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  timeDescription: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  goalCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent.emerald,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  backStepButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  backStepText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  nextButton: {
    flex: 2,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default PersonalizationScreen;
