import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import SignUpScreen from './components/SignUpScreen';
import LoginScreen from './components/LoginScreen';
import SkillAssessmentScreen from './components/SkillAssessmentScreen';
import PersonalizationScreen from './components/PersonalizationScreen';
import HomeDashboard from './components/HomeDashboard';
import LearningFlow from './components/LearningFlow';
import LearningPathScreen from './components/LearningPathScreen';
import ModuleTopicScreen from './components/ModuleTopicScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import BadgesRewardsScreen from './components/BadgesRewardsScreen';
import DailyChallengeScreen from './components/DailyChallengeScreen';
import CommunityFeedScreen from './components/CommunityFeedScreen';
import PeerProjectsScreen from './components/PeerProjectsScreen';
import MentorshipScreen from './components/MentorshipScreen';
import AdminDashboard from './components/AdminDashboard';
import AnalyticsScreen from './components/AnalyticsScreen';
import TeamChallenges from './components/TeamChallenges';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import NotificationsScreen from './components/NotificationsScreen';
import HelpSupportScreen from './components/HelpSupportScreen';
import CareerMappingScreen from './components/CareerMappingScreen';
import JobMarketplaceScreen from './components/JobMarketplaceScreen';
import SkillWalletScreen from './components/SkillWalletScreen';
import Colors from './constants/Colors';

type AppState = 
  | 'splash' 
  | 'welcome' 
  | 'signup' 
  | 'login' 
  | 'assessment' 
  | 'personalization' 
  | 'home' 
  | 'learning'
  | 'learningPath'
  | 'moduleLesson'
  | 'leaderboard'
  | 'badgesRewards'
  | 'dailyChallenge'
  | 'communityFeed'
  | 'peerProjects'
  | 'mentorship'
  | 'adminDashboard'
  | 'analytics'
  | 'teamChallenges'
  | 'profile'
  | 'settings'
  | 'notifications'
  | 'helpSupport'
  | 'careerMapping'
  | 'jobMarketplace'
  | 'skillWallet';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [personalizationData, setPersonalizationData] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<string>('');
  const [currentLesson, setCurrentLesson] = useState<string>('');

  const handleSplashComplete = () => {
    setAppState('welcome');
  };

  const handleSignUp = () => {
    setAppState('signup');
  };

  const handleLogin = () => {
    setAppState('login');
  };

  const handleBackToWelcome = () => {
    setAppState('welcome');
  };

  const handleAuthComplete = () => {
    setAppState('assessment');
  };

  const handleAssessmentComplete = (results: any) => {
    setAssessmentResults(results);
    setAppState('personalization');
  };

  const handlePersonalizationComplete = (data: any) => {
    setPersonalizationData(data);
    setAppState('home');
  };

  const handleNavigateToLearningPath = () => {
    setAppState('learningPath');
  };

  const handleModuleSelect = (moduleId: string) => {
    setCurrentModule(moduleId);
    setAppState('moduleLesson');
  };

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    setCurrentModule(moduleId);
    setCurrentLesson(lessonId);
    setAppState('moduleLesson');
  };

  const handleStartLearning = () => {
    setAppState('learning');
  };

  const handleSignUpComplete = (data: { 
    name: string; 
    email: string; 
    password: string; 
    signupMethod: string;
    companyCode?: string;
  }) => {
    console.log('Sign up data:', data);
    // TODO: Handle actual sign up logic here
    handleAuthComplete();
  };

  const handleLoginComplete = (data: { 
    email: string; 
    password: string; 
    loginMethod: string;
  }) => {
    console.log('Login data:', data);
    // TODO: Handle actual login logic here
    handleAuthComplete();
  };

  const handleForgotPassword = () => {
    console.log('Forgot password - would show reset password screen');
    // TODO: Implement forgot password flow
  };

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'splash':
        return <SplashScreen onAnimationComplete={handleSplashComplete} />;
      
      case 'welcome':
        return (
          <WelcomeScreen 
            onSignUp={handleSignUp}
            onLogin={handleLogin}
          />
        );
      
      case 'signup':
        return (
          <SignUpScreen
            onBack={handleBackToWelcome}
            onSignUp={handleSignUpComplete}
            onSwitchToLogin={() => setAppState('login')}
          />
        );
      
      case 'login':
        return (
          <LoginScreen
            onBack={handleBackToWelcome}
            onLogin={handleLoginComplete}
            onSwitchToSignUp={() => setAppState('signup')}
            onForgotPassword={handleForgotPassword}
          />
        );
      
      case 'assessment':
        return (
          <SkillAssessmentScreen
            onBack={handleBackToWelcome}
            onAssessmentComplete={handleAssessmentComplete}
          />
        );
      
      case 'personalization':
        return (
          <PersonalizationScreen
            onBack={() => setAppState('assessment')}
            onPersonalizationComplete={handlePersonalizationComplete}
            assessmentResults={assessmentResults}
          />
        );
      
      case 'home':
        return (
          <HomeDashboard
            userProgress={{
              currentStreak: 7,
              weeklyProgress: 65,
              monthlyProgress: 78,
              totalXP: 2450,
              level: 5,
              badges: [],
              completedCourses: 12,
              totalCourses: 45,
            }}
            recommendations={[]}
            assessmentResults={assessmentResults}
            personalizationData={personalizationData}
            onStartLesson={handleStartLearning}
            onNavigateToLearningPath={handleNavigateToLearningPath}
            onModuleSelect={handleModuleSelect}
            onViewProgress={() => console.log('View progress')}
            onViewLeaderboard={() => setAppState('leaderboard')}
            onViewCertifications={() => setAppState('badgesRewards')}
            onProfile={() => console.log('View profile')}
            onDailyChallenge={() => setAppState('dailyChallenge')}
            onCommunityFeed={() => setAppState('communityFeed')}
            onPeerProjects={() => setAppState('peerProjects')}
            onMentorship={() => setAppState('mentorship')}
            onAdminDashboard={() => setAppState('adminDashboard')}
          />
        );
      
      case 'learning':
        return (
          <LearningFlow
            modules={[]}
            onBack={() => setAppState('home')}
            onStartLesson={(lessonId) => console.log('Start lesson:', lessonId)}
            userLevel={5}
          />
        );
      
      case 'learningPath':
        return (
          <LearningPathScreen
            userProfile={personalizationData}
            assessmentResults={assessmentResults}
            onModuleSelect={handleModuleSelect}
            onBack={() => setAppState('home')}
          />
        );

      case 'moduleLesson':
        return (
          <ModuleTopicScreen
            moduleId={currentModule}
            lessonId={currentLesson || `${currentModule}-1`}
            onBack={() => setAppState('learningPath')}
            onLessonComplete={(lessonId, score) => {
              console.log('Lesson completed:', lessonId, 'Score:', score);
              // You can add lesson completion logic here
            }}
          />
        );

      case 'leaderboard':
        return (
          <LeaderboardScreen
            onBack={() => setAppState('home')}
            currentUserId="4"
          />
        );

      case 'badgesRewards':
        return (
          <BadgesRewardsScreen
            onBack={() => setAppState('home')}
            userCoins={1250}
          />
        );

      case 'dailyChallenge':
        return (
          <DailyChallengeScreen
            onBack={() => setAppState('home')}
            onChallengeComplete={(challengeId, score) => {
              console.log('Challenge completed:', challengeId, 'Score:', score);
              // Add challenge completion logic here
              setAppState('home');
            }}
            currentStreak={7}
          />
        );

      case 'communityFeed':
        return (
          <CommunityFeedScreen
            onBack={() => setAppState('home')}
            currentUser={null}
          />
        );

      case 'peerProjects':
        return (
          <PeerProjectsScreen
            onBack={() => setAppState('home')}
            currentUser={null}
          />
        );

      case 'mentorship':
        return (
          <MentorshipScreen
            onBack={() => setAppState('home')}
            currentUser={null}
            isPremium={false}
          />
        );

      case 'adminDashboard':
        return (
          <AdminDashboard
            onBack={() => setAppState('home')}
            onEmployeeDetails={(employeeId) => console.log('View employee:', employeeId)}
            onAnalytics={() => setAppState('analytics')}
            onTeamChallenges={() => setAppState('teamChallenges')}
          />
        );

      case 'analytics':
        return (
          <AnalyticsScreen
            onBack={() => setAppState('adminDashboard')}
            onExportReport={() => console.log('Export report')}
          />
        );

      case 'teamChallenges':
        return (
          <TeamChallenges
            onBack={() => setAppState('adminDashboard')}
            onChallengeDetails={(challengeId) => console.log('View challenge:', challengeId)}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            onBack={() => setAppState('home')}
            onEditProfile={() => console.log('Edit profile')}
            onSettings={() => setAppState('settings')}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            onBack={() => setAppState('profile')}
            onLanguageSelect={(language: string) => console.log('Language changed to:', language)}
            onThemeChange={(isDark: boolean) => console.log('Theme changed:', isDark)}
          />
        );

      case 'notifications':
        return (
          <NotificationsScreen
            onBack={() => setAppState('home')}
            onNotificationPress={(notification: any) => console.log('Notification pressed:', notification)}
            onMarkAllRead={() => console.log('Mark all notifications as read')}
          />
        );

      case 'helpSupport':
        return (
          <HelpSupportScreen
            onBack={() => setAppState('home')}
            onContactSupport={(ticket: any) => console.log('Support ticket:', ticket)}
          />
        );

      case 'careerMapping':
        return (
          <CareerMappingScreen
            onBack={() => setAppState('home')}
          />
        );

      case 'jobMarketplace':
        return (
          <JobMarketplaceScreen
            onBack={() => setAppState('home')}
          />
        );

      case 'skillWallet':
        return (
          <SkillWalletScreen
            onBack={() => setAppState('home')}
          />
        );
      
      default:
        return (
          <HomeDashboard
            userProgress={{
              currentStreak: 7,
              weeklyProgress: 65,
              monthlyProgress: 78,
              totalXP: 2450,
              level: 5,
              badges: [],
              completedCourses: 12,
              totalCourses: 45,
            }}
            recommendations={[]}
            assessmentResults={assessmentResults}
            personalizationData={personalizationData}
            onStartLesson={handleStartLearning}
            onViewProgress={() => console.log('View progress')}
            onViewLeaderboard={() => console.log('View leaderboard')}
            onViewCertifications={() => console.log('View certifications')}
            onProfile={() => setAppState('profile')}
            onDailyChallenge={() => setAppState('dailyChallenge')}
            onCommunityFeed={() => setAppState('communityFeed')}
            onPeerProjects={() => setAppState('peerProjects')}
            onMentorship={() => setAppState('mentorship')}
            onAdminDashboard={() => setAppState('adminDashboard')}
            onSettings={() => setAppState('settings')}
            onNotifications={() => setAppState('notifications')}
            onHelpSupport={() => setAppState('helpSupport')}
            onCareerMapping={() => setAppState('careerMapping')}
            onJobMarketplace={() => setAppState('jobMarketplace')}
            onSkillWallet={() => setAppState('skillWallet')}
          />
        );
    }
  };

  return renderCurrentScreen();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  comingSoonText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
