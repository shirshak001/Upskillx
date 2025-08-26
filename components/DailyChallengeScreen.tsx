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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  category: 'AI' | 'Blockchain' | 'Product' | 'General';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  xpReward: number;
  coinReward: number;
  streakBonus: number;
  questions: ChallengeQuestion[];
  isCompleted: boolean;
  completedAt?: Date;
}

interface ChallengeQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'quick-read' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface DailyChallengeScreenProps {
  onBack?: () => void;
  onChallengeComplete?: (challengeId: string, score: number) => void;
  currentStreak?: number;
}

const todaysChallenge: DailyChallenge = {
  id: 'daily-2025-08-26',
  title: "AI Ethics Quick Check",
  description: "Test your understanding of ethical considerations in AI development and deployment",
  category: 'AI',
  difficulty: 'Medium',
  estimatedTime: '5-7 min',
  xpReward: 100,
  coinReward: 50,
  streakBonus: 25,
  isCompleted: false,
  questions: [
    {
      id: '1',
      type: 'multiple-choice',
      question: 'Which of the following is the most important consideration when implementing AI in hiring processes?',
      options: [
        'Processing speed of the algorithm',
        'Cost reduction potential',
        'Bias prevention and fairness',
        'Integration with existing systems'
      ],
      correctAnswer: 2,
      explanation: 'Bias prevention and fairness are crucial to ensure equal opportunities and avoid discrimination in hiring.',
      points: 25,
    },
    {
      id: '2',
      type: 'true-false',
      question: 'AI systems can make completely objective decisions without human bias.',
      options: ['True', 'False'],
      correctAnswer: 1,
      explanation: 'False. AI systems can inherit and amplify human biases present in training data or design decisions.',
      points: 20,
    },
    {
      id: '3',
      type: 'scenario',
      question: 'Your AI recommendation system shows different products to users based on demographic data. A customer complains about discriminatory recommendations. What should be your immediate action?',
      options: [
        'Ignore the complaint as the AI is automated',
        'Investigate the algorithm for potential bias',
        'Explain that AI cannot be biased',
        'Refer to the terms of service'
      ],
      correctAnswer: 1,
      explanation: 'Investigating for bias is essential. AI systems can exhibit discriminatory behavior and need regular auditing.',
      points: 30,
    },
    {
      id: '4',
      type: 'multiple-choice',
      question: 'What is "explainable AI" and why is it important?',
      options: [
        'AI that can explain other AI systems',
        'AI that provides understandable reasoning for its decisions',
        'AI that teaches users about technology',
        'AI that only works with explanations'
      ],
      correctAnswer: 1,
      explanation: 'Explainable AI provides transparent reasoning, crucial for trust, accountability, and debugging.',
      points: 25,
    },
  ],
};

const challengeHistory = [
  {
    date: '2025-08-25',
    title: 'Blockchain Fundamentals',
    score: 85,
    xpEarned: 85,
    completed: true,
  },
  {
    date: '2025-08-24',
    title: 'Product Strategy Basics',
    score: 92,
    xpEarned: 92,
    completed: true,
  },
  {
    date: '2025-08-23',
    title: 'AI in Healthcare',
    score: 78,
    xpEarned: 78,
    completed: true,
  },
];

const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  onBack,
  onChallengeComplete,
  currentStreak = 7,
}) => {
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(todaysChallenge.isCompleted);
  const [animatedValues] = useState({
    fadeIn: new Animated.Value(0),
    slideUp: new Animated.Value(50),
    progressWidth: new Animated.Value(0),
    streakPulse: new Animated.Value(1),
  });

  const currentQuestion = challengeStarted ? todaysChallenge.questions[currentQuestionIndex] : null;
  const progress = challengeStarted ? ((currentQuestionIndex + 1) / todaysChallenge.questions.length) * 100 : 0;

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

    // Streak pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.streakPulse, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.streakPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(animatedValues.progressWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return Colors.primary[500];
      case 'Blockchain': return Colors.secondary[500];
      case 'Product': return Colors.accent.orange;
      default: return Colors.neutral[500];
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return Colors.success;
      case 'Medium': return Colors.warning;
      case 'Hard': return Colors.error;
      default: return Colors.neutral[500];
    }
  };

  const handleStartChallenge = () => {
    setChallengeStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answerIndex }));
  };

  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    const userAnswer = answers[currentQuestion.id];
    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
    }

    if (currentQuestionIndex < todaysChallenge.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      finishChallenge();
    }
  };

  const finishChallenge = () => {
    setIsCompleted(true);
    const finalScore = score + (answers[currentQuestion?.id || ''] === currentQuestion?.correctAnswer ? currentQuestion?.points || 0 : 0);
    const totalXP = Math.round((finalScore / 100) * todaysChallenge.xpReward) + (currentStreak >= 7 ? todaysChallenge.streakBonus : 0);
    
    Alert.alert(
      'Challenge Complete! 🎉',
      `Score: ${finalScore}/100\nXP Earned: ${totalXP}\nCoins Earned: ${todaysChallenge.coinReward}${currentStreak >= 7 ? `\nStreak Bonus: +${todaysChallenge.streakBonus} XP` : ''}`,
      [
        { text: 'Great!', onPress: () => onChallengeComplete?.(todaysChallenge.id, finalScore) }
      ]
    );
  };

  if (isCompleted) {
    return (
      <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary[500]} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daily Challenge</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Completion State */}
        <View style={styles.completionContainer}>
          <View style={styles.completionIcon}>
            <MaterialIcons name="check-circle" size={64} color={Colors.success} />
          </View>
          <Text style={styles.completionTitle}>Challenge Complete!</Text>
          <Text style={styles.completionSubtitle}>Come back tomorrow for a new challenge</Text>
          
          <View style={styles.streakMaintained}>
            <MaterialIcons name="local-fire-department" size={24} color={Colors.accent.orange} />
            <Text style={styles.streakText}>Streak maintained: {currentStreak + 1} days</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (challengeStarted && currentQuestion) {
    return (
      <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary[500]} />
        
        {/* Header with Progress */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1}/{todaysChallenge.questions.length}
            </Text>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { width: animatedValues.progressWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }) }
                ]} 
              />
            </View>
          </View>
          <Text style={styles.scoreText}>{score}pts</Text>
        </View>

        {/* Question */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            
            {currentQuestion.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answers[currentQuestion.id] === index && styles.selectedOption,
                  showExplanation && index === currentQuestion.correctAnswer && styles.correctOption,
                  showExplanation && answers[currentQuestion.id] === index && index !== currentQuestion.correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <Text style={[
                  styles.optionText,
                  answers[currentQuestion.id] === index && styles.selectedOptionText,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            {answers[currentQuestion.id] !== undefined && !showExplanation && (
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={() => setShowExplanation(true)}
              >
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              </TouchableOpacity>
            )}

            {showExplanation && (
              <View style={styles.explanationCard}>
                <View style={styles.explanationHeader}>
                  <MaterialIcons 
                    name={answers[currentQuestion.id] === currentQuestion.correctAnswer ? "check-circle" : "info"} 
                    size={20} 
                    color={answers[currentQuestion.id] === currentQuestion.correctAnswer ? Colors.success : Colors.accent.orange} 
                  />
                  <Text style={styles.explanationTitle}>
                    {answers[currentQuestion.id] === currentQuestion.correctAnswer ? "Correct!" : "Explanation"}
                  </Text>
                  <Text style={styles.pointsEarned}>
                    +{answers[currentQuestion.id] === currentQuestion.correctAnswer ? currentQuestion.points : 0}pts
                  </Text>
                </View>
                <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                
                <TouchableOpacity 
                  style={styles.nextButton}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex < todaysChallenge.questions.length - 1 ? "Next Question" : "Finish Challenge"}
                  </Text>
                  <MaterialIcons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

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
        <Text style={styles.headerTitle}>Daily Challenge</Text>
        <Animated.View 
          style={[
            styles.streakBadge,
            { transform: [{ scale: animatedValues.streakPulse }] }
          ]}
        >
          <MaterialIcons name="local-fire-department" size={16} color={Colors.accent.orange} />
          <Text style={styles.streakBadgeText}>{currentStreak}</Text>
        </Animated.View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Challenge Card */}
        <Animated.View 
          style={[
            styles.challengeCard,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <LinearGradient
            colors={[getCategoryColor(todaysChallenge.category), `${getCategoryColor(todaysChallenge.category)}80`]}
            style={styles.challengeGradient}
          >
            <View style={styles.challengeHeader}>
              <View style={styles.challengeCategory}>
                <MaterialIcons 
                  name={todaysChallenge.category === 'AI' ? 'psychology' : 'lightbulb'} 
                  size={20} 
                  color="white" 
                />
                <Text style={styles.categoryText}>{todaysChallenge.category}</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(todaysChallenge.difficulty) }]}>
                <Text style={styles.difficultyText}>{todaysChallenge.difficulty}</Text>
              </View>
            </View>

            <Text style={styles.challengeTitle}>{todaysChallenge.title}</Text>
            <Text style={styles.challengeDescription}>{todaysChallenge.description}</Text>

            <View style={styles.challengeDetails}>
              <View style={styles.detailItem}>
                <MaterialIcons name="schedule" size={16} color="white" />
                <Text style={styles.detailText}>{todaysChallenge.estimatedTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="star" size={16} color={Colors.accent.orange} />
                <Text style={styles.detailText}>{todaysChallenge.xpReward} XP</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="monetization-on" size={16} color={Colors.accent.orange} />
                <Text style={styles.detailText}>{todaysChallenge.coinReward} coins</Text>
              </View>
            </View>

            {currentStreak >= 7 && (
              <View style={styles.streakBonus}>
                <MaterialIcons name="local-fire-department" size={16} color={Colors.accent.orange} />
                <Text style={styles.streakBonusText}>
                  Streak Bonus: +{todaysChallenge.streakBonus} XP
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.startButton} onPress={handleStartChallenge}>
              <Text style={styles.startButtonText}>Start Challenge</Text>
              <MaterialIcons name="play-arrow" size={20} color={Colors.primary[500]} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Challenge History */}
        <Animated.View 
          style={[
            styles.historySection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Challenges</Text>
          {challengeHistory.map((challenge, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyDate}>
                <Text style={styles.historyDateText}>
                  {new Date(challenge.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
              
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>{challenge.title}</Text>
                <View style={styles.historyScore}>
                  <MaterialIcons name="grade" size={16} color={Colors.accent.orange} />
                  <Text style={styles.historyScoreText}>{challenge.score}%</Text>
                  <Text style={styles.historyXP}>+{challenge.xpEarned} XP</Text>
                </View>
              </View>

              <MaterialIcons name="check-circle" size={20} color={Colors.success} />
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
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.orange + '20',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
  },
  streakBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.accent.orange,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent.emerald,
    borderRadius: 2,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent.orange,
  },
  content: {
    flex: 1,
  },
  challengeCard: {
    margin: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  challengeGradient: {
    padding: Spacing.xl,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  challengeCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.sm,
  },
  challengeDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  streakBonus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  streakBonusText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  questionContainer: {
    padding: Spacing.lg,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.inverse,
    lineHeight: 26,
    marginBottom: Spacing.xl,
  },
  optionButton: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[600],
  },
  selectedOption: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  correctOption: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  incorrectOption: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text.inverse,
    lineHeight: 20,
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.secondary[500],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'center',
    marginTop: Spacing.lg,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  explanationCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[600],
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  pointsEarned: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.accent.orange,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-end',
    gap: Spacing.sm,
  },
  nextButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  historySection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyDate: {
    width: 50,
    marginRight: Spacing.md,
  },
  historyDateText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  historyDetails: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  historyScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyScoreText: {
    fontSize: 12,
    color: Colors.accent.orange,
    fontWeight: '500',
  },
  historyXP: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  completionIcon: {
    marginBottom: Spacing.xl,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  streakMaintained: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.orange + '20',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent.orange,
  },
});

export default DailyChallengeScreen;
