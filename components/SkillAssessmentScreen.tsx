import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width, height } = Dimensions.get('window');

interface Question {
  id: string;
  type: 'mcq' | 'scenario';
  category: 'AI' | 'Blockchain' | 'Product';
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation?: string;
}

interface SkillAssessmentScreenProps {
  onAssessmentComplete?: (results: AssessmentResults) => void;
  onBack?: () => void;
}

interface AssessmentResults {
  aiScore: number;
  blockchainScore: number;
  productScore: number;
  overallLevel: 'beginner' | 'intermediate' | 'advanced';
  suggestedPath: string[];
  timeSpent: number;
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    type: 'mcq',
    category: 'AI',
    question: 'What is the primary purpose of machine learning?',
    options: [
      'To replace human workers completely',
      'To enable computers to learn and improve from data without explicit programming',
      'To create robots that look like humans',
      'To make computers faster'
    ],
    correctAnswer: 1,
    difficulty: 'beginner',
    explanation: 'Machine learning enables systems to automatically learn and improve from experience without being explicitly programmed for each task.'
  },
  {
    id: '2',
    type: 'scenario',
    category: 'Product',
    question: 'Your startup just launched an MVP with 1000 users. 60% drop off after the first session. What should be your immediate priority?',
    options: [
      'Add more features to make the product more attractive',
      'Increase marketing spend to get more users',
      'Analyze user behavior and improve onboarding experience',
      'Pivot to a completely different product'
    ],
    correctAnswer: 2,
    difficulty: 'intermediate',
    explanation: 'High drop-off rates typically indicate onboarding or initial value delivery issues. Understanding user behavior is crucial before adding features or increasing spend.'
  },
  {
    id: '3',
    type: 'mcq',
    category: 'Blockchain',
    question: 'What makes blockchain technology tamper-resistant?',
    options: [
      'It uses very strong passwords',
      'Cryptographic hashing and distributed consensus mechanisms',
      'It stores data in the cloud',
      'It requires government approval for changes'
    ],
    correctAnswer: 1,
    difficulty: 'beginner',
    explanation: 'Blockchain uses cryptographic hashing to link blocks and distributed consensus to validate changes, making unauthorized modifications extremely difficult.'
  },
  {
    id: '4',
    type: 'scenario',
    category: 'AI',
    question: 'Your AI model shows 95% accuracy on training data but only 70% on real-world data. What is the most likely issue?',
    options: [
      'The model is too simple',
      'Overfitting to training data',
      'Not enough training time',
      'Wrong algorithm choice'
    ],
    correctAnswer: 1,
    difficulty: 'advanced',
    explanation: 'High training accuracy but poor real-world performance is a classic sign of overfitting, where the model memorizes training data rather than learning generalizable patterns.'
  },
  {
    id: '5',
    type: 'scenario',
    category: 'Product',
    question: 'You need to prioritize features for your next sprint. You have limited development time. How do you decide?',
    options: [
      'Build the features that are easiest to implement',
      'Focus on what competitors are doing',
      'Use data-driven prioritization (impact vs effort matrix)',
      'Ask the CEO what they want'
    ],
    correctAnswer: 2,
    difficulty: 'intermediate',
    explanation: 'Data-driven prioritization using frameworks like impact vs effort helps optimize resource allocation and maximize value delivery.'
  }
];

const SkillAssessmentScreen: React.FC<SkillAssessmentScreenProps> = ({
  onAssessmentComplete,
  onBack
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState<{ [key: string]: number }>({});

  // Animation values
  const fadeAnim = useState(new Animated.Value(1))[0];
  const progressAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(0))[0];

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / sampleQuestions.length;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  useEffect(() => {
    // Slide in animation for new question
    slideAnim.setValue(-50);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
    
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (optionIndex: number) => {
    const timeSpent = Date.now() - questionStartTime;
    setTimeSpentPerQuestion(prev => ({
      ...prev,
      [currentQuestion.id]: timeSpent
    }));

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));

    // Show explanation for a moment
    setShowExplanation(true);
    
    setTimeout(() => {
      setShowExplanation(false);
      if (currentQuestionIndex < sampleQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        completeAssessment();
      }
    }, 2500);
  };

  const calculateResults = (): AssessmentResults => {
    let aiCorrect = 0, aiTotal = 0;
    let blockchainCorrect = 0, blockchainTotal = 0;
    let productCorrect = 0, productTotal = 0;

    sampleQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;

      switch (question.category) {
        case 'AI':
          aiTotal++;
          if (isCorrect) aiCorrect++;
          break;
        case 'Blockchain':
          blockchainTotal++;
          if (isCorrect) blockchainCorrect++;
          break;
        case 'Product':
          productTotal++;
          if (isCorrect) productCorrect++;
          break;
      }
    });

    const aiScore = aiTotal > 0 ? Math.round((aiCorrect / aiTotal) * 100) : 0;
    const blockchainScore = blockchainTotal > 0 ? Math.round((blockchainCorrect / blockchainTotal) * 100) : 0;
    const productScore = productTotal > 0 ? Math.round((productCorrect / productTotal) * 100) : 0;

    const overallScore = (aiScore + blockchainScore + productScore) / 3;
    let overallLevel: 'beginner' | 'intermediate' | 'advanced';
    
    if (overallScore >= 80) overallLevel = 'advanced';
    else if (overallScore >= 60) overallLevel = 'intermediate';
    else overallLevel = 'beginner';

    const suggestedPath = generateSuggestedPath(aiScore, blockchainScore, productScore, overallLevel);
    const totalTime = Date.now() - startTime;

    return {
      aiScore,
      blockchainScore,
      productScore,
      overallLevel,
      suggestedPath,
      timeSpent: totalTime
    };
  };

  const generateSuggestedPath = (ai: number, blockchain: number, product: number, level: string): string[] => {
    const suggestions = [];
    
    if (level === 'beginner') {
      suggestions.push('Fundamentals of Technology for Startups');
      if (ai < 70) suggestions.push('AI Basics for Non-Technical Founders');
      if (blockchain < 70) suggestions.push('Blockchain Fundamentals');
      if (product < 70) suggestions.push('Product Management Essentials');
    } else if (level === 'intermediate') {
      if (ai < 80) suggestions.push('Applied AI in Business');
      if (blockchain < 80) suggestions.push('Practical Blockchain Applications');
      if (product < 80) suggestions.push('Advanced Product Strategy');
      suggestions.push('Cross-functional Leadership');
    } else {
      suggestions.push('Advanced Technology Strategy');
      suggestions.push('Innovation and Emerging Technologies');
      suggestions.push('Building AI-First Products');
    }

    return suggestions;
  };

  const completeAssessment = () => {
    const assessmentResults = calculateResults();
    setResults(assessmentResults);
    setIsComplete(true);
    onAssessmentComplete?.(assessmentResults);
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const iconName = category === 'AI' ? 'psychology' : 
                     category === 'Blockchain' ? 'link' : 'lightbulb';
    const color = category === 'AI' ? Colors.primary[500] : 
                  category === 'Blockchain' ? Colors.secondary[500] : 
                  Colors.accent.purple;

    return (
      <View style={[styles.categoryIcon, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={iconName as any} size={16} color={color} />
      </View>
    );
  };

  if (isComplete && results) {
    return (
      <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary[500]} />
        
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Assessment Complete!</Text>
          </View>

          <View style={styles.resultsContainer}>
            <View style={styles.congratsSection}>
              <MaterialIcons name="emoji-events" size={64} color={Colors.accent.orange} />
              <Text style={styles.congratsText}>Well Done!</Text>
              <Text style={styles.levelText}>Your Level: {results.overallLevel.toUpperCase()}</Text>
            </View>

            <View style={styles.scoresGrid}>
              <View style={styles.scoreCard}>
                <CategoryIcon category="AI" />
                <Text style={styles.scoreLabel}>AI Skills</Text>
                <Text style={styles.scoreValue}>{results.aiScore}%</Text>
              </View>
              <View style={styles.scoreCard}>
                <CategoryIcon category="Blockchain" />
                <Text style={styles.scoreLabel}>Blockchain</Text>
                <Text style={styles.scoreValue}>{results.blockchainScore}%</Text>
              </View>
              <View style={styles.scoreCard}>
                <CategoryIcon category="Product" />
                <Text style={styles.scoreLabel}>Product</Text>
                <Text style={styles.scoreValue}>{results.productScore}%</Text>
              </View>
            </View>

            <View style={styles.suggestionSection}>
              <Text style={styles.suggestionTitle}>🎯 Recommended Learning Path</Text>
              {results.suggestedPath.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <View style={styles.suggestionNumber}>
                    <Text style={styles.suggestionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => onAssessmentComplete?.(results)}
            >
              <LinearGradient colors={[Colors.primary[500], Colors.secondary[500]]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Continue to Personalization</Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[500]} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skill Assessment</Text>
        <Text style={styles.questionCounter}>
          {currentQuestionIndex + 1} of {sampleQuestions.length}
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
        <Text style={styles.progressText}>{Math.round(progress * 100)}% Complete</Text>
      </View>

      <Animated.View style={[styles.questionContainer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.questionHeader}>
          <CategoryIcon category={currentQuestion.category} />
          <Text style={styles.categoryText}>{currentQuestion.category}</Text>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{currentQuestion.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                answers[currentQuestion.id] === index && styles.selectedOption
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={showExplanation}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionNumber}>
                  <Text style={styles.optionNumberText}>{String.fromCharCode(65 + index)}</Text>
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </View>
              {answers[currentQuestion.id] === index && (
                <MaterialIcons 
                  name={index === currentQuestion.correctAnswer ? "check-circle" : "cancel"} 
                  size={24} 
                  color={index === currentQuestion.correctAnswer ? Colors.success : Colors.error} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {showExplanation && currentQuestion.explanation && (
          <Animated.View style={[styles.explanationContainer, { opacity: fadeAnim }]}>
            <MaterialIcons name="lightbulb" size={20} color={Colors.accent.orange} />
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </Animated.View>
        )}
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 44,
  },
  scrollContainer: {
    flex: 1,
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
  questionCounter: {
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
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent.emerald,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textTransform: 'capitalize',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    color: Colors.text.inverse,
    marginBottom: Spacing.xl,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionButton: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedOption: {
    borderColor: Colors.primary[500],
    backgroundColor: `${Colors.primary[500]}10`,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text.inverse,
    flex: 1,
    lineHeight: 22,
  },
  explanationContainer: {
    flexDirection: 'row',
    backgroundColor: `${Colors.accent.orange}20`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent.orange,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.text.inverse,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  resultsContainer: {
    padding: Spacing.lg,
  },
  congratsSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginTop: Spacing.md,
  },
  levelText: {
    fontSize: 18,
    color: Colors.accent.emerald,
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
  scoresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginTop: 4,
  },
  suggestionSection: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  suggestionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  suggestionNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.text.inverse,
    flex: 1,
    lineHeight: 22,
  },
  continueButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default SkillAssessmentScreen;
