import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(30)).current;
  const iconRotation = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    startAnimationSequence();
  }, []);

  const startAnimationSequence = () => {
    // Step 1: Logo appears with scale and fade in
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Step 2: Icon rotation animation
      Animated.timing(iconRotation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      // Step 3: Tagline appears with slide up effect
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(taglineTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();

        // Step 4: Progress bar animation
        setTimeout(() => {
          Animated.timing(progressWidth, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }).start(() => {
            // Complete animation after 3 seconds total
            setTimeout(() => {
              onAnimationComplete?.();
            }, 300);
          });
        }, 200);
      }, 400);
    });
  };

  const iconRotationInterpolate = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidthInterpolate = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.6],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[Colors.primary[500], Colors.accent.purple]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating particles background effect */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                transform: [
                  {
                    scale: logoOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.logoIcon,
              {
                transform: [{ rotate: iconRotationInterpolate }],
              },
            ]}
          >
            <MaterialIcons 
              name="psychology" 
              size={80} 
              color={Colors.text.inverse} 
            />
          </Animated.View>
          
          <Text style={styles.logoText}>UpskillX</Text>
          
          <View style={styles.logoAccent}>
            <MaterialIcons 
              name="rocket-launch" 
              size={24} 
              color={Colors.accent.orange} 
            />
          </View>
        </Animated.View>

        {/* Tagline Section */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          <Text style={styles.tagline}>
            Empowering India's Next-Gen Workforce
          </Text>
          <Text style={styles.subTagline}>
            AI • Blockchain • Product Skills
          </Text>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidthInterpolate,
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Loading your journey...</Text>
        </View>
      </View>

      {/* Bottom Brand Elements */}
      <View style={styles.bottomElements}>
        <View style={styles.skillIcons}>
          <View style={styles.skillIcon}>
            <MaterialIcons name="smart-toy" size={16} color={Colors.accent.purple} />
          </View>
          <View style={styles.skillIcon}>
            <MaterialIcons name="account-balance" size={16} color={Colors.accent.orange} />
          </View>
          <View style={styles.skillIcon}>
            <MaterialIcons name="trending-up" size={16} color={Colors.accent.emerald} />
          </View>
        </View>
      </View>
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
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: Colors.text.inverse,
    borderRadius: 2,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoIcon: {
    marginBottom: 20,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.text.inverse,
    letterSpacing: -1,
    textShadowColor: Colors.neutral[900],
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  logoAccent: {
    position: 'absolute',
    top: -10,
    right: -15,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.95,
  },
  subTagline: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.inverse,
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 2,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressTrack: {
    width: width * 0.6,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.accent.emerald,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.text.inverse,
    opacity: 0.7,
    fontWeight: '500',
  },
  bottomElements: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  skillIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  skillIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default SplashScreen;
