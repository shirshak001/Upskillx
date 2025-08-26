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

interface SignUpScreenProps {
  onBack?: () => void;
  onSignUp?: (data: { 
    name: string; 
    email: string; 
    password: string; 
    signupMethod: string;
    companyCode?: string;
  }) => void;
  onSwitchToLogin?: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ 
  onBack, 
  onSignUp, 
  onSwitchToLogin 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupType, setSignupType] = useState<'individual' | 'company'>('individual');

  const handleEmailSignUp = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (signupType === 'company' && !formData.companyCode) {
      Alert.alert('Error', 'Please enter a company invite code');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSignUp?.({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        signupMethod: 'email',
        companyCode: signupType === 'company' ? formData.companyCode : undefined,
      });
    }, 1000);
  };

  const handleSocialSignUp = (provider: string) => {
    Alert.alert('Social Sign Up', `${provider} signup would be implemented here`);
    onSignUp?.({
      name: `User from ${provider}`,
      email: `user@${provider.toLowerCase()}.com`,
      password: '',
      signupMethod: provider.toLowerCase(),
    });
  };

  const isCompanyEmail = (email: string) => {
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !commonDomains.includes(domain);
  };

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    if (isCompanyEmail(email)) {
      setSignupType('company');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[600]} />
      
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[700]]}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Join UpskillX</Text>
            <Text style={styles.welcomeSubtitle}>
              Start your journey to master future skills
            </Text>
          </View>

          <View style={styles.accountTypeContainer}>
            <Text style={styles.accountTypeTitle}>Account Type</Text>
            <View style={styles.accountTypeButtons}>
              <TouchableOpacity 
                style={[
                  styles.accountTypeButton, 
                  signupType === 'individual' && styles.accountTypeButtonActive
                ]}
                onPress={() => setSignupType('individual')}
              >
                <MaterialIcons 
                  name="person" 
                  size={20} 
                  color={signupType === 'individual' ? Colors.primary[500] : Colors.text.inverse} 
                />
                <Text style={[
                  styles.accountTypeButtonText,
                  signupType === 'individual' && styles.accountTypeButtonTextActive
                ]}>
                  Individual
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.accountTypeButton, 
                  signupType === 'company' && styles.accountTypeButtonActive
                ]}
                onPress={() => setSignupType('company')}
              >
                <MaterialIcons 
                  name="business" 
                  size={20} 
                  color={signupType === 'company' ? Colors.primary[500] : Colors.text.inverse} 
                />
                <Text style={[
                  styles.accountTypeButtonText,
                  signupType === 'company' && styles.accountTypeButtonTextActive
                ]}>
                  Company
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={() => handleSocialSignUp('Google')}
            >
              <MaterialIcons name="login" size={20} color={Colors.text.inverse} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={() => handleSocialSignUp('LinkedIn')}
            >
              <MaterialIcons name="business" size={20} color={Colors.text.inverse} />
              <Text style={styles.socialButtonText}>Continue with LinkedIn</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={() => handleSocialSignUp('GitHub')}
            >
              <MaterialIcons name="code" size={20} color={Colors.text.inverse} />
              <Text style={styles.socialButtonText}>Continue with GitHub</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with email</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} color={Colors.neutral[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Full Name"
                placeholderTextColor={Colors.neutral[400]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color={Colors.neutral[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={signupType === 'company' ? 'Company Email Address' : 'Email Address'}
                placeholderTextColor={Colors.neutral[400]}
                value={formData.email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {signupType === 'company' && (
              <View style={styles.inputContainer}>
                <MaterialIcons name="vpn-key" size={20} color={Colors.neutral[400]} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Company Invite Code"
                  placeholderTextColor={Colors.neutral[400]}
                  value={formData.companyCode}
                  onChangeText={(text) => setFormData({ ...formData, companyCode: text })}
                  autoCapitalize="characters"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={Colors.neutral[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor={Colors.neutral[400]}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color={Colors.neutral[400]} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={Colors.neutral[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm Password"
                placeholderTextColor={Colors.neutral[400]}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons 
                  name={showConfirmPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color={Colors.neutral[400]} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.signUpButton, isLoading && styles.buttonDisabled]} 
              onPress={handleEmailSignUp}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[Colors.accent.emerald, Colors.secondary[500]]}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <MaterialIcons name="hourglass-empty" size={20} color={Colors.text.inverse} style={styles.loadingIcon} />
                ) : (
                  <MaterialIcons name="rocket-launch" size={20} color={Colors.text.inverse} style={styles.buttonIcon} />
                )}
                <Text style={styles.signUpButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {signupType === 'company' && (
            <View style={styles.companyInfoContainer}>
              <View style={styles.companyInfoHeader}>
                <MaterialIcons name="info" size={18} color={Colors.accent.emerald} />
                <Text style={styles.companyInfoTitle}>Company Benefits</Text>
              </View>
              <Text style={styles.companyInfoText}>
                • Access to enterprise-grade courses{'\n'}
                • Team progress tracking and analytics{'\n'}
                • Custom learning paths for your organization{'\n'}
                • Priority support and onboarding
              </Text>
            </View>
          )}

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSwitchToLogin}>
              <Text style={styles.switchLink}>Sign In</Text>
            </TouchableOpacity>
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
  welcomeSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    opacity: 0.8,
    textAlign: 'center',
  },
  accountTypeContainer: {
    marginBottom: Spacing.xl,
  },
  accountTypeTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  accountTypeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  accountTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  accountTypeButtonActive: {
    backgroundColor: Colors.text.inverse,
    borderColor: Colors.text.inverse,
  },
  accountTypeButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    marginLeft: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  accountTypeButtonTextActive: {
    color: Colors.primary[500],
  },
  socialContainer: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  socialButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    marginLeft: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
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
  formContainer: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
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
  eyeIcon: {
    padding: Spacing.sm,
  },
  signUpButton: {
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.lg,
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
  signUpButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  companyInfoContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  companyInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  companyInfoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
    marginLeft: Spacing.sm,
  },
  companyInfoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    opacity: 0.9,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  switchText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    opacity: 0.8,
  },
  switchLink: {
    fontSize: Typography.fontSize.base,
    color: Colors.accent.emerald,
    fontWeight: Typography.fontWeight.semibold,
  },
});

export default SignUpScreen;
