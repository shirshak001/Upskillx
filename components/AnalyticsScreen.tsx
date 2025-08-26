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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface ChartData {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface AnalyticsData {
  skillsProgress: ChartData[];
  completionRates: ChartData[];
  topPerformers: Array<{
    id: string;
    name: string;
    avatar: string;
    department: string;
    score: number;
    improvement: number;
  }>;
  monthlyProgress: Array<{
    month: string;
    completions: number;
    hours: number;
    users: number;
  }>;
  departmentStats: ChartData[];
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    averageSessionTime: number;
    retentionRate: number;
  };
}

interface AnalyticsScreenProps {
  onBack?: () => void;
  onExportReport?: () => void;
}

const sampleData: AnalyticsData = {
  skillsProgress: [
    { label: 'AI', value: 78, color: Colors.primary[500], percentage: 78 },
    { label: 'Blockchain', value: 65, color: Colors.secondary[500], percentage: 65 },
    { label: 'Product', value: 82, color: Colors.accent.orange, percentage: 82 },
  ],
  completionRates: [
    { label: 'Completed', value: 78, color: Colors.success },
    { label: 'In Progress', value: 15, color: Colors.warning },
    { label: 'Not Started', value: 7, color: Colors.neutral[400] },
  ],
  topPerformers: [
    {
      id: '1',
      name: 'David Kim',
      avatar: '👨‍🚀',
      department: 'Engineering',
      score: 95,
      improvement: 42,
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      avatar: '👨‍💼',
      department: 'Product',
      score: 88,
      improvement: 31,
    },
    {
      id: '3',
      name: 'Sarah Chen',
      avatar: '👩‍💻',
      department: 'Engineering',
      score: 85,
      improvement: 23,
    },
    {
      id: '4',
      name: 'Emily Park',
      avatar: '👩‍🎨',
      department: 'Design',
      score: 79,
      improvement: 18,
    },
    {
      id: '5',
      name: 'Alex Johnson',
      avatar: '👨‍🔬',
      department: 'Research',
      score: 76,
      improvement: 15,
    },
  ],
  monthlyProgress: [
    { month: 'Jan', completions: 142, hours: 890, users: 35 },
    { month: 'Feb', completions: 165, hours: 1050, users: 38 },
    { month: 'Mar', completions: 189, hours: 1180, users: 42 },
    { month: 'Apr', completions: 208, hours: 1320, users: 45 },
    { month: 'May', completions: 234, hours: 1480, users: 47 },
    { month: 'Jun', completions: 267, hours: 1690, users: 48 },
  ],
  departmentStats: [
    { label: 'Engineering', value: 18, color: Colors.primary[500] },
    { label: 'Product', value: 12, color: Colors.secondary[500] },
    { label: 'Design', value: 8, color: Colors.accent.orange },
    { label: 'Marketing', value: 6, color: Colors.accent.purple },
    { label: 'Sales', value: 4, color: Colors.accent.pink },
  ],
  engagementMetrics: {
    dailyActiveUsers: 32,
    weeklyActiveUsers: 42,
    averageSessionTime: 24.5,
    retentionRate: 87,
  },
};

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  onBack,
  onExportReport,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [data] = useState(sampleData);
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

  const renderProgressChart = (title: string, data: ChartData[], showPercentage: boolean = true) => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.chartItem}>
            <View style={styles.chartLabelRow}>
              <View style={styles.chartLabel}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.labelText}>{item.label}</Text>
              </View>
              <Text style={styles.valueText}>
                {showPercentage ? `${item.value}%` : item.value}
              </Text>
            </View>
            {showPercentage && (
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderPieChart = (title: string, data: ChartData[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{title}</Text>
        <View style={styles.pieChartContainer}>
          <View style={styles.pieChart}>
            <View style={styles.pieChartCenter}>
              <Text style={styles.pieChartValue}>{total}%</Text>
              <Text style={styles.pieChartLabel}>Total</Text>
            </View>
          </View>
          <View style={styles.pieLegend}>
            {data.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label}</Text>
                <Text style={styles.legendValue}>{item.value}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...data.monthlyProgress.map(item => item.completions));
    
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📈 Course Completions Trend</Text>
        <View style={styles.lineChartContainer}>
          <View style={styles.lineChart}>
            {data.monthlyProgress.map((item, index) => {
              const height = (item.completions / maxValue) * 120;
              return (
                <View key={index} style={styles.lineChartBar}>
                  <Animated.View
                    style={[
                      styles.barFill,
                      {
                        height: height,
                        backgroundColor: Colors.primary[500],
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{item.month}</Text>
                  <Text style={styles.barValue}>{item.completions}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderTopPerformers = () => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>🏆 Top Performers</Text>
      <View style={styles.performersContainer}>
        {data.topPerformers.map((performer, index) => (
          <View key={performer.id} style={styles.performerCard}>
            <View style={styles.performerRank}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            
            <View style={styles.performerAvatar}>
              <Text style={styles.performerAvatarText}>{performer.avatar}</Text>
            </View>
            
            <View style={styles.performerInfo}>
              <Text style={styles.performerName}>{performer.name}</Text>
              <Text style={styles.performerDepartment}>{performer.department}</Text>
            </View>
            
            <View style={styles.performerStats}>
              <Text style={styles.performerScore}>{performer.score}%</Text>
              <View style={styles.improvementBadge}>
                <MaterialIcons name="trending-up" size={12} color={Colors.success} />
                <Text style={styles.improvementText}>+{performer.improvement}%</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderEngagementMetrics = () => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>📊 Engagement Metrics</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <MaterialIcons name="people" size={24} color={Colors.primary[500]} />
          <Text style={styles.metricValue}>{data.engagementMetrics.dailyActiveUsers}</Text>
          <Text style={styles.metricLabel}>Daily Active</Text>
        </View>
        
        <View style={styles.metricItem}>
          <MaterialIcons name="groups" size={24} color={Colors.secondary[500]} />
          <Text style={styles.metricValue}>{data.engagementMetrics.weeklyActiveUsers}</Text>
          <Text style={styles.metricLabel}>Weekly Active</Text>
        </View>
        
        <View style={styles.metricItem}>
          <MaterialIcons name="schedule" size={24} color={Colors.accent.orange} />
          <Text style={styles.metricValue}>{data.engagementMetrics.averageSessionTime}m</Text>
          <Text style={styles.metricLabel}>Avg Session</Text>
        </View>
        
        <View style={styles.metricItem}>
          <MaterialIcons name="autorenew" size={24} color={Colors.accent.purple} />
          <Text style={styles.metricValue}>{data.engagementMetrics.retentionRate}%</Text>
          <Text style={styles.metricLabel}>Retention</Text>
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
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
        <TouchableOpacity style={styles.exportButton} onPress={onExportReport}>
          <MaterialIcons name="download" size={20} color={Colors.primary[500]} />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Period Filter */}
      <Animated.View 
        style={[
          styles.filterContainer,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <View style={styles.periodTabs}>
          {(['week', 'month', 'quarter'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodTab,
                selectedPeriod === period && styles.activePeriodTab,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodTabText,
                selectedPeriod === period && styles.activePeriodTabText,
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Engagement Metrics */}
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {renderEngagementMetrics()}
        </Animated.View>

        {/* Skills Progress Chart */}
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {renderProgressChart('🎯 Skills Learning Progress', data.skillsProgress)}
        </Animated.View>

        {/* Completion Rates Pie Chart */}
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {renderPieChart('📈 Course Completion Rates', data.completionRates)}
        </Animated.View>

        {/* Monthly Progress Line Chart */}
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {renderLineChart()}
        </Animated.View>

        {/* Department Distribution */}
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {renderProgressChart('🏢 Department Distribution', data.departmentStats, false)}
        </Animated.View>

        {/* Top Performers */}
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {renderTopPerformers()}
        </Animated.View>

        {/* ROI Insights */}
        <Animated.View 
          style={[
            styles.chartCard,
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          <Text style={styles.chartTitle}>💰 ROI Insights</Text>
          <View style={styles.roiContainer}>
            <View style={styles.roiCard}>
              <Text style={styles.roiValue}>$127K</Text>
              <Text style={styles.roiLabel}>Cost Savings</Text>
              <Text style={styles.roiSubtext}>from reduced turnover</Text>
            </View>
            
            <View style={styles.roiCard}>
              <Text style={styles.roiValue}>+28%</Text>
              <Text style={styles.roiLabel}>Productivity</Text>
              <Text style={styles.roiSubtext}>average increase</Text>
            </View>
            
            <View style={styles.roiCard}>
              <Text style={styles.roiValue}>8.4x</Text>
              <Text style={styles.roiLabel}>ROI Multiple</Text>
              <Text style={styles.roiSubtext}>training investment</Text>
            </View>
          </View>
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  exportText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: 4,
    gap: 4,
  },
  periodTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  activePeriodTab: {
    backgroundColor: Colors.primary[500],
  },
  periodTabText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  activePeriodTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  chartCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.sm,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
  },
  chartContainer: {
    gap: Spacing.md,
  },
  chartItem: {
    gap: Spacing.xs,
  },
  chartLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  labelText: {
    fontSize: 14,
    color: Colors.text.inverse,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  progressBarContainer: {
    marginTop: Spacing.xs,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  pieChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pieChartCenter: {
    alignItems: 'center',
  },
  pieChartValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  pieChartLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  pieLegend: {
    flex: 1,
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    flex: 1,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  lineChartContainer: {
    paddingVertical: Spacing.md,
  },
  lineChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    paddingBottom: 40,
  },
  lineChartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 20,
    borderRadius: 10,
    marginBottom: Spacing.sm,
  },
  barLabel: {
    fontSize: 10,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    position: 'absolute',
    bottom: -20,
  },
  performersContainer: {
    gap: Spacing.md,
  },
  performerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  performerRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accent.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  performerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  performerAvatarText: {
    fontSize: 18,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  performerDepartment: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  performerStats: {
    alignItems: 'flex-end',
  },
  performerScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  improvementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  improvementText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.success,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metricItem: {
    flex: 1,
    minWidth: (width - Spacing.lg * 3) / 2,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.md,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginTop: Spacing.sm,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: 2,
  },
  roiContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roiCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.md,
  },
  roiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.success,
  },
  roiLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    marginTop: Spacing.xs,
  },
  roiSubtext: {
    fontSize: 10,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default AnalyticsScreen;
