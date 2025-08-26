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
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    level: number;
  };
  type: 'question' | 'tip' | 'resource' | 'discussion';
  title: string;
  content: string;
  tags: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  hasAnswered?: boolean;
  category: 'AI' | 'Blockchain' | 'Product' | 'General';
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

interface CommunityFeedProps {
  onBack?: () => void;
  currentUser?: any;
}

const samplePosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: '👩‍💻',
      role: 'Senior Engineer',
      level: 8,
    },
    type: 'question',
    title: 'Best practices for AI model deployment?',
    content: 'I\'m working on deploying our first ML model to production. What are the key considerations for monitoring and maintaining model performance in real-world scenarios?',
    tags: ['AI', 'MLOps', 'Production'],
    timestamp: new Date('2025-08-26T10:30:00'),
    likes: 12,
    comments: 8,
    isLiked: false,
    category: 'AI',
  },
  {
    id: '2',
    author: {
      name: 'Alex Kumar',
      avatar: '👨‍🚀',
      role: 'Product Manager',
      level: 7,
    },
    type: 'tip',
    title: 'Quick tip: User story prioritization framework',
    content: 'Use the MoSCoW method (Must have, Should have, Could have, Won\'t have) for sprint planning. Game changer for stakeholder alignment! 🚀',
    tags: ['Product', 'Agile', 'Framework'],
    timestamp: new Date('2025-08-26T09:15:00'),
    likes: 24,
    comments: 5,
    isLiked: true,
    category: 'Product',
  },
  {
    id: '3',
    author: {
      name: 'Maya Rodriguez',
      avatar: '👩‍🎨',
      role: 'UX Designer',
      level: 6,
    },
    type: 'resource',
    title: 'Blockchain UX patterns collection',
    content: 'Curated a collection of wallet connection flows and transaction confirmations. Perfect for anyone building Web3 interfaces.',
    tags: ['Blockchain', 'UX', 'Web3'],
    timestamp: new Date('2025-08-26T08:45:00'),
    likes: 18,
    comments: 12,
    isLiked: false,
    category: 'Blockchain',
  },
  {
    id: '4',
    author: {
      name: 'David Park',
      avatar: '👨‍💼',
      role: 'Business Analyst',
      level: 5,
    },
    type: 'discussion',
    title: 'The future of AI in customer service',
    content: 'With ChatGPT and similar models, how do you see customer service evolving? Will human agents become obsolete or more specialized?',
    tags: ['AI', 'Customer Service', 'Future'],
    timestamp: new Date('2025-08-25T16:20:00'),
    likes: 31,
    comments: 23,
    isLiked: true,
    hasAnswered: true,
    category: 'AI',
  },
];

const filterTabs = ['All', 'Questions', 'Tips', 'Resources', 'Discussions'] as const;
type FilterTab = typeof filterTabs[number];

const CommunityFeedScreen: React.FC<CommunityFeedProps> = ({
  onBack,
  currentUser,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [posts, setPosts] = useState(samplePosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPostType, setSelectedPostType] = useState<'question' | 'tip' | 'resource' | 'discussion'>('question');
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

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return 'help';
      case 'tip': return 'lightbulb';
      case 'resource': return 'link';
      case 'discussion': return 'forum';
      default: return 'chat';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return Colors.warning;
      case 'tip': return Colors.success;
      case 'resource': return Colors.primary[500];
      case 'discussion': return Colors.secondary[500];
      default: return Colors.neutral[500];
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return Colors.primary[500];
      case 'Blockchain': return Colors.secondary[500];
      case 'Product': return Colors.accent.orange;
      default: return Colors.neutral[500];
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Questions') return post.type === 'question';
    if (activeFilter === 'Tips') return post.type === 'tip';
    if (activeFilter === 'Resources') return post.type === 'resource';
    if (activeFilter === 'Discussions') return post.type === 'discussion';
    return true;
  });

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: '🚀',
        role: 'Product Manager',
        level: 5,
      },
      type: selectedPostType,
      title: newPostTitle,
      content: newPostContent,
      tags: [],
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false,
      category: 'General',
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowCreatePost(false);
  };

  const renderPost = (post: CommunityPost) => (
    <View key={post.id} style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.authorAvatar}>
            <Text style={styles.avatarText}>{post.author.avatar}</Text>
          </View>
          <View style={styles.authorDetails}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>L{post.author.level}</Text>
              </View>
            </View>
            <Text style={styles.authorRole}>{post.author.role}</Text>
          </View>
        </View>

        <View style={styles.postMeta}>
          <View style={[styles.postTypeBadge, { backgroundColor: getPostTypeColor(post.type) }]}>
            <MaterialIcons 
              name={getPostTypeIcon(post.type) as any} 
              size={12} 
              color="white" 
            />
            <Text style={styles.postTypeText}>{post.type}</Text>
          </View>
          <Text style={styles.timestamp}>
            {post.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postText}>{post.content}</Text>

        {/* Tags */}
        {post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {post.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLikePost(post.id)}
        >
          <MaterialIcons 
            name={post.isLiked ? "favorite" : "favorite-border"} 
            size={20} 
            color={post.isLiked ? Colors.error : Colors.text.tertiary} 
          />
          <Text style={[styles.actionText, post.isLiked && { color: Colors.error }]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="chat-bubble-outline" size={20} color={Colors.text.tertiary} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="share" size={20} color={Colors.text.tertiary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        {post.hasAnswered && (
          <View style={styles.answeredBadge}>
            <MaterialIcons name="check-circle" size={16} color={Colors.success} />
            <Text style={styles.answeredText}>Answered</Text>
          </View>
        )}
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
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreatePost(true)}
        >
          <MaterialIcons name="add" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View 
        style={[
          styles.filterSection,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                activeFilter === tab && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter(tab)}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === tab && styles.activeFilterTabText,
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Posts Feed */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.feedContainer,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {filteredPosts.map(renderPost)}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreatePost(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={() => setShowCreatePost(false)}>
                <MaterialIcons name="close" size={24} color={Colors.neutral[400]} />
              </TouchableOpacity>
            </View>

            {/* Post Type Selector */}
            <View style={styles.postTypeSelector}>
              {(['question', 'tip', 'resource', 'discussion'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.postTypeOption,
                    selectedPostType === type && styles.selectedPostType,
                  ]}
                  onPress={() => setSelectedPostType(type)}
                >
                  <MaterialIcons 
                    name={getPostTypeIcon(type) as any} 
                    size={16} 
                    color={selectedPostType === type ? 'white' : Colors.text.tertiary} 
                  />
                  <Text style={[
                    styles.postTypeOptionText,
                    selectedPostType === type && styles.selectedPostTypeText,
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Title Input */}
            <TextInput
              style={styles.titleInput}
              placeholder="Post title..."
              placeholderTextColor={Colors.text.tertiary}
              value={newPostTitle}
              onChangeText={setNewPostTitle}
              maxLength={100}
            />

            {/* Content Input */}
            <TextInput
              style={styles.contentInput}
              placeholder="Share your thoughts, questions, or resources..."
              placeholderTextColor={Colors.text.tertiary}
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreatePost(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.postButton,
                  (!newPostTitle.trim() || !newPostContent.trim()) && styles.disabledButton,
                ]}
                onPress={handleCreatePost}
                disabled={!newPostTitle.trim() || !newPostContent.trim()}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
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
  createButton: {
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
  filterTabs: {
    paddingHorizontal: Spacing.lg,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary[500],
  },
  filterTabText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  feedContainer: {
    paddingHorizontal: Spacing.lg,
  },
  postCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.sm,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 16,
  },
  authorDetails: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  levelBadge: {
    backgroundColor: Colors.accent.orange,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  authorRole: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  postMeta: {
    alignItems: 'flex-end',
  },
  postTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  postTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
  },
  timestamp: {
    fontSize: 10,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  postContent: {
    marginBottom: Spacing.md,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  postText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
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
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  answeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  answeredText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
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
  postTypeSelector: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  postTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
    gap: 4,
  },
  selectedPostType: {
    backgroundColor: Colors.primary[500],
  },
  postTypeOptionText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  selectedPostTypeText: {
    color: 'white',
  },
  titleInput: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentInput: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 14,
    color: Colors.text.inverse,
    minHeight: 120,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  postButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.neutral[600],
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default CommunityFeedScreen;
