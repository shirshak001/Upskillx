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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  level: number;
  totalXP: number;
  completedCourses: number;
  currentStreak: number;
  lastActive: Date;
  skillProgress: {
    AI: number;
    Blockchain: number;
    Product: number;
  };
  weeklyHours: number;
  performanceGrowth: number;
}

interface TeamMetrics {
  totalEmployees: number;
  activeUsers: number;
  avgCompletionRate: number;
  totalTrainingHours: number;
  avgPerformanceGrowth: number;
  topSkill: string;
  roiScore: number;
}

interface AdminDashboardProps {
  onBack?: () => void;
  onEmployeeDetails?: (employeeId: string) => void;
  onAnalytics?: () => void;
  onTeamChallenges?: () => void;
}

const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '👩‍💻',
    role: 'Software Engineer',
    department: 'Engineering',
    level: 8,
    totalXP: 3200,
    completedCourses: 15,
    currentStreak: 12,
    lastActive: new Date('2025-08-26T09:30:00'),
    skillProgress: { AI: 85, Blockchain: 60, Product: 45 },
    weeklyHours: 8.5,
    performanceGrowth: 23,
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    avatar: '👨‍💼',
    role: 'Product Manager',
    department: 'Product',
    level: 7,
    totalXP: 2850,
    completedCourses: 12,
    currentStreak: 8,
    lastActive: new Date('2025-08-26T08:15:00'),
    skillProgress: { AI: 70, Blockchain: 80, Product: 90 },
    weeklyHours: 6.2,
    performanceGrowth: 31,
  },
  {
    id: '3',
    name: 'Emily Park',
    avatar: '👩‍🎨',
    role: 'UX Designer',
    department: 'Design',
    level: 6,
    totalXP: 2100,
    completedCourses: 9,
    currentStreak: 5,
    lastActive: new Date('2025-08-25T16:45:00'),
    skillProgress: { AI: 55, Blockchain: 35, Product: 75 },
    weeklyHours: 5.8,
    performanceGrowth: 18,
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: '👨‍🚀',
    role: 'Data Scientist',
    department: 'Engineering',
    level: 9,
    totalXP: 3800,
    completedCourses: 18,
    currentStreak: 15,
    lastActive: new Date('2025-08-26T10:20:00'),
    skillProgress: { AI: 95, Blockchain: 70, Product: 60 },
    weeklyHours: 9.2,
    performanceGrowth: 42,
  },
];

const teamMetrics: TeamMetrics = {
  totalEmployees: 48,
  activeUsers: 42,
  avgCompletionRate: 78,
  totalTrainingHours: 324,
  avgPerformanceGrowth: 28.5,
  topSkill: 'AI',
  roiScore: 8.4,
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBack,
  onEmployeeDetails,
  onAnalytics,
  onTeamChallenges,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'top'>('all');
  const [employees] = useState(sampleEmployees);
  const [showEmployeeModal, setShowEmployeeModal] = useState<string | null>(null);
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

  const getPerformanceColor = (growth: number) => {
    if (growth >= 30) return Colors.success;
    if (growth >= 20) return Colors.warning;
    return Colors.error;
  };

  const getActivityStatus = (lastActive: Date) => {
    const now = new Date();
    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return { status: 'Online', color: Colors.success };
    if (diffHours < 24) return { status: 'Recent', color: Colors.warning };
    return { status: 'Offline', color: Colors.neutral[500] };
  };

  const filteredEmployees = employees.filter(emp => {
    switch (selectedFilter) {
      case 'active':
        return getActivityStatus(emp.lastActive).status !== 'Offline';
      case 'top':
        return emp.performanceGrowth >= 25;
      default:
        return true;
    }
  });

  const selectedEmployee = employees.find(emp => emp.id === showEmployeeModal);

  const renderMetricCard = (title: string, value: string, subtitle: string, icon: string, color: string) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <MaterialIcons name={icon as any} size={24} color={color} />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricSubtitle}>{subtitle}</Text>
    </View>
  );

  const renderEmployeeCard = (employee: Employee) => {
    const activityStatus = getActivityStatus(employee.lastActive);
    
    return (
      <TouchableOpacity 
        key={employee.id} 
        style={styles.employeeCard}
        onPress={() => setShowEmployeeModal(employee.id)}
      >
        {/* Employee Header */}
        <View style={styles.employeeHeader}>
          <View style={styles.employeeInfo}>
            <View style={styles.employeeAvatar}>
              <Text style={styles.avatarText}>{employee.avatar}</Text>
              <View style={[styles.statusDot, { backgroundColor: activityStatus.color }]} />
            </View>
            <View style={styles.employeeDetails}>
              <Text style={styles.employeeName}>{employee.name}</Text>
              <Text style={styles.employeeRole}>{employee.role}</Text>
              <Text style={styles.employeeDepartment}>{employee.department}</Text>
            </View>
          </View>
          
          <View style={styles.employeeMeta}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>L{employee.level}</Text>
            </View>
            <Text style={styles.xpText}>{employee.totalXP} XP</Text>
          </View>
        </View>

        {/* Progress Bars */}
        <View style={styles.skillsSection}>
          <Text style={styles.skillsTitle}>Skill Progress</Text>
          {Object.entries(employee.skillProgress).map(([skill, progress]) => (
            <View key={skill} style={styles.skillRow}>
              <Text style={styles.skillName}>{skill}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${progress}%`,
                      backgroundColor: skill === 'AI' ? Colors.primary[500] : 
                                    skill === 'Blockchain' ? Colors.secondary[500] : 
                                    Colors.accent.orange
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.employeeStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="school" size={16} color={Colors.text.tertiary} />
            <Text style={styles.statText}>{employee.completedCourses} courses</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="local-fire-department" size={16} color={Colors.accent.orange} />
            <Text style={styles.statText}>{employee.currentStreak} day streak</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={16} color={Colors.text.tertiary} />
            <Text style={styles.statText}>{employee.weeklyHours}h/week</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="trending-up" size={16} color={getPerformanceColor(employee.performanceGrowth)} />
            <Text style={[styles.statText, { color: getPerformanceColor(employee.performanceGrowth) }]}>
              +{employee.performanceGrowth}% growth
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.adminBadge}>
          <MaterialIcons name="admin-panel-settings" size={16} color={Colors.warning} />
          <Text style={styles.adminText}>Admin</Text>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        style={[
          styles.quickActions,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <TouchableOpacity style={styles.actionButton} onPress={onAnalytics}>
          <MaterialIcons name="analytics" size={24} color={Colors.primary[500]} />
          <Text style={styles.actionButtonText}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onTeamChallenges}>
          <MaterialIcons name="emoji-events" size={24} color={Colors.accent.orange} />
          <Text style={styles.actionButtonText}>Team Challenges</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="download" size={24} color={Colors.secondary[500]} />
          <Text style={styles.actionButtonText}>Export</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Team Metrics Overview */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>📊 Team Overview</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard(
              'Active Users', 
              `${teamMetrics.activeUsers}/${teamMetrics.totalEmployees}`, 
              `${Math.round((teamMetrics.activeUsers / teamMetrics.totalEmployees) * 100)}% engagement`,
              'people',
              Colors.primary[500]
            )}
            
            {renderMetricCard(
              'Completion Rate', 
              `${teamMetrics.avgCompletionRate}%`, 
              'Average across all courses',
              'check-circle',
              Colors.success
            )}
            
            {renderMetricCard(
              'Training Hours', 
              `${teamMetrics.totalTrainingHours}h`, 
              'This month',
              'schedule',
              Colors.accent.orange
            )}
            
            {renderMetricCard(
              'ROI Score', 
              `${teamMetrics.roiScore}/10`, 
              `+${teamMetrics.avgPerformanceGrowth}% avg growth`,
              'trending-up',
              Colors.secondary[500]
            )}
          </View>
        </Animated.View>

        {/* Employee Filter */}
        <Animated.View 
          style={[
            styles.filterSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>👥 Employee Progress</Text>
          <View style={styles.filterTabs}>
            {(['all', 'active', 'top'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.activeFilterTab,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedFilter === filter && styles.activeFilterTabText,
                ]}>
                  {filter === 'all' ? 'All Employees' : 
                   filter === 'active' ? 'Active Users' : 'Top Performers'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Employee List */}
        <Animated.View 
          style={[
            styles.employeeSection,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {filteredEmployees.map(renderEmployeeCard)}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Employee Details Modal */}
      <Modal
        visible={!!showEmployeeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEmployeeModal(null)}
      >
        {selectedEmployee && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedEmployee.name} - Details</Text>
                <TouchableOpacity onPress={() => setShowEmployeeModal(null)}>
                  <MaterialIcons name="close" size={24} color={Colors.neutral[400]} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Employee Profile */}
                <View style={styles.modalProfile}>
                  <View style={styles.employeeAvatar}>
                    <Text style={styles.avatarText}>{selectedEmployee.avatar}</Text>
                  </View>
                  <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>{selectedEmployee.name}</Text>
                    <Text style={styles.profileRole}>{selectedEmployee.role}</Text>
                    <Text style={styles.profileDepartment}>{selectedEmployee.department}</Text>
                  </View>
                  <View style={styles.profileStats}>
                    <Text style={styles.profileLevel}>Level {selectedEmployee.level}</Text>
                    <Text style={styles.profileXP}>{selectedEmployee.totalXP} XP</Text>
                  </View>
                </View>

                {/* Detailed Metrics */}
                <View style={styles.detailedMetrics}>
                  <Text style={styles.metricsTitle}>Performance Metrics</Text>
                  
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Weekly Training Hours:</Text>
                    <Text style={styles.metricDetailValue}>{selectedEmployee.weeklyHours}h</Text>
                  </View>
                  
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Performance Growth:</Text>
                    <Text style={[styles.metricDetailValue, { color: getPerformanceColor(selectedEmployee.performanceGrowth) }]}>
                      +{selectedEmployee.performanceGrowth}%
                    </Text>
                  </View>
                  
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Current Streak:</Text>
                    <Text style={styles.metricDetailValue}>{selectedEmployee.currentStreak} days</Text>
                  </View>
                  
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Completed Courses:</Text>
                    <Text style={styles.metricDetailValue}>{selectedEmployee.completedCourses}</Text>
                  </View>
                </View>

                {/* Skill Breakdown */}
                <View style={styles.skillBreakdown}>
                  <Text style={styles.metricsTitle}>Skill Breakdown</Text>
                  {Object.entries(selectedEmployee.skillProgress).map(([skill, progress]) => (
                    <View key={skill} style={styles.detailedSkillRow}>
                      <View style={styles.skillHeader}>
                        <Text style={styles.skillLabel}>{skill}</Text>
                        <Text style={styles.skillPercentage}>{progress}%</Text>
                      </View>
                      <View style={styles.skillProgressBar}>
                        <View 
                          style={[
                            styles.skillProgressFill, 
                            { 
                              width: `${progress}%`,
                              backgroundColor: skill === 'AI' ? Colors.primary[500] : 
                                            skill === 'Blockchain' ? Colors.secondary[500] : 
                                            Colors.accent.orange
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.actionModalButton}>
                  <MaterialIcons name="message" size={20} color={Colors.primary[500]} />
                  <Text style={styles.actionModalButtonText}>Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionModalButton}>
                  <MaterialIcons name="assignment" size={20} color={Colors.secondary[500]} />
                  <Text style={styles.actionModalButtonText}>Assign Course</Text>
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
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    gap: 4,
  },
  adminText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.warning,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.text.inverse,
    fontWeight: '500',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: (width - Spacing.lg * 3) / 2,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  metricTitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 10,
    color: Colors.text.tertiary,
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: 4,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: Colors.primary[500],
  },
  filterTabText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: 'white',
    fontWeight: '600',
  },
  employeeSection: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  employeeCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.sm,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  employeeAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: Colors.background.tertiary,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  employeeRole: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  employeeDepartment: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  employeeMeta: {
    alignItems: 'flex-end',
  },
  levelBadge: {
    backgroundColor: Colors.accent.purple,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  xpText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  skillsSection: {
    marginBottom: Spacing.md,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  skillName: {
    fontSize: 12,
    color: Colors.text.tertiary,
    width: 80,
  },
  progressBar: {
    flex: 1,
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
    fontSize: 10,
    color: Colors.text.tertiary,
    width: 35,
    textAlign: 'right',
  },
  employeeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
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
  modalProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
  },
  profileDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  profileRole: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  profileDepartment: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 1,
  },
  profileStats: {
    alignItems: 'flex-end',
  },
  profileLevel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.accent.purple,
  },
  profileXP: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  detailedMetrics: {
    marginBottom: Spacing.xl,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  metricDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  skillBreakdown: {
    marginBottom: Spacing.xl,
  },
  detailedSkillRow: {
    marginBottom: Spacing.md,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  skillPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  skillProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionModalButton: {
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
  actionModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
});

export default AdminDashboard;
