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

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  expertise: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: 'Available' | 'Busy' | 'Offline';
  bio: string;
  languages: string[];
  responseTime: string;
  sessionCount: number;
  specializations: string[];
}

interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  date: Date;
  duration: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  topic: string;
  type: 'Video Call' | 'Chat' | 'Screen Share';
  notes?: string;
}

interface MentorshipProps {
  onBack?: () => void;
  currentUser?: any;
  isPremium?: boolean;
}

const sampleMentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    avatar: '👩‍💻',
    title: 'Senior AI Research Scientist',
    company: 'Google DeepMind',
    expertise: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision'],
    experience: 8,
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 150,
    availability: 'Available',
    bio: 'Former Stanford professor with 8+ years in AI research. Published 50+ papers in top-tier conferences. Specialized in helping engineers transition into AI roles.',
    languages: ['English', 'Mandarin'],
    responseTime: '< 2 hours',
    sessionCount: 340,
    specializations: ['Career Transition', 'Technical Interviews', 'Research Methods'],
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    avatar: '👨‍💼',
    title: 'Blockchain Architecture Lead',
    company: 'Coinbase',
    expertise: ['Blockchain', 'DeFi', 'Smart Contracts', 'Web3'],
    experience: 6,
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 120,
    availability: 'Available',
    bio: 'Built multiple DeFi protocols from scratch. Expert in Solidity, Ethereum, and Layer 2 solutions. Helps developers understand blockchain fundamentals.',
    languages: ['English', 'Spanish'],
    responseTime: '< 4 hours',
    sessionCount: 178,
    specializations: ['Smart Contract Development', 'DeFi Architecture', 'Security Auditing'],
  },
  {
    id: '3',
    name: 'Emily Park',
    avatar: '👩‍🎨',
    title: 'VP of Product',
    company: 'Stripe',
    expertise: ['Product Management', 'Strategy', 'User Research', 'Growth'],
    experience: 10,
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 180,
    availability: 'Busy',
    bio: 'Led product teams at Stripe, Uber, and Airbnb. Expert in 0-to-1 product development and scaling growth strategies. Mentored 100+ product managers.',
    languages: ['English', 'Korean'],
    responseTime: '< 1 day',
    sessionCount: 425,
    specializations: ['Product Strategy', 'Team Leadership', 'Market Analysis'],
  },
  {
    id: '4',
    name: 'Alex Thompson',
    avatar: '👨‍🚀',
    title: 'Principal Engineer',
    company: 'Netflix',
    expertise: ['System Design', 'Microservices', 'Cloud Architecture', 'DevOps'],
    experience: 12,
    rating: 4.8,
    reviewCount: 203,
    hourlyRate: 140,
    availability: 'Available',
    bio: 'Built Netflix\'s recommendation engine and scaled systems to billions of users. Expert in distributed systems and cloud architecture patterns.',
    languages: ['English'],
    responseTime: '< 3 hours',
    sessionCount: 567,
    specializations: ['System Design', 'Technical Leadership', 'Architecture Reviews'],
  },
];

const sampleSessions: Session[] = [
  {
    id: '1',
    mentorId: '1',
    mentorName: 'Dr. Sarah Chen',
    mentorAvatar: '👩‍💻',
    date: new Date('2025-08-28T15:00:00'),
    duration: 60,
    status: 'Upcoming',
    topic: 'AI Career Transition Strategy',
    type: 'Video Call',
  },
  {
    id: '2',
    mentorId: '2',
    mentorName: 'Marcus Rodriguez',
    mentorAvatar: '👨‍💼',
    date: new Date('2025-08-25T10:30:00'),
    duration: 45,
    status: 'Completed',
    topic: 'Smart Contract Best Practices',
    type: 'Screen Share',
    notes: 'Reviewed Solidity code patterns and security considerations. Discussed gas optimization techniques.',
  },
];

const tabs = ['Find Mentors', 'My Sessions', 'Messages'] as const;
type Tab = typeof tabs[number];

const MentorshipScreen: React.FC<MentorshipProps> = ({
  onBack,
  currentUser,
  isPremium = false,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('Find Mentors');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionType, setSessionType] = useState<'Video Call' | 'Chat' | 'Screen Share'>('Video Call');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mentors] = useState(sampleMentors);
  const [sessions] = useState(sampleSessions);
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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return Colors.success;
      case 'Busy': return Colors.warning;
      case 'Offline': return Colors.neutral[500];
      default: return Colors.neutral[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return Colors.primary[500];
      case 'Completed': return Colors.success;
      case 'Cancelled': return Colors.error;
      default: return Colors.neutral[500];
    }
  };

  const handleBookSession = () => {
    if (!isPremium) {
      Alert.alert(
        'Premium Feature',
        'Upgrade to Premium to book 1:1 mentorship sessions with industry experts.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => console.log('Upgrade to Premium') },
        ]
      );
      return;
    }

    if (!sessionTopic.trim()) {
      Alert.alert('Error', 'Please enter a session topic');
      return;
    }

    // Handle booking logic here
    Alert.alert('Success', 'Session booked successfully! You will receive a confirmation email.');
    setShowBookingModal(false);
    setSessionTopic('');
  };

  const renderMentor = (mentor: Mentor) => (
    <TouchableOpacity 
      key={mentor.id} 
      style={styles.mentorCard}
      onPress={() => setSelectedMentor(mentor)}
    >
      {/* Mentor Header */}
      <View style={styles.mentorHeader}>
        <View style={styles.mentorInfo}>
          <View style={styles.mentorAvatar}>
            <Text style={styles.avatarText}>{mentor.avatar}</Text>
          </View>
          <View style={styles.mentorDetails}>
            <Text style={styles.mentorName}>{mentor.name}</Text>
            <Text style={styles.mentorTitle}>{mentor.title}</Text>
            <Text style={styles.mentorCompany}>{mentor.company}</Text>
          </View>
        </View>

        <View style={styles.mentorMeta}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color={Colors.warning} />
            <Text style={styles.rating}>{mentor.rating}</Text>
            <Text style={styles.reviewCount}>({mentor.reviewCount})</Text>
          </View>
          <View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor(mentor.availability) }]}>
            <Text style={styles.availabilityText}>{mentor.availability}</Text>
          </View>
        </View>
      </View>

      {/* Expertise */}
      <View style={styles.expertiseContainer}>
        {mentor.expertise.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.expertiseTag}>
            <Text style={styles.expertiseText}>{skill}</Text>
          </View>
        ))}
        {mentor.expertise.length > 3 && (
          <Text style={styles.moreExpertise}>+{mentor.expertise.length - 3} more</Text>
        )}
      </View>

      {/* Stats */}
      <View style={styles.mentorStats}>
        <View style={styles.statItem}>
          <MaterialIcons name="work" size={16} color={Colors.text.tertiary} />
          <Text style={styles.statText}>{mentor.experience}+ years</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialIcons name="schedule" size={16} color={Colors.text.tertiary} />
          <Text style={styles.statText}>{mentor.responseTime}</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialIcons name="people" size={16} color={Colors.text.tertiary} />
          <Text style={styles.statText}>{mentor.sessionCount} sessions</Text>
        </View>
      </View>

      {/* Pricing */}
      <View style={styles.pricingContainer}>
        <Text style={styles.priceText}>${mentor.hourlyRate}/hour</Text>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => {
            setSelectedMentor(mentor);
            setShowBookingModal(true);
          }}
        >
          <Text style={styles.bookButtonText}>Book Session</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSession = (session: Session) => (
    <View key={session.id} style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <View style={styles.mentorAvatar}>
            <Text style={styles.avatarText}>{session.mentorAvatar}</Text>
          </View>
          <View style={styles.sessionDetails}>
            <Text style={styles.sessionMentor}>{session.mentorName}</Text>
            <Text style={styles.sessionTopic}>{session.topic}</Text>
            <Text style={styles.sessionDate}>
              {session.date.toLocaleDateString()} at {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        <View style={styles.sessionMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
            <Text style={styles.statusText}>{session.status}</Text>
          </View>
          <Text style={styles.sessionDuration}>{session.duration} min</Text>
        </View>
      </View>

      <View style={styles.sessionActions}>
        <View style={styles.sessionType}>
          <MaterialIcons 
            name={session.type === 'Video Call' ? 'videocam' : session.type === 'Chat' ? 'chat' : 'screen-share'} 
            size={16} 
            color={Colors.text.tertiary} 
          />
          <Text style={styles.sessionTypeText}>{session.type}</Text>
        </View>

        {session.status === 'Upcoming' && (
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Session</Text>
          </TouchableOpacity>
        )}

        {session.status === 'Completed' && session.notes && (
          <TouchableOpacity style={styles.notesButton}>
            <MaterialIcons name="note" size={16} color={Colors.primary[500]} />
            <Text style={styles.notesButtonText}>View Notes</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Find Mentors':
        return (
          <View style={styles.mentorsContainer}>
            {mentors.map(renderMentor)}
          </View>
        );
      
      case 'My Sessions':
        return (
          <View style={styles.sessionsContainer}>
            {sessions.length > 0 ? (
              sessions.map(renderSession)
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="event-available" size={64} color={Colors.text.tertiary} />
                <Text style={styles.emptyStateTitle}>No Sessions Yet</Text>
                <Text style={styles.emptyStateText}>
                  Book your first mentorship session to get personalized guidance from industry experts.
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'Messages':
        return (
          <View style={styles.messagesContainer}>
            <View style={styles.emptyState}>
              <MaterialIcons name="chat-bubble-outline" size={64} color={Colors.text.tertiary} />
              <Text style={styles.emptyStateTitle}>No Messages</Text>
              <Text style={styles.emptyStateText}>
                Messages with your mentors will appear here. Book a session to start chatting!
              </Text>
            </View>
          </View>
        );
    }
  };

  if (!isPremium && activeTab === 'Find Mentors') {
    return (
      <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary[500]} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>1:1 Mentorship</Text>
          <View style={styles.premiumBadge}>
            <MaterialIcons name="diamond" size={16} color={Colors.warning} />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        </View>

        {/* Premium Upsell */}
        <View style={styles.upsellContainer}>
          <LinearGradient
            colors={[Colors.primary[500], Colors.secondary[500]]}
            style={styles.upsellCard}
          >
            <MaterialIcons name="diamond" size={48} color="white" />
            <Text style={styles.upsellTitle}>Unlock 1:1 Mentorship</Text>
            <Text style={styles.upsellSubtitle}>
              Get personalized guidance from industry experts in AI, Blockchain, and Product Management
            </Text>
            
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <MaterialIcons name="check-circle" size={20} color="white" />
                <Text style={styles.benefitText}>Book sessions with top industry mentors</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialIcons name="check-circle" size={20} color="white" />
                <Text style={styles.benefitText}>Video calls, chat, and screen sharing</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialIcons name="check-circle" size={20} color="white" />
                <Text style={styles.benefitText}>Personalized career guidance</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialIcons name="check-circle" size={20} color="white" />
                <Text style={styles.benefitText}>Session notes and recordings</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              <MaterialIcons name="arrow-forward" size={20} color={Colors.primary[500]} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
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
        <Text style={styles.headerTitle}>1:1 Mentorship</Text>
        <View style={styles.premiumBadge}>
          <MaterialIcons name="diamond" size={16} color={Colors.warning} />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
      </Animated.View>

      {/* Tabs */}
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
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {renderTabContent()}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Session</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.neutral[400]} />
              </TouchableOpacity>
            </View>

            {selectedMentor && (
              <>
                {/* Mentor Info */}
                <View style={styles.modalMentorInfo}>
                  <View style={styles.mentorAvatar}>
                    <Text style={styles.avatarText}>{selectedMentor.avatar}</Text>
                  </View>
                  <View style={styles.mentorDetails}>
                    <Text style={styles.mentorName}>{selectedMentor.name}</Text>
                    <Text style={styles.mentorTitle}>{selectedMentor.title}</Text>
                    <Text style={styles.priceText}>${selectedMentor.hourlyRate}/hour</Text>
                  </View>
                </View>

                {/* Session Type */}
                <View style={styles.sessionTypeSelector}>
                  <Text style={styles.sectionLabel}>Session Type</Text>
                  <View style={styles.typeOptions}>
                    {(['Video Call', 'Chat', 'Screen Share'] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeOption,
                          sessionType === type && styles.selectedType,
                        ]}
                        onPress={() => setSessionType(type)}
                      >
                        <MaterialIcons 
                          name={type === 'Video Call' ? 'videocam' : type === 'Chat' ? 'chat' : 'screen-share'} 
                          size={20} 
                          color={sessionType === type ? 'white' : Colors.text.tertiary} 
                        />
                        <Text style={[
                          styles.typeOptionText,
                          sessionType === type && styles.selectedTypeText,
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Topic */}
                <View style={styles.topicSection}>
                  <Text style={styles.sectionLabel}>Session Topic</Text>
                  <TextInput
                    style={styles.topicInput}
                    placeholder="What would you like to discuss?"
                    placeholderTextColor={Colors.text.tertiary}
                    value={sessionTopic}
                    onChangeText={setSessionTopic}
                    multiline
                    maxLength={200}
                  />
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowBookingModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.confirmButton,
                      !sessionTopic.trim() && styles.disabledButton,
                    ]}
                    onPress={handleBookSession}
                    disabled={!sessionTopic.trim()}
                  >
                    <Text style={styles.confirmButtonText}>Book Session</Text>
                  </TouchableOpacity>
                </View>
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
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.warning,
  },
  tabSection: {
    paddingVertical: Spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background.tertiary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
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
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  mentorsContainer: {
    gap: Spacing.md,
  },
  mentorCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.sm,
  },
  mentorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mentorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 20,
  },
  mentorDetails: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  mentorTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  mentorCompany: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  mentorMeta: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  availabilityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  expertiseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  expertiseTag: {
    backgroundColor: 'rgba(139, 69, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  expertiseText: {
    fontSize: 10,
    color: Colors.accent.purple,
    fontWeight: '500',
  },
  moreExpertise: {
    fontSize: 10,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  mentorStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  bookButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  sessionsContainer: {
    gap: Spacing.md,
  },
  sessionCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionMentor: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  sessionTopic: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  sessionDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  sessionMeta: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  sessionDuration: {
    fontSize: 10,
    color: Colors.text.tertiary,
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sessionType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionTypeText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notesButtonText: {
    fontSize: 12,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'] * 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 250,
  },
  upsellContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  upsellCard: {
    padding: Spacing['2xl'],
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  upsellTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  upsellSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  benefitsList: {
    alignSelf: 'stretch',
    marginBottom: Spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[500],
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
    padding: Spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  modalMentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  sessionTypeSelector: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  typeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedType: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  typeOptionText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  selectedTypeText: {
    color: 'white',
  },
  topicSection: {
    marginBottom: Spacing.lg,
  },
  topicInput: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 14,
    color: Colors.text.inverse,
    minHeight: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutral[700],
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.neutral[600],
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default MentorshipScreen;
