import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onSignUp?: () => void;
  onLogin?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSignUp, onLogin }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale1 = useRef(new Animated.Value(0.9)).current;
  const buttonScale2 = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Button entrance animations with delay
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(buttonScale1, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale2, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
          delay: 100,
        }),
      ]).start();
    }, 400);
  }, []);

  const handleSignUpPress = () => {
    // Add haptic feedback animation
    Animated.sequence([
      Animated.timing(buttonScale1, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale1, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onSignUp?.();
  };

  const handleLoginPress = () => {
    // Add haptic feedback animation
    Animated.sequence([
      Animated.timing(buttonScale2, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale2, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onLogin?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[600]} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[700]]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Background Elements */}
      <View style={styles.decorativeElements}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header Section */}
          <View style={styles.header}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <MaterialIcons 
                  name="psychology" 
                  size={60} 
                  color={Colors.text.inverse} 
                />
              </View>
              <Text style={styles.logoText}>UpskillX</Text>
            </View>

            {/* Value Proposition */}
            <View style={styles.valueProposition}>
              <Text style={styles.mainHeading}>
                Transform Your Career
              </Text>
              <Text style={styles.subHeading}>
                Upskill in AI, Blockchain, Product skills with gamified learning
              </Text>
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: Colors.accent.purple }]}>
                <MaterialIcons name="smart-toy" size={24} color={Colors.text.inverse} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>AI & Machine Learning</Text>
                <Text style={styles.featureDescription}>Master cutting-edge AI technologies</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: Colors.accent.orange }]}>
                <MaterialIcons name="account-balance" size={24} color={Colors.text.inverse} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Blockchain Technology</Text>
                <Text style={styles.featureDescription}>Build the future of finance</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: Colors.accent.emerald }]}>
                <MaterialIcons name="trending-up" size={24} color={Colors.text.inverse} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Product Skills</Text>
                <Text style={styles.featureDescription}>Launch successful products</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {/* Sign Up Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale1 }] }}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignUpPress}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[Colors.accent.emerald, Colors.secondary[500]]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialIcons 
                    name="rocket-launch" 
                    size={20} 
                    color={Colors.text.inverse} 
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale2 }] }}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleLoginPress}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name="login" 
                  size={20} 
                  color={Colors.text.inverse} 
                  style={styles.buttonIcon}
                />
                <Text style={styles.secondaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest Access */}
            <TouchableOpacity style={styles.guestButton} activeOpacity={0.7}>
              <MaterialIcons 
                name="visibility" 
                size={18} 
                color={Colors.text.inverse} 
                style={styles.buttonIcon}
              />
              <Text style={styles.guestButtonText}>Browse as Guest</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Learners</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[600],
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeElements: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    right: -30,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing['2xl'],
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoIcon: {
    marginBottom: Spacing.md,
    ...Shadows.lg,
  },
  logoText: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.text.inverse,
    letterSpacing: Typography.letterSpacing.tight,
  },
  valueProposition: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  mainHeading: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize['2xl'],
  },
  subHeading: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
  },
  featuresContainer: {
    marginVertical: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    opacity: 0.8,
  },
  actionContainer: {
    marginVertical: Spacing.xl,
  },
  primaryButton: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadows.lg,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  primaryButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: Spacing.lg,
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    opacity: 0.7,
    marginHorizontal: Spacing.md,
    fontWeight: Typography.fontWeight.medium,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  guestButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    opacity: 0.8,
    fontWeight: Typography.fontWeight.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.inverse,
    opacity: 0.7,
    fontWeight: Typography.fontWeight.medium,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: Spacing.md,
  },
});

export default WelcomeScreen;
