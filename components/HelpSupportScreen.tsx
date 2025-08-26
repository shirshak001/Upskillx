import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'learning' | 'technical' | 'account' | 'billing';
  popularity: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  category: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface HelpSupportScreenProps {
  onBack?: () => void;
  onContactSupport?: (ticket: Partial<SupportTicket>) => void;
}

const sampleFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'To reset your password, go to Settings > Account Security > Change Password. Enter your current password and set a new one. You can also use the "Forgot Password" link on the login screen.',
    category: 'account',
    popularity: 95,
  },
  {
    id: '2',
    question: 'How do I download my course certificates?',
    answer: 'After completing a course, certificates are automatically generated. Go to Profile > Certificates tab to view and download them as PDF files.',
    category: 'learning',
    popularity: 87,
  },
  {
    id: '3',
    question: 'Can I access courses offline?',
    answer: 'Yes! Most video lessons can be downloaded for offline viewing. Look for the download icon next to each lesson. Note that interactive exercises require internet connection.',
    category: 'technical',
    popularity: 82,
  },
  {
    id: '4',
    question: 'How do I join team challenges?',
    answer: 'Team challenges are available to company accounts. Check the Challenges tab in the main menu. Your admin can invite you to participate in team-specific challenges.',
    category: 'learning',
    popularity: 78,
  },
  {
    id: '5',
    question: 'Why isn\'t my progress syncing?',
    answer: 'Progress sync requires internet connection. If you\'re experiencing issues, try: 1) Check your connection, 2) Force close and reopen the app, 3) Log out and back in.',
    category: 'technical',
    popularity: 73,
  },
  {
    id: '6',
    question: 'How do I change my notification preferences?',
    answer: 'Go to Settings > Notifications to customize what notifications you receive. You can control push notifications, email updates, and reminder frequency.',
    category: 'general',
    popularity: 68,
  },
  {
    id: '7',
    question: 'What are SkillCoins and how do I earn them?',
    answer: 'SkillCoins are our gamification currency. Earn them by completing lessons, maintaining streaks, participating in challenges, and helping community members.',
    category: 'learning',
    popularity: 65,
  },
  {
    id: '8',
    question: 'How do I update my billing information?',
    answer: 'For company accounts, billing is managed by your organization. For individual accounts, go to Settings > Account Security > Billing Information.',
    category: 'billing',
    popularity: 42,
  },
];

const sampleTickets: SupportTicket[] = [
  {
    id: 'TK-2025-001',
    subject: 'Certificate download not working',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date('2025-08-25T10:30:00'),
    category: 'Technical',
  },
  {
    id: 'TK-2025-002',
    subject: 'Question about AI course content',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date('2025-08-20T14:15:00'),
    category: 'Learning',
  },
];

const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({
  onBack,
  onContactSupport,
}) => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'contact' | 'chat'>('faqs');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [animatedValues] = useState({
    fadeIn: new Animated.Value(0),
    slideUp: new Animated.Value(50),
  });

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium' as const,
    description: '',
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

    // Initialize chatbot
    setChatMessages([
      {
        id: '1',
        text: 'Hi! I\'m your SkillBoost AI assistant. How can I help you today?',
        isUser: false,
        timestamp: new Date(),
        suggestions: ['How to earn badges?', 'Technical issues', 'Account questions', 'Course recommendations'],
      },
    ]);
  }, []);

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'general', name: 'General', icon: 'help' },
    { id: 'learning', name: 'Learning', icon: 'school' },
    { id: 'technical', name: 'Technical', icon: 'settings' },
    { id: 'account', name: 'Account', icon: 'person' },
    { id: 'billing', name: 'Billing', icon: 'receipt' },
  ];

  const priorityColors = {
    low: Colors.success,
    medium: Colors.warning,
    high: Colors.accent.orange,
    urgent: Colors.error,
  };

  const statusColors = {
    open: Colors.primary[500],
    'in-progress': Colors.warning,
    resolved: Colors.success,
    closed: Colors.neutral[400],
  };

  const filteredFAQs = sampleFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFAQPress = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleSubmitTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const ticket: Partial<SupportTicket> = {
      subject: newTicket.subject,
      priority: newTicket.priority,
      category: newTicket.category,
    };

    onContactSupport?.(ticket);
    setTicketModalVisible(false);
    setNewTicket({ subject: '', category: 'general', priority: 'medium', description: '' });
    Alert.alert('Success', 'Your support ticket has been submitted. We\'ll get back to you soon!');
  };

  const handleChatSend = (message?: string) => {
    const text = message || chatInput.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you with that! Let me find the most relevant information.",
        "That's a great question! Here's what I can tell you:",
        "I understand your concern. Let me provide some assistance:",
        "Thanks for reaching out! I can help you resolve this.",
      ];

      const suggestions = [
        'Check our FAQs',
        'Contact human support',
        'View video tutorials',
        'Schedule a call',
      ];

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
        suggestions: Math.random() > 0.5 ? suggestions : undefined,
      };

      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'call':
        Linking.openURL('tel:+1-800-SKILLBOOST');
        break;
      case 'email':
        Linking.openURL('mailto:support@skillboost.com');
        break;
      case 'community':
        // Navigate to community forum
        break;
      case 'tutorials':
        // Navigate to video tutorials
        break;
    }
  };

  const renderFAQsTab = () => (
    <View style={styles.tabContent}>
      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={Colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs..."
            placeholderTextColor={Colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <MaterialIcons 
              name={category.icon as any} 
              size={16} 
              color={selectedCategory === category.id ? 'white' : Colors.neutral[400]} 
            />
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.activeCategoryChipText,
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAQs List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredFAQs.map(faq => (
          <TouchableOpacity
            key={faq.id}
            style={styles.faqItem}
            onPress={() => handleFAQPress(faq.id)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <MaterialIcons 
                name={expandedFAQ === faq.id ? "expand-less" : "expand-more"} 
                size={24} 
                color={Colors.neutral[400]} 
              />
            </View>
            
            {expandedFAQ === faq.id && (
              <Animated.View style={styles.faqAnswer}>
                <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                <View style={styles.faqMeta}>
                  <View style={styles.faqCategory}>
                    <Text style={styles.faqCategoryText}>
                      {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.faqActions}>
                    <TouchableOpacity style={styles.faqActionButton}>
                      <MaterialIcons name="thumb-up" size={16} color={Colors.neutral[400]} />
                      <Text style={styles.faqActionText}>Helpful</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.faqActionButton}>
                      <MaterialIcons name="share" size={16} color={Colors.neutral[400]} />
                      <Text style={styles.faqActionText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            )}
          </TouchableOpacity>
        ))}

        {filteredFAQs.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="help-outline" size={64} color={Colors.neutral[400]} />
            <Text style={styles.emptyTitle}>No FAQs Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or browse different categories.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderContactTab = () => (
    <View style={styles.tabContent}>
      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => handleQuickAction('call')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.success}20` }]}>
              <MaterialIcons name="phone" size={24} color={Colors.success} />
            </View>
            <Text style={styles.quickActionTitle}>Call Support</Text>
            <Text style={styles.quickActionSubtitle}>+1-800-SKILLBOOST</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => handleQuickAction('email')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.primary[500]}20` }]}>
              <MaterialIcons name="email" size={24} color={Colors.primary[500]} />
            </View>
            <Text style={styles.quickActionTitle}>Email Us</Text>
            <Text style={styles.quickActionSubtitle}>support@skillboost.com</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => handleQuickAction('community')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.accent.purple}20` }]}>
              <MaterialIcons name="forum" size={24} color={Colors.accent.purple} />
            </View>
            <Text style={styles.quickActionTitle}>Community</Text>
            <Text style={styles.quickActionSubtitle}>Ask the community</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => handleQuickAction('tutorials')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.accent.orange}20` }]}>
              <MaterialIcons name="play-circle" size={24} color={Colors.accent.orange} />
            </View>
            <Text style={styles.quickActionTitle}>Video Help</Text>
            <Text style={styles.quickActionSubtitle}>Watch tutorials</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Ticket */}
      <View style={styles.submitTicketContainer}>
        <Text style={styles.sectionTitle}>Create Support Ticket</Text>
        <TouchableOpacity 
          style={styles.submitTicketButton}
          onPress={() => setTicketModalVisible(true)}
        >
          <MaterialIcons name="add-circle" size={24} color={Colors.primary[500]} />
          <Text style={styles.submitTicketText}>Submit New Ticket</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Tickets */}
      {sampleTickets.length > 0 && (
        <View style={styles.recentTicketsContainer}>
          <Text style={styles.sectionTitle}>Recent Tickets</Text>
          {sampleTickets.map(ticket => (
            <View key={ticket.id} style={styles.ticketItem}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketId}>{ticket.id}</Text>
                <View style={[
                  styles.ticketStatus,
                  { backgroundColor: statusColors[ticket.status] }
                ]}>
                  <Text style={styles.ticketStatusText}>
                    {ticket.status.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.ticketSubject}>{ticket.subject}</Text>
              <View style={styles.ticketMeta}>
                <Text style={styles.ticketDate}>
                  {ticket.createdAt.toLocaleDateString()}
                </Text>
                <View style={[
                  styles.ticketPriority,
                  { backgroundColor: `${priorityColors[ticket.priority]}20` }
                ]}>
                  <Text style={[
                    styles.ticketPriorityText,
                    { color: priorityColors[ticket.priority] }
                  ]}>
                    {ticket.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderChatTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.chatContainer}>
        <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
          {chatMessages.map(message => (
            <View
              key={message.id}
              style={[
                styles.chatMessage,
                message.isUser ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={[
                styles.chatMessageText,
                message.isUser ? styles.userMessageText : styles.botMessageText,
              ]}>
                {message.text}
              </Text>
              
              {message.suggestions && (
                <View style={styles.chatSuggestions}>
                  {message.suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.chatSuggestionButton}
                      onPress={() => handleChatSend(suggestion)}
                    >
                      <Text style={styles.chatSuggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Type your message..."
            placeholderTextColor={Colors.neutral[400]}
            value={chatInput}
            onChangeText={setChatInput}
            multiline
          />
          <TouchableOpacity 
            style={styles.chatSendButton}
            onPress={() => handleChatSend()}
          >
            <MaterialIcons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
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
        {[
          { key: 'faqs', title: 'FAQs', icon: 'help' },
          { key: 'contact', title: 'Contact', icon: 'support-agent' },
          { key: 'chat', title: 'AI Chat', icon: 'chat' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <MaterialIcons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? Colors.primary[500] : Colors.neutral[400]} 
            />
            <Text style={[
              styles.tabButtonText,
              activeTab === tab.key && styles.activeTabButtonText,
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Tab Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        {activeTab === 'faqs' && renderFAQsTab()}
        {activeTab === 'contact' && renderContactTab()}
        {activeTab === 'chat' && renderChatTab()}
      </Animated.View>

      {/* Support Ticket Modal */}
      <Modal
        visible={ticketModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setTicketModalVisible(false)}
      >
        <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
              <MaterialIcons name="close" size={24} color={Colors.text.inverse} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Support Ticket</Text>
            <TouchableOpacity onPress={handleSubmitTicket}>
              <Text style={styles.modalSubmitButton}>Submit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Subject *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Brief description of your issue"
                placeholderTextColor={Colors.neutral[400]}
                value={newTicket.subject}
                onChangeText={(text) => setNewTicket(prev => ({ ...prev, subject: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['general', 'technical', 'learning', 'account', 'billing'].map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newTicket.category === category && styles.selectedCategoryOption,
                    ]}
                    onPress={() => setNewTicket(prev => ({ ...prev, category }))}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      newTicket.category === category && styles.selectedCategoryOptionText,
                    ]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Priority</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['low', 'medium', 'high', 'urgent'].map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      newTicket.priority === priority && styles.selectedPriorityOption,
                      { borderColor: priorityColors[priority as keyof typeof priorityColors] },
                    ]}
                    onPress={() => setNewTicket(prev => ({ ...prev, priority: priority as any }))}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      newTicket.priority === priority && { color: priorityColors[priority as keyof typeof priorityColors] },
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Please provide detailed information about your issue..."
                placeholderTextColor={Colors.neutral[400]}
                value={newTicket.description}
                onChangeText={(text) => setNewTicket(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </LinearGradient>
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
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 4,
    gap: Spacing.sm,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral[400],
  },
  activeTabButtonText: {
    color: Colors.primary[500],
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.inverse,
  },
  categoriesContainer: {
    marginBottom: Spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: Spacing.sm,
    gap: Spacing.xs,
  },
  activeCategoryChip: {
    backgroundColor: Colors.primary[500],
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral[400],
  },
  activeCategoryChipText: {
    color: 'white',
  },
  faqItem: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginRight: Spacing.sm,
  },
  faqAnswer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  faqAnswerText: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  faqMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  faqCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  faqActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  faqActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  faqActionText: {
    fontSize: 11,
    color: Colors.neutral[400],
  },
  quickActionsContainer: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickActionItem: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  submitTicketContainer: {
    marginBottom: Spacing.xl,
  },
  submitTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary[500],
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  submitTicketText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  recentTicketsContainer: {
    marginBottom: Spacing.xl,
  },
  ticketItem: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  ticketStatus: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  ticketStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  ticketSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  ticketPriority: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  ticketPriorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  chatMessages: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  chatMessage: {
    marginBottom: Spacing.lg,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  chatMessageText: {
    fontSize: 14,
    lineHeight: 20,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userMessageText: {
    backgroundColor: Colors.primary[500],
    color: 'white',
  },
  botMessageText: {
    backgroundColor: Colors.background.tertiary,
    color: Colors.text.inverse,
  },
  chatSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  chatSuggestionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chatSuggestionText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: Colors.text.inverse,
    maxHeight: 100,
  },
  chatSendButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalSubmitButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  formGroup: {
    marginBottom: Spacing.xl,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  formInput: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 14,
    color: Colors.text.inverse,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textArea: {
    height: 120,
  },
  categoryOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  selectedCategoryOption: {
    backgroundColor: Colors.primary[500],
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  selectedCategoryOptionText: {
    color: 'white',
  },
  priorityOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
  },
  selectedPriorityOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  priorityOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
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
    paddingHorizontal: Spacing.xl,
  },
});

export default HelpSupportScreen;
