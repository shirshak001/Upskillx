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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface ProjectSubmission {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    level: number;
  };
  category: 'AI' | 'Blockchain' | 'Product' | 'Design' | 'Engineering';
  tags: string[];
  thumbnail: string;
  upvotes: number;
  comments: number;
  views: number;
  isUpvoted: boolean;
  timestamp: Date;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  resources: {
    github?: string;
    demo?: string;
    docs?: string;
  };
  skills: string[];
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

interface PeerProjectsProps {
  onBack?: () => void;
  currentUser?: any;
}

const sampleProjects: ProjectSubmission[] = [
  {
    id: '1',
    title: 'AI-Powered Customer Support Chatbot',
    description: 'Built a conversational AI system using OpenAI GPT-4 that handles 80% of customer queries automatically. Integrated with existing CRM and includes sentiment analysis.',
    author: {
      name: 'Emily Zhang',
      avatar: '👩‍💻',
      role: 'AI Engineer',
      level: 9,
    },
    category: 'AI',
    tags: ['OpenAI', 'Python', 'Flask', 'NLP'],
    thumbnail: '🤖',
    upvotes: 47,
    comments: 12,
    views: 234,
    isUpvoted: false,
    timestamp: new Date('2025-08-25T14:30:00'),
    difficulty: 'Advanced',
    resources: {
      github: 'https://github.com/emily/ai-chatbot',
      demo: 'https://chatbot-demo.com',
      docs: 'https://docs.chatbot.com',
    },
    skills: ['Machine Learning', 'Python', 'API Integration', 'Natural Language Processing'],
  },
  {
    id: '2',
    title: 'DeFi Yield Farming Dashboard',
    description: 'React-based dashboard for tracking DeFi positions across multiple protocols. Real-time APY calculations, impermanent loss tracking, and portfolio optimization suggestions.',
    author: {
      name: 'Marcus Chen',
      avatar: '👨‍💼',
      role: 'Blockchain Developer',
      level: 8,
    },
    category: 'Blockchain',
    tags: ['React', 'Web3', 'DeFi', 'Ethereum'],
    thumbnail: '📊',
    upvotes: 38,
    comments: 18,
    views: 189,
    isUpvoted: true,
    timestamp: new Date('2025-08-24T16:45:00'),
    difficulty: 'Intermediate',
    resources: {
      github: 'https://github.com/marcus/defi-dashboard',
      demo: 'https://defi-tracker.app',
    },
    skills: ['Blockchain', 'React', 'Web3.js', 'Smart Contracts'],
  },
  {
    id: '3',
    title: 'Product Analytics Automation Tool',
    description: 'Python script that automatically generates weekly product reports from Google Analytics, Mixpanel, and Amplitude. Includes cohort analysis and user journey mapping.',
    author: {
      name: 'Sarah Rodriguez',
      avatar: '👩‍🎨',
      role: 'Product Manager',
      level: 7,
    },
    category: 'Product',
    tags: ['Python', 'Analytics', 'Automation', 'Data Viz'],
    thumbnail: '📈',
    upvotes: 29,
    comments: 8,
    views: 156,
    isUpvoted: false,
    timestamp: new Date('2025-08-23T10:20:00'),
    difficulty: 'Intermediate',
    resources: {
      github: 'https://github.com/sarah/analytics-tool',
      docs: 'https://analytics-docs.com',
    },
    skills: ['Data Analysis', 'Python', 'Product Analytics', 'Automation'],
  },
  {
    id: '4',
    title: 'Mobile App Design System',
    description: 'Complete design system for fintech mobile apps. Includes 200+ components, dark/light themes, accessibility guidelines, and Figma component library.',
    author: {
      name: 'Alex Kim',
      avatar: '🎨',
      role: 'UX Designer',
      level: 6,
    },
    category: 'Design',
    tags: ['Figma', 'Design System', 'Mobile', 'Accessibility'],
    thumbnail: '🎨',
    upvotes: 52,
    comments: 23,
    views: 298,
    isUpvoted: true,
    timestamp: new Date('2025-08-22T09:15:00'),
    difficulty: 'Beginner',
    resources: {
      demo: 'https://figma.com/design-system',
      docs: 'https://design-docs.com',
    },
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'Mobile Design'],
  },
];

const categories = ['All', 'AI', 'Blockchain', 'Product', 'Design', 'Engineering'] as const;
type CategoryFilter = typeof categories[number];

const sortOptions = ['Most Recent', 'Most Upvoted', 'Most Viewed', 'Most Commented'] as const;
type SortOption = typeof sortOptions[number];

const PeerProjectsScreen: React.FC<PeerProjectsProps> = ({
  onBack,
  currentUser,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [activeSortOption, setActiveSortOption] = useState<SortOption>('Most Recent');
  const [projects, setProjects] = useState(sampleProjects);
  const [showProjectDetails, setShowProjectDetails] = useState<string | null>(null);
  const [showSubmitProject, setShowSubmitProject] = useState(false);
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return Colors.primary[500];
      case 'Blockchain': return Colors.secondary[500];
      case 'Product': return Colors.accent.orange;
      case 'Design': return Colors.accent.purple;
      case 'Engineering': return Colors.success;
      default: return Colors.neutral[500];
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

  const handleUpvoteProject = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            isUpvoted: !project.isUpvoted,
            upvotes: project.isUpvoted ? project.upvotes - 1 : project.upvotes + 1
          }
        : project
    ));
  };

  const filteredAndSortedProjects = projects
    .filter(project => activeCategory === 'All' || project.category === activeCategory)
    .sort((a, b) => {
      switch (activeSortOption) {
        case 'Most Recent':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'Most Upvoted':
          return b.upvotes - a.upvotes;
        case 'Most Viewed':
          return b.views - a.views;
        case 'Most Commented':
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

  const selectedProject = projects.find(p => p.id === showProjectDetails);

  const renderProject = (project: ProjectSubmission) => (
    <TouchableOpacity 
      key={project.id} 
      style={styles.projectCard}
      onPress={() => setShowProjectDetails(project.id)}
    >
      {/* Project Thumbnail & Category */}
      <View style={styles.projectHeader}>
        <View style={styles.projectThumbnail}>
          <Text style={styles.thumbnailText}>{project.thumbnail}</Text>
        </View>
        <View style={styles.projectMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(project.category) }]}>
            <Text style={styles.categoryText}>{project.category}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(project.difficulty) }]}>
            <Text style={styles.difficultyText}>{project.difficulty}</Text>
          </View>
        </View>
      </View>

      {/* Project Content */}
      <View style={styles.projectContent}>
        <Text style={styles.projectTitle}>{project.title}</Text>
        <Text style={styles.projectDescription} numberOfLines={3}>
          {project.description}
        </Text>

        {/* Skills */}
        <View style={styles.skillsContainer}>
          {project.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {project.skills.length > 3 && (
            <Text style={styles.moreSkills}>+{project.skills.length - 3} more</Text>
          )}
        </View>
      </View>

      {/* Author Info */}
      <View style={styles.authorSection}>
        <View style={styles.authorInfo}>
          <View style={styles.authorAvatar}>
            <Text style={styles.avatarText}>{project.author.avatar}</Text>
          </View>
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{project.author.name}</Text>
            <Text style={styles.authorRole}>{project.author.role} • L{project.author.level}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>
          {project.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
      </View>

      {/* Project Stats */}
      <View style={styles.projectStats}>
        <TouchableOpacity 
          style={styles.statButton}
          onPress={() => handleUpvoteProject(project.id)}
        >
          <MaterialIcons 
            name={project.isUpvoted ? "keyboard-arrow-up" : "keyboard-arrow-up"} 
            size={20} 
            color={project.isUpvoted ? Colors.primary[500] : Colors.text.tertiary} 
          />
          <Text style={[styles.statText, project.isUpvoted && { color: Colors.primary[500] }]}>
            {project.upvotes}
          </Text>
        </TouchableOpacity>

        <View style={styles.statItem}>
          <MaterialIcons name="chat-bubble-outline" size={18} color={Colors.text.tertiary} />
          <Text style={styles.statText}>{project.comments}</Text>
        </View>

        <View style={styles.statItem}>
          <MaterialIcons name="visibility" size={18} color={Colors.text.tertiary} />
          <Text style={styles.statText}>{project.views}</Text>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <MaterialIcons name="share" size={18} color={Colors.text.tertiary} />
        </TouchableOpacity>
      </View>
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
        <Text style={styles.headerTitle}>Peer Projects</Text>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => setShowSubmitProject(true)}
        >
          <MaterialIcons name="add" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </Animated.View>

      {/* Category Filter */}
      <Animated.View 
        style={[
          styles.filterSection,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                activeCategory === category && styles.activeCategoryTab,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[
                styles.categoryTabText,
                activeCategory === category && styles.activeCategoryTabText,
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Sort Options */}
      <Animated.View 
        style={[
          styles.sortSection,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortTabs}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.sortTab,
                activeSortOption === option && styles.activeSortTab,
              ]}
              onPress={() => setActiveSortOption(option)}
            >
              <Text style={[
                styles.sortTabText,
                activeSortOption === option && styles.activeSortTabText,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Projects Feed */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.projectsContainer,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {filteredAndSortedProjects.map(renderProject)}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Project Details Modal */}
      <Modal
        visible={!!showProjectDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProjectDetails(null)}
      >
        {selectedProject && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedProject.title}</Text>
                <TouchableOpacity onPress={() => setShowProjectDetails(null)}>
                  <MaterialIcons name="close" size={24} color={Colors.neutral[400]} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Project Info */}
                <Text style={styles.modalDescription}>{selectedProject.description}</Text>

                {/* Author */}
                <View style={styles.modalAuthor}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.avatarText}>{selectedProject.author.avatar}</Text>
                  </View>
                  <View style={styles.authorDetails}>
                    <Text style={styles.authorName}>{selectedProject.author.name}</Text>
                    <Text style={styles.authorRole}>{selectedProject.author.role} • Level {selectedProject.author.level}</Text>
                  </View>
                </View>

                {/* Skills */}
                <View style={styles.modalSkills}>
                  <Text style={styles.sectionTitle}>Skills Demonstrated</Text>
                  <View style={styles.skillsGrid}>
                    {selectedProject.skills.map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Resources */}
                <View style={styles.modalResources}>
                  <Text style={styles.sectionTitle}>Project Resources</Text>
                  {selectedProject.resources.github && (
                    <TouchableOpacity style={styles.resourceLink}>
                      <MaterialIcons name="code" size={20} color={Colors.primary[500]} />
                      <Text style={styles.resourceText}>View on GitHub</Text>
                    </TouchableOpacity>
                  )}
                  {selectedProject.resources.demo && (
                    <TouchableOpacity style={styles.resourceLink}>
                      <MaterialIcons name="launch" size={20} color={Colors.primary[500]} />
                      <Text style={styles.resourceText}>Live Demo</Text>
                    </TouchableOpacity>
                  )}
                  {selectedProject.resources.docs && (
                    <TouchableOpacity style={styles.resourceLink}>
                      <MaterialIcons name="description" size={20} color={Colors.primary[500]} />
                      <Text style={styles.resourceText}>Documentation</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Tags */}
                <View style={styles.modalTags}>
                  <Text style={styles.sectionTitle}>Technologies Used</Text>
                  <View style={styles.tagsGrid}>
                    {selectedProject.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.upvoteButton]}
                  onPress={() => handleUpvoteProject(selectedProject.id)}
                >
                  <MaterialIcons 
                    name="keyboard-arrow-up" 
                    size={20} 
                    color={selectedProject.isUpvoted ? 'white' : Colors.primary[500]} 
                  />
                  <Text style={[
                    styles.actionButtonText,
                    selectedProject.isUpvoted && { color: 'white' }
                  ]}>
                    {selectedProject.isUpvoted ? 'Upvoted' : 'Upvote'} ({selectedProject.upvotes})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.actionButton, styles.commentButton]}>
                  <MaterialIcons name="chat-bubble-outline" size={20} color={Colors.secondary[500]} />
                  <Text style={styles.actionButtonText}>Comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    flex: 1,
    textAlign: 'center',
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSection: {
    paddingVertical: Spacing.md,
  },
  categoryTabs: {
    paddingHorizontal: Spacing.lg,
  },
  categoryTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
  },
  activeCategoryTab: {
    backgroundColor: Colors.primary[500],
  },
  categoryTabText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activeCategoryTabText: {
    color: 'white',
    fontWeight: '600',
  },
  sortSection: {
    paddingBottom: Spacing.md,
  },
  sortTabs: {
    paddingHorizontal: Spacing.lg,
  },
  sortTab: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeSortTab: {
    backgroundColor: 'rgba(139, 69, 255, 0.3)',
  },
  sortTabText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activeSortTabText: {
    color: Colors.accent.purple,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  projectsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  projectCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.sm,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  projectThumbnail: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailText: {
    fontSize: 24,
  },
  projectMeta: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  projectContent: {
    marginBottom: Spacing.md,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  projectDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: 'rgba(139, 69, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 10,
    color: Colors.accent.purple,
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 10,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  authorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    fontSize: 14,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  authorRole: {
    fontSize: 10,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.text.tertiary,
  },
  projectStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
  shareButton: {
    marginLeft: 'auto',
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
    maxHeight: '90%',
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
  modalDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  modalAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
  },
  modalSkills: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  modalResources: {
    marginBottom: Spacing.lg,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  resourceText: {
    fontSize: 14,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  modalTags: {
    marginBottom: Spacing.lg,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    borderWidth: 1,
  },
  upvoteButton: {
    borderColor: Colors.primary[500],
    backgroundColor: 'transparent',
  },
  commentButton: {
    borderColor: Colors.secondary[500],
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
  },
});

export default PeerProjectsScreen;
