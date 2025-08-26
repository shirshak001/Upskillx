import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/Design';

interface CompanyDomainScreenProps {
  onBack?: () => void;
  onDomainVerified?: (domain: string) => void;
  onInviteCode?: () => void;
}

const CompanyDomainScreen: React.FC<CompanyDomainScreenProps> = ({ 
  onBack, 
  onDomainVerified,
  onInviteCode 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDomainVerification = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your company email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const domain = email.split('@')[1];
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    
    if (commonDomains.includes(domain.toLowerCase())) {
      Alert.alert(
        'Personal Email Detected',
        'Please use your company email address or enter an invite code instead.',
        [
          { text: 'Use Invite Code', onPress: onInviteCode },
          { text: 'Try Again', style: 'cancel' }
        ]
      );
      return;
    }

    setIsLoading(true);
    // Simulate domain verification
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Domain Verification',
        `We'll send a verification email to ${email}. Please check your inbox and follow the instructions.`,
        [
          { text: 'OK', onPress: () => onDomainVerified?.(domain) }
        ]
      );
    }, 2000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[600]} />
      
      {/* Background */}
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[700]]}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Company Access</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Icon and Title */}
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="domain" size={60} color={Colors.text.inverse} />
            </View>
            <Text style={styles.title}>Verify Company Domain</Text>
            <Text style={styles.subtitle}>
              Enter your company email address to get access to your organization's learning programs
            </Text>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Company Learning Benefits</Text>
            
            <View style={styles.benefitItem}>
              <MaterialIcons name="workspace-premium" size={24} color={Colors.accent.emerald} />
              <Text style={styles.benefitText}>Premium course content</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <MaterialIcons name="analytics" size={24} color={Colors.accent.emerald} />
              <Text style={styles.benefitText}>Progress tracking & analytics</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <MaterialIcons name="group" size={24} color={Colors.accent.emerald} />
              <Text style={styles.benefitText}>Team collaboration features</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <MaterialIcons name="support" size={24} color={Colors.accent.emerald} />
              <Text style={styles.benefitText}>Priority customer support</Text>
            </View>
          </View>

          {/* Email Input Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Company Email Address</Text>
            
            <View style={styles.inputContainer}>
              <MaterialIcons name="business" size={20} color={Colors.neutral[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="your.name@company.com"
                placeholderTextColor={Colors.neutral[400]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <TouchableOpacity 
              style={[styles.verifyButton, isLoading && styles.buttonDisabled]} 
              onPress={handleDomainVerification}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[Colors.accent.emerald, Colors.secondary[500]]}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <MaterialIcons name="hourglass-empty" size={20} color={Colors.text.inverse} style={styles.loadingIcon} />
                ) : (
                  <MaterialIcons name="verified" size={20} color={Colors.text.inverse} style={styles.buttonIcon} />
                )}
                <Text style={styles.verifyButtonText}>
                  {isLoading ? 'Verifying Domain...' : 'Verify Domain'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Alternative Option */}
          <View style={styles.alternativeContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.inviteCodeButton} onPress={onInviteCode}>
              <MaterialIcons name="vpn-key" size={20} color={Colors.text.inverse} />
              <Text style={styles.inviteCodeButtonText}>Use Company Invite Code</Text>
            </TouchableOpacity>
          </View>

          {/* Help Section */}
          <View style={styles.helpContainer}>
            <MaterialIcons name="help-outline" size={18} color={Colors.text.inverse} />
            <Text style={styles.helpText}>
              Don't have a company email? Contact your HR or IT department to get access to your organization's UpskillX account.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  iconContainer: {
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  benefitsContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  benefitsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  benefitText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    marginLeft: Spacing.md,
    opacity: 0.9,
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  formTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    paddingVertical: Spacing.lg,
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
  },
  verifyButton: {
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  loadingIcon: {
    marginRight: Spacing.sm,
  },
  verifyButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  alternativeContainer: {
    marginBottom: Spacing.xl,
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
  },
  inviteCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inviteCodeButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    marginLeft: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  helpText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    opacity: 0.8,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
});

export default CompanyDomainScreen;
