import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width, height } = Dimensions.get('window');

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'interactive' | 'simulation';
  content: any;
  duration: string;
  xpReward: number;
  isCompleted: boolean;
  questions?: QuizQuestion[];
  interactiveElements?: InteractiveElement[];
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'scenario';
  options: string[];
  correctAnswer: number;
  explanation: string;
  xpReward: number;
}

interface InteractiveElement {
  id: string;
  type: 'simulation' | 'drag-drop' | 'code' | 'scenario';
  title: string;
  description: string;
  steps: string[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  relatedContent?: string;
}

interface ModuleTopicScreenProps {
  moduleId?: string;
  lessonId?: string;
  onBack?: () => void;
  onLessonComplete?: (lessonId: string, score?: number) => void;
}

const aiResponses = {
  greetings: [
    "Hi! I'm your AI Learning Mentor. I'm here to help you understand any concept or answer questions about the lesson. What would you like to explore?",
    "Hello! Ready to dive deeper into today's lesson? Ask me anything about the concepts we're covering!",
    "Welcome! I'm here to provide personalized guidance and answer your questions. How can I help you learn better?",
  ],
  encouragement: [
    "Great question! That shows you're really thinking about the material.",
    "Excellent! You're asking the right questions to deepen your understanding.",
    "I love your curiosity! Let me help clarify that for you.",
  ],
  explanations: {
    'ai': "AI (Artificial Intelligence) is technology that enables machines to simulate human intelligence, including learning, reasoning, and problem-solving. In business contexts, AI can automate processes, provide insights from data, and enhance decision-making.",
    'blockchain': "Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, linked and secured using cryptography. It's revolutionary for creating trust without intermediaries.",
    'product': "Product management involves guiding the success of a product and leading the cross-functional team responsible for improving it. It's about understanding user needs and translating them into features.",
    'mvp': "MVP (Minimum Viable Product) is a development technique where you build a new product with sufficient features to satisfy early adopters. The goal is to learn about customers with the least effort.",
  }
};

// Sample lesson data
const sampleLessons: { [key: string]: Lesson } = {
  'ai-fundamentals-1': {
    id: 'ai-fundamentals-1',
    title: 'AI Business Applications',
    type: 'video',
    duration: '20 min',
    xpReward: 35,
    isCompleted: false,
    content: {
      description: 'Explore how artificial intelligence is transforming modern businesses across industries.',
      keyPoints: [
        'Customer service automation with chatbots',
        'Predictive analytics for business intelligence',
        'Personalization engines for user experience',
        'Process automation and optimization',
        'Data-driven decision making systems',
      ],
      practiceChallenge: 'Identify 3 AI applications that could benefit your startup',
    },
    questions: [
      {
        id: 'q1',
        question: 'What is the primary benefit of AI in customer service?',
        type: 'multiple-choice',
        options: [
          'Reduced operational costs only',
          '24/7 availability and instant responses',
          'Complete replacement of human agents',
          'Higher complexity in service delivery',
        ],
        correctAnswer: 1,
        explanation: 'AI enables 24/7 customer support with instant responses, improving user experience while reducing wait times.',
        xpReward: 10,
      },
      {
        id: 'q2',
        question: 'AI can completely replace human decision-making in all business contexts.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'AI augments human decision-making but cannot replace human judgment, creativity, and ethical considerations entirely.',
        xpReward: 10,
      },
      {
        id: 'q3',
        question: 'Your startup wants to implement AI for the first time. What should be your priority?',
        type: 'scenario',
        options: [
          'Implement the most advanced AI system available',
          'Identify a specific problem AI can solve effectively',
          'Replace all manual processes immediately',
          'Hire a large AI development team first',
        ],
        correctAnswer: 1,
        explanation: 'Start by identifying specific problems where AI can provide clear value, then gradually expand implementation.',
        xpReward: 15,
      },
    ],
    interactiveElements: [
      {
        id: 'sim1',
        type: 'simulation',
        title: 'AI Implementation Simulator',
        description: 'Practice implementing AI solutions for different business scenarios',
        steps: [
          'Analyze the business problem',
          'Identify data requirements',
          'Choose appropriate AI approach',
          'Plan implementation timeline',
          'Define success metrics',
        ],
      },
    ],
  },
};

const ModuleTopicScreen: React.FC<ModuleTopicScreenProps> = ({
  moduleId = 'ai-fundamentals',
  lessonId = 'ai-fundamentals-1',
  onBack,
  onLessonComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<'content' | 'quiz' | 'interactive'>('content');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [animatedValues] = useState({
    fadeIn: new Animated.Value(0),
    slideUp: new Animated.Value(50),
    chatSlide: new Animated.Value(height),
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const chatScrollRef = useRef<ScrollView>(null);

  const lesson = sampleLessons[lessonId];

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

    // Initialize AI mentor
    setChatMessages([{
      id: '1',
      type: 'ai',
      message: aiResponses.greetings[0],
      timestamp: new Date(),
    }]);
  }, []);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNextQuestion = () => {
    if (lesson?.questions && currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let score = 0;
    let totalXP = 0;
    
    lesson?.questions?.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        score++;
        totalXP += question.xpReward;
      }
    });

    setQuizScore(score);
    onLessonComplete?.(lesson.id, score);
    
    Alert.alert(
      'Quiz Complete!',
      `You scored ${score}/${lesson?.questions?.length} and earned ${totalXP} XP!`,
      [{ text: 'Continue', onPress: () => setCurrentStep('interactive') }]
    );
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatInput);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse,
        timestamp: new Date(),
        relatedContent: lesson.title,
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);

    setChatInput('');
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('ai') || input.includes('artificial intelligence')) {
      return aiResponses.explanations.ai + "\n\nWould you like me to explain any specific AI application or concept in more detail?";
    }
    
    if (input.includes('blockchain')) {
      return aiResponses.explanations.blockchain + "\n\nWhat aspect of blockchain would you like to explore further?";
    }
    
    if (input.includes('product') || input.includes('mvp')) {
      return aiResponses.explanations.product + "\n\nDo you have questions about specific product management techniques?";
    }
    
    if (input.includes('how') || input.includes('what') || input.includes('why')) {
      return `${aiResponses.encouragement[Math.floor(Math.random() * aiResponses.encouragement.length)]}\n\nBased on the current lesson about "${lesson.title}", here's what I can help you understand better:\n\n• Key concepts and applications\n• Real-world examples\n• Implementation strategies\n• Best practices\n\nWhat specific aspect would you like me to explain?`;
    }
    
    return "I understand you're exploring this topic! Can you be more specific about what you'd like to learn? I can help explain concepts, provide examples, or clarify any confusion you might have about the lesson material.";
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    Animated.timing(animatedValues.chatSlide, {
      toValue: showChat ? height : height * 0.4,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const renderContentStep = () => (
    <Animated.View 
      style={[
        styles.contentSection,
        {
          opacity: animatedValues.fadeIn,
          transform: [{ translateY: animatedValues.slideUp }],
        },
      ]}
    >
      <View style={styles.contentHeader}>
        <MaterialIcons name="play-circle" size={32} color={Colors.primary[500]} />
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle}>{lesson.title}</Text>
          <View style={styles.contentMeta}>
            <Text style={styles.duration}>{lesson.duration}</Text>
            <Text style={styles.xpReward}>+{lesson.xpReward} XP</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{lesson.content.description}</Text>

      <View style={styles.keyPointsSection}>
        <Text style={styles.sectionTitle}>Key Learning Points</Text>
        {lesson.content.keyPoints.map((point: string, index: number) => (
          <View key={index} style={styles.keyPoint}>
            <MaterialIcons name="check-circle" size={16} color={Colors.success} />
            <Text style={styles.keyPointText}>{point}</Text>
          </View>
        ))}
      </View>

      <View style={styles.challengeSection}>
        <Text style={styles.sectionTitle}>Practice Challenge</Text>
        <View style={styles.challengeCard}>
          <MaterialIcons name="lightbulb" size={24} color={Colors.accent.orange} />
          <Text style={styles.challengeText}>{lesson.content.practiceChallenge}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => setCurrentStep('quiz')}
      >
        <Text style={styles.continueButtonText}>Take Quiz</Text>
        <MaterialIcons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderQuizStep = () => {
    if (!lesson.questions) return null;
    
    const currentQuestion = lesson.questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestion.id];
    const hasAnswered = userAnswer !== undefined;

    return (
      <Animated.View 
        style={[
          styles.quizSection,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <View style={styles.quizHeader}>
          <Text style={styles.quizProgress}>
            Question {currentQuestionIndex + 1} of {lesson.questions.length}
          </Text>
          <View style={styles.quizProgressBar}>
            <View 
              style={[
                styles.quizProgressFill,
                { width: `${((currentQuestionIndex + 1) / lesson.questions.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.question}>{currentQuestion.question}</Text>
          
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                userAnswer === index && styles.selectedOption,
                showExplanation && index === currentQuestion.correctAnswer && styles.correctOption,
                showExplanation && userAnswer === index && index !== currentQuestion.correctAnswer && styles.incorrectOption,
              ]}
              onPress={() => handleAnswerSelect(currentQuestion.id, index)}
              disabled={showExplanation}
            >
              <Text style={[
                styles.optionText,
                userAnswer === index && styles.selectedOptionText,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}

          {hasAnswered && !showExplanation && (
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
                  name={userAnswer === currentQuestion.correctAnswer ? "check-circle" : "info"} 
                  size={20} 
                  color={userAnswer === currentQuestion.correctAnswer ? Colors.success : Colors.accent.orange} 
                />
                <Text style={styles.explanationTitle}>
                  {userAnswer === currentQuestion.correctAnswer ? "Correct!" : "Explanation"}
                </Text>
              </View>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              
              <TouchableOpacity 
                style={styles.nextButton}
                onPress={handleNextQuestion}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestionIndex < lesson.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Text>
                <MaterialIcons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderInteractiveStep = () => (
    <Animated.View 
      style={[
        styles.interactiveSection,
        {
          opacity: animatedValues.fadeIn,
          transform: [{ translateY: animatedValues.slideUp }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Interactive Simulation</Text>
      
      {lesson.interactiveElements?.map((element, index) => (
        <View key={element.id} style={styles.simulationCard}>
          <View style={styles.simulationHeader}>
            <MaterialIcons name="psychology" size={24} color={Colors.secondary[500]} />
            <Text style={styles.simulationTitle}>{element.title}</Text>
          </View>
          
          <Text style={styles.simulationDescription}>{element.description}</Text>
          
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsTitle}>Simulation Steps:</Text>
            {element.steps.map((step, stepIndex) => (
              <View key={stepIndex} style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.startSimButton}>
            <Text style={styles.startSimButtonText}>Start Simulation</Text>
            <MaterialIcons name="play-arrow" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.completeButton}
        onPress={() => onBack?.()}
      >
        <Text style={styles.completeButtonText}>Complete Lesson</Text>
        <MaterialIcons name="check" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[500]} />
      
      {/* Header */}
      <LinearGradient colors={[Colors.primary[500], Colors.primary[600]]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentStep === 'content' ? 'Content' : 
           currentStep === 'quiz' ? 'Quiz' : 'Interactive'}
        </Text>
        <TouchableOpacity style={styles.chatButton} onPress={toggleChat}>
          <MaterialIcons name="chat" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Progress Steps */}
      <View style={styles.stepsIndicator}>
        {['content', 'quiz', 'interactive'].map((step, index) => (
          <View key={step} style={styles.stepIndicator}>
            <View style={[
              styles.stepDot,
              currentStep === step && styles.activeStepDot,
              (currentStep === 'quiz' && step === 'content') || 
              (currentStep === 'interactive' && step !== 'interactive') ? styles.completedStepDot : {}
            ]}>
              <MaterialIcons 
                name={
                  step === 'content' ? 'play-lesson' :
                  step === 'quiz' ? 'quiz' : 'psychology'
                } 
                size={16} 
                color="white" 
              />
            </View>
            <Text style={[styles.stepLabel, currentStep === step && styles.activeStepLabel]}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'content' && renderContentStep()}
        {currentStep === 'quiz' && renderQuizStep()}
        {currentStep === 'interactive' && renderInteractiveStep()}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* AI Mentor Chat */}
      <Modal
        visible={showChat}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleChat}
      >
        <View style={styles.chatOverlay}>
          <Animated.View 
            style={[
              styles.chatContainer,
              { transform: [{ translateY: animatedValues.chatSlide }] }
            ]}
          >
            <View style={styles.chatHeader}>
              <View style={styles.mentorInfo}>
                <MaterialIcons name="smart-toy" size={24} color={Colors.primary[500]} />
                <Text style={styles.mentorName}>AI Learning Mentor</Text>
              </View>
              <TouchableOpacity onPress={toggleChat}>
                <MaterialIcons name="close" size={24} color={Colors.neutral[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView ref={chatScrollRef} style={styles.chatMessages} showsVerticalScrollIndicator={false}>
              {chatMessages.map((message) => (
                <View key={message.id} style={[
                  styles.messageContainer,
                  message.type === 'user' ? styles.userMessage : styles.aiMessage
                ]}>
                  <Text style={[
                    styles.messageText,
                    message.type === 'user' ? styles.userMessageText : styles.aiMessageText
                  ]}>
                    {message.message}
                  </Text>
                  <Text style={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInput}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Ask your AI mentor anything..."
                placeholderTextColor={Colors.neutral[400]}
                value={chatInput}
                onChangeText={setChatInput}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[styles.sendButton, !chatInput.trim() && styles.sendButtonDisabled]}
                onPress={sendChatMessage}
                disabled={!chatInput.trim()}
              >
                <MaterialIcons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + Spacing.md : 44,
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
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.tertiary,
    gap: Spacing.xl,
  },
  stepIndicator: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepDot: {
    backgroundColor: Colors.primary[500],
  },
  completedStepDot: {
    backgroundColor: Colors.success,
  },
  stepLabel: {
    fontSize: 12,
    color: Colors.neutral[400],
    fontWeight: '500',
  },
  activeStepLabel: {
    color: Colors.primary[500],
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentSection: {
    padding: Spacing.lg,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  duration: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  xpReward: {
    fontSize: 14,
    color: Colors.accent.orange,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  keyPointsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  keyPointText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  challengeSection: {
    marginBottom: Spacing.xl,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent.orange,
  },
  challengeText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  quizSection: {
    padding: Spacing.lg,
  },
  quizHeader: {
    marginBottom: Spacing.xl,
  },
  quizProgress: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  quizProgressBar: {
    height: 4,
    backgroundColor: Colors.neutral[700],
    borderRadius: 2,
    overflow: 'hidden',
  },
  quizProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 2,
  },
  questionCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
    lineHeight: 26,
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
    backgroundColor: Colors.background.dark,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[600],
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
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
  interactiveSection: {
    padding: Spacing.lg,
  },
  simulationCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  simulationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  simulationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  simulationDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  stepsContainer: {
    marginBottom: Spacing.lg,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  stepText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  startSimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary[500],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
    gap: Spacing.sm,
  },
  startSimButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  chatOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: height * 0.7,
    minHeight: height * 0.4,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[700],
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  messageContainer: {
    marginBottom: Spacing.md,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  userMessageText: {
    backgroundColor: Colors.primary[500],
    color: 'white',
  },
  aiMessageText: {
    backgroundColor: Colors.background.tertiary,
    color: Colors.text.secondary,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.text.tertiary,
    marginTop: 4,
    paddingHorizontal: Spacing.sm,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[700],
    gap: Spacing.sm,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.text.secondary,
    fontSize: 14,
    maxHeight: 80,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.neutral[600],
  },
});

export default ModuleTopicScreen;
