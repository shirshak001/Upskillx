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
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  company: string;
  companyLogo: string;
  type: 'gig' | 'internship' | 'full-time' | 'contract' | 'hackathon';
  budget: string;
  duration: string;
  deadline: Date;
  location: 'remote' | 'hybrid' | 'onsite';
  requiredSkills: string[];
  preferredSkills: string[];
  matchPercentage: number;
  applications: number;
  maxApplications: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'ai' | 'blockchain' | 'product' | 'fullstack' | 'mobile';
  tags: string[];
  postedBy: {
    name: string;
    role: string;
    company: string;
  };
  isBookmarked: boolean;
  canApply: boolean;
}

interface JobMarketplaceScreenProps {
  onBack?: () => void;
  onProjectDetails?: (projectId: string) => void;
  onApplyToProject?: (projectId: string) => void;
  onBookmarkProject?: (projectId: string) => void;
  onFilterChange?: (filters: any) => void;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Customer Analytics Dashboard',
    description: 'Build a real-time analytics dashboard using machine learning to predict customer behavior and provide actionable insights for e-commerce platform.',
    company: 'TechFlow Solutions',
    companyLogo: '🚀',
    type: 'gig',
    budget: '₹45,000 - ₹75,000',
    duration: '6-8 weeks',
    deadline: new Date('2025-09-30'),
    location: 'remote',
    requiredSkills: ['Python', 'Machine Learning', 'React', 'Data Visualization'],
    preferredSkills: ['TensorFlow', 'AWS', 'SQL'],
    matchPercentage: 94,
    applications: 12,
    maxApplications: 20,
    difficulty: 'intermediate',
    category: 'ai',
    tags: ['ML', 'Analytics', 'Dashboard', 'Real-time'],
    postedBy: {
      name: 'Rahul Sharma',
      role: 'CTO',
      company: 'TechFlow Solutions'
    },
    isBookmarked: false,
    canApply: true,
  },
  {
    id: '2',
    title: 'DeFi Lending Protocol Smart Contracts',
    description: 'Develop secure smart contracts for a decentralized lending platform with automated liquidation, interest calculation, and governance features.',
    company: 'CryptoVentures',
    companyLogo: '⛓️',
    type: 'contract',
    budget: '₹80,000 - ₹1,20,000',
    duration: '10-12 weeks',
    deadline: new Date('2025-10-15'),
    location: 'hybrid',
    requiredSkills: ['Solidity', 'Smart Contracts', 'Web3.js', 'Security Auditing'],
    preferredSkills: ['Hardhat', 'OpenZeppelin', 'DeFi Protocols'],
    matchPercentage: 87,
    applications: 8,
    maxApplications: 15,
    difficulty: 'advanced',
    category: 'blockchain',
    tags: ['DeFi', 'Smart Contracts', 'Security', 'Ethereum'],
    postedBy: {
      name: 'Priya Patel',
      role: 'Blockchain Lead',
      company: 'CryptoVentures'
    },
    isBookmarked: true,
    canApply: true,
  },
  {
    id: '3',
    title: 'Product Growth Experimentation Platform',
    description: 'Design and build A/B testing framework for mobile app with feature flagging, user segmentation, and analytics integration.',
    company: 'GrowthLabs',
    companyLogo: '📈',
    type: 'internship',
    budget: '₹25,000 - ₹35,000',
    duration: '12 weeks',
    deadline: new Date('2025-09-20'),
    location: 'onsite',
    requiredSkills: ['Product Management', 'A/B Testing', 'Data Analysis', 'User Research'],
    preferredSkills: ['Mixpanel', 'Amplitude', 'SQL', 'Figma'],
    matchPercentage: 91,
    applications: 24,
    maxApplications: 30,
    difficulty: 'intermediate',
    category: 'product',
    tags: ['Growth', 'A/B Testing', 'Analytics', 'Mobile'],
    postedBy: {
      name: 'Amit Kumar',
      role: 'Head of Product',
      company: 'GrowthLabs'
    },
    isBookmarked: false,
    canApply: true,
  },
  {
    id: '4',
    title: 'Cross-Platform Fintech App Development',
    description: 'Build a comprehensive fintech mobile app with payment integration, investment tracking, and personal finance management features.',
    company: 'FinanceFirst',
    companyLogo: '💰',
    type: 'full-time',
    budget: '₹8-15 LPA',
    duration: 'Permanent',
    deadline: new Date('2025-09-10'),
    location: 'hybrid',
    requiredSkills: ['React Native', 'Node.js', 'Payment Gateways', 'Security'],
    preferredSkills: ['TypeScript', 'GraphQL', 'AWS', 'Firebase'],
    matchPercentage: 96,
    applications: 45,
    maxApplications: 50,
    difficulty: 'intermediate',
    category: 'mobile',
    tags: ['Fintech', 'Mobile', 'Payments', 'Security'],
    postedBy: {
      name: 'Sarah Khan',
      role: 'Engineering Manager',
      company: 'FinanceFirst'
    },
    isBookmarked: true,
    canApply: true,
  },
  {
    id: '5',
    title: 'AI Hackathon: Climate Change Solutions',
    description: '48-hour hackathon to build AI-powered solutions for climate change monitoring, prediction, and mitigation strategies.',
    company: 'EcoTech Initiative',
    companyLogo: '🌱',
    type: 'hackathon',
    budget: '₹50,000 Prize Pool',
    duration: '48 hours',
    deadline: new Date('2025-09-05'),
    location: 'onsite',
    requiredSkills: ['AI/ML', 'Environmental Data', 'Team Collaboration'],
    preferredSkills: ['Computer Vision', 'IoT', 'Data Science'],
    matchPercentage: 82,
    applications: 156,
    maxApplications: 200,
    difficulty: 'intermediate',
    category: 'ai',
    tags: ['Hackathon', 'Climate', 'AI', 'Innovation'],
    postedBy: {
      name: 'Dr. Meera Singh',
      role: 'Research Director',
      company: 'EcoTech Initiative'
    },
    isBookmarked: false,
    canApply: true,
  },
];

const JobMarketplaceScreen: React.FC<JobMarketplaceScreenProps> = ({
  onBack,
  onProjectDetails,
  onApplyToProject,
  onBookmarkProject,
  onFilterChange,
}) => {
  const [projects, setProjects] = useState(sampleProjects);
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    category: 'all',
    location: 'all',
    difficulty: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  const getTypeColor = (type: Project['type']) => {
    switch (type) {
      case 'full-time': return Colors.success;
      case 'contract': return Colors.primary[500];
      case 'gig': return Colors.accent.orange;
      case 'internship': return Colors.secondary[500];
      case 'hackathon': return Colors.accent.purple;
      default: return Colors.neutral[400];
    }
  };

  const getCategoryIcon = (category: Project['category']) => {
    switch (category) {
      case 'ai': return 'psychology';
      case 'blockchain': return 'link';
      case 'product': return 'lightbulb';
      case 'fullstack': return 'code';
      case 'mobile': return 'smartphone';
      default: return 'work';
    }
  };

  const getDifficultyColor = (difficulty: Project['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return Colors.success;
      case 'intermediate': return Colors.warning;
      case 'advanced': return Colors.error;
      default: return Colors.neutral[400];
    }
  };

  const formatDeadline = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks left`;
    return deadline.toLocaleDateString();
  };

  const handleBookmark = (projectId: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, isBookmarked: !project.isBookmarked }
          : project
      )
    );
    onBookmarkProject?.(projectId);
  };

  const handleApply = (project: Project) => {
    Alert.alert(
      'Apply to Project',
      `Are you sure you want to apply to "${project.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Apply', 
          onPress: () => {
            onApplyToProject?.(project.id);
            Alert.alert('Success', 'Your application has been submitted!');
          }
        },
      ]
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedFilters.type === 'all' || project.type === selectedFilters.type;
    const matchesCategory = selectedFilters.category === 'all' || project.category === selectedFilters.category;
    const matchesLocation = selectedFilters.location === 'all' || project.location === selectedFilters.location;
    const matchesDifficulty = selectedFilters.difficulty === 'all' || project.difficulty === selectedFilters.difficulty;

    return matchesSearch && matchesType && matchesCategory && matchesLocation && matchesDifficulty;
  });

  const renderProject = (project: Project) => (
    <TouchableOpacity
      key={project.id}
      style={styles.projectCard}
      onPress={() => {
        setSelectedProject(project);
        setModalVisible(true);
      }}
    >
      <View style={styles.projectHeader}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyLogo}>{project.companyLogo}</Text>
          <View>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.companyName}>{project.company}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => handleBookmark(project.id)}
        >
          <MaterialIcons 
            name={project.isBookmarked ? "bookmark" : "bookmark-border"} 
            size={20} 
            color={project.isBookmarked ? Colors.warning : Colors.neutral[400]} 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.projectDescription} numberOfLines={3}>
        {project.description}
      </Text>

      <View style={styles.projectTags}>
        <View style={[styles.typeTag, { backgroundColor: `${getTypeColor(project.type)}20` }]}>
          <Text style={[styles.typeTagText, { color: getTypeColor(project.type) }]}>
            {project.type.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.locationTag}>
          <MaterialIcons name="location-on" size={12} color={Colors.neutral[400]} />
          <Text style={styles.locationText}>{project.location.toUpperCase()}</Text>
        </View>
        
        <View style={[styles.difficultyTag, { backgroundColor: `${getDifficultyColor(project.difficulty)}20` }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(project.difficulty) }]}>
            {project.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.projectMetrics}>
        <View style={styles.metricItem}>
          <MaterialIcons name="account-balance-wallet" size={14} color={Colors.accent.emerald} />
          <Text style={styles.metricText}>{project.budget}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <MaterialIcons name="schedule" size={14} color={Colors.accent.orange} />
          <Text style={styles.metricText}>{project.duration}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <MaterialIcons name="event" size={14} color={Colors.error} />
          <Text style={styles.metricText}>{formatDeadline(project.deadline)}</Text>
        </View>
      </View>

      <View style={styles.skillsSection}>
        <Text style={styles.skillsLabel}>Required Skills:</Text>
        <View style={styles.skillsContainer}>
          {project.requiredSkills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {project.requiredSkills.length > 3 && (
            <Text style={styles.moreSkills}>+{project.requiredSkills.length - 3}</Text>
          )}
        </View>
      </View>

      <View style={styles.projectFooter}>
        <View style={styles.matchInfo}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{project.matchPercentage}% Match</Text>
          </View>
          <Text style={styles.applicationsText}>
            {project.applications}/{project.maxApplications} applied
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.applyButton,
            !project.canApply && styles.disabledButton
          ]}
          onPress={() => handleApply(project)}
          disabled={!project.canApply}
        >
          <Text style={[
            styles.applyButtonText,
            !project.canApply && styles.disabledButtonText
          ]}>
            {project.canApply ? 'Apply Now' : 'Not Eligible'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <MaterialIcons name="close" size={24} color={Colors.text.inverse} />
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setSelectedFilters({ type: 'all', category: 'all', location: 'all', difficulty: 'all' })}>
            <Text style={styles.clearFilters}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterContent}>
          {/* Project Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Project Type</Text>
            <View style={styles.filterOptions}>
              {['all', 'gig', 'contract', 'full-time', 'internship', 'hackathon'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    selectedFilters.type === type && styles.selectedFilterOption
                  ]}
                  onPress={() => setSelectedFilters(prev => ({ ...prev, type }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedFilters.type === type && styles.selectedFilterOptionText
                  ]}>
                    {type === 'all' ? 'All Types' : type.replace('-', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Category</Text>
            <View style={styles.filterOptions}>
              {['all', 'ai', 'blockchain', 'product', 'fullstack', 'mobile'].map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    selectedFilters.category === category && styles.selectedFilterOption
                  ]}
                  onPress={() => setSelectedFilters(prev => ({ ...prev, category }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedFilters.category === category && styles.selectedFilterOptionText
                  ]}>
                    {category === 'all' ? 'All Categories' : category.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Location</Text>
            <View style={styles.filterOptions}>
              {['all', 'remote', 'hybrid', 'onsite'].map(location => (
                <TouchableOpacity
                  key={location}
                  style={[
                    styles.filterOption,
                    selectedFilters.location === location && styles.selectedFilterOption
                  ]}
                  onPress={() => setSelectedFilters(prev => ({ ...prev, location }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedFilters.location === location && styles.selectedFilterOptionText
                  ]}>
                    {location === 'all' ? 'All Locations' : location.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Difficulty</Text>
            <View style={styles.filterOptions}>
              {['all', 'beginner', 'intermediate', 'advanced'].map(difficulty => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.filterOption,
                    selectedFilters.difficulty === difficulty && styles.selectedFilterOption
                  ]}
                  onPress={() => setSelectedFilters(prev => ({ ...prev, difficulty }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedFilters.difficulty === difficulty && styles.selectedFilterOptionText
                  ]}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={styles.applyFiltersButton}
          onPress={() => {
            onFilterChange?.(selectedFilters);
            setShowFilters(false);
          }}
        >
          <Text style={styles.applyFiltersText}>Apply Filters</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
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
        <Text style={styles.headerTitle}>Job Marketplace</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <MaterialIcons name="tune" size={20} color={Colors.primary[500]} />
        </TouchableOpacity>
      </Animated.View>

      {/* Search and Stats */}
      <Animated.View 
        style={[
          styles.searchSection,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={Colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects, companies, skills..."
            placeholderTextColor={Colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredProjects.length}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredProjects.filter(p => p.matchPercentage >= 80).length}
            </Text>
            <Text style={styles.statLabel}>High Matches</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredProjects.filter(p => p.isBookmarked).length}
            </Text>
            <Text style={styles.statLabel}>Bookmarked</Text>
          </View>
        </View>
      </Animated.View>

      {/* Projects List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map(renderProject)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="work-off" size={64} color={Colors.neutral[400]} />
              <Text style={styles.emptyTitle}>No Projects Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filters to find more opportunities.
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <FilterModal />

      {/* Project Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedProject && (
          <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.text.inverse} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedProject.title}</Text>
              <TouchableOpacity onPress={() => handleBookmark(selectedProject.id)}>
                <MaterialIcons 
                  name={selectedProject.isBookmarked ? "bookmark" : "bookmark-border"} 
                  size={20} 
                  color={selectedProject.isBookmarked ? Colors.warning : Colors.neutral[400]} 
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.modalSection}>
                <View style={styles.projectInfo}>
                  <Text style={styles.modalCompany}>{selectedProject.company}</Text>
                  <Text style={styles.modalDescription}>{selectedProject.description}</Text>
                </View>

                <View style={styles.modalMetrics}>
                  <View style={styles.modalMetricCard}>
                    <Text style={styles.modalMetricValue}>{selectedProject.budget}</Text>
                    <Text style={styles.modalMetricLabel}>Budget</Text>
                  </View>
                  <View style={styles.modalMetricCard}>
                    <Text style={styles.modalMetricValue}>{selectedProject.duration}</Text>
                    <Text style={styles.modalMetricLabel}>Duration</Text>
                  </View>
                  <View style={styles.modalMetricCard}>
                    <Text style={styles.modalMetricValue}>{formatDeadline(selectedProject.deadline)}</Text>
                    <Text style={styles.modalMetricLabel}>Deadline</Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Required Skills</Text>
                <View style={styles.modalSkills}>
                  {selectedProject.requiredSkills.map((skill, index) => (
                    <View key={index} style={styles.modalSkillChip}>
                      <Text style={styles.modalSkillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {selectedProject.preferredSkills.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Preferred Skills</Text>
                  <View style={styles.modalSkills}>
                    {selectedProject.preferredSkills.map((skill, index) => (
                      <View key={index} style={[styles.modalSkillChip, styles.preferredSkillChip]}>
                        <Text style={[styles.modalSkillText, styles.preferredSkillText]}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Posted By</Text>
                <View style={styles.posterInfo}>
                  <Text style={styles.posterName}>{selectedProject.postedBy.name}</Text>
                  <Text style={styles.posterRole}>{selectedProject.postedBy.role} at {selectedProject.postedBy.company}</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.modalApplyButton,
                  !selectedProject.canApply && styles.disabledButton
                ]}
                onPress={() => {
                  setModalVisible(false);
                  handleApply(selectedProject);
                }}
                disabled={!selectedProject.canApply}
              >
                <Text style={[
                  styles.modalApplyButtonText,
                  !selectedProject.canApply && styles.disabledButtonText
                ]}>
                  {selectedProject.canApply ? 'Apply to This Project' : 'Not Eligible'}
                </Text>
                {selectedProject.canApply && (
                  <MaterialIcons name="send" size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
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
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.inverse,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  projectCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  companyLogo: {
    fontSize: 24,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  bookmarkButton: {
    padding: Spacing.xs,
  },
  projectDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  projectTags: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typeTag: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  typeTagText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 9,
    color: Colors.neutral[400],
    fontWeight: '500',
  },
  difficultyTag: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  projectMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  skillsSection: {
    marginBottom: Spacing.md,
  },
  skillsLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  skillChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  skillText: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 10,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  projectFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchInfo: {
    flex: 1,
  },
  matchBadge: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  matchText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  applicationsText: {
    fontSize: 11,
    color: Colors.text.tertiary,
  },
  applyButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  disabledButton: {
    backgroundColor: Colors.neutral[400],
  },
  disabledButtonText: {
    color: Colors.neutral[600],
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
  filterModal: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 44,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  clearFilters: {
    fontSize: 14,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  filterSection: {
    marginTop: Spacing.lg,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  selectedFilterOption: {
    backgroundColor: Colors.primary[500],
  },
  filterOptionText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  selectedFilterOptionText: {
    color: 'white',
  },
  applyFiltersButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  modalSection: {
    marginTop: Spacing.lg,
  },
  projectInfo: {
    marginBottom: Spacing.lg,
  },
  modalCompany: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[500],
    marginBottom: Spacing.sm,
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  modalMetrics: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalMetricCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  modalMetricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalMetricLabel: {
    fontSize: 10,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  modalSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  modalSkillChip: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  modalSkillText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '500',
  },
  preferredSkillChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  preferredSkillText: {
    color: Colors.text.secondary,
  },
  posterInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  posterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  posterRole: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  modalFooter: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalApplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  modalApplyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default JobMarketplaceScreen;
