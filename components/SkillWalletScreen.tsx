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
  Share,
  Alert,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Spacing, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface BlockchainCertificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: Date;
  credentialId: string;
  blockchainHash: string;
  ipfsHash: string;
  walletAddress: string;
  skills: string[];
  level: 'foundation' | 'intermediate' | 'advanced' | 'expert';
  category: 'ai' | 'blockchain' | 'product' | 'fullstack' | 'mobile';
  verificationStatus: 'verified' | 'pending' | 'failed';
  publiclyVisible: boolean;
  downloadUrl: string;
  shareableLink: string;
  blockchainNetwork: 'ethereum' | 'polygon' | 'binance' | 'solana';
  gasUsed?: string;
  transactionFee?: string;
}

interface SkillWalletStats {
  totalCertificates: number;
  verifiedCertificates: number;
  totalSkills: number;
  uniqueIssuers: number;
  walletValue: string;
  trustScore: number;
}

interface SkillWalletScreenProps {
  onBack?: () => void;
  onCertificateDetails?: (certificateId: string) => void;
  onShareCertificate?: (certificateId: string) => void;
  onVerifyCertificate?: (certificateId: string) => void;
  onAddToLinkedIn?: (certificateId: string) => void;
}

const sampleCertificates: BlockchainCertificate[] = [
  {
    id: '1',
    title: 'AI & Machine Learning Specialist',
    issuer: 'SkillBoost Academy',
    issueDate: new Date('2025-08-15'),
    credentialId: 'SB-AI-2025-001',
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    ipfsHash: 'QmYwAPJzv5CZsnA5wH3VvVpw7YchSz3y6dGT8Xr2jKQS7f',
    walletAddress: '0x742d35Cc6641C5e3c...8F1d4C1ebb5',
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Science'],
    level: 'advanced',
    category: 'ai',
    verificationStatus: 'verified',
    publiclyVisible: true,
    downloadUrl: 'https://certificates.skillboost.com/ai-specialist-cert.pdf',
    shareableLink: 'https://verify.skillboost.com/cert/SB-AI-2025-001',
    blockchainNetwork: 'polygon',
    gasUsed: '0.0021 MATIC',
    transactionFee: '₹0.15',
  },
  {
    id: '2',
    title: 'Blockchain Developer Professional',
    issuer: 'Web3 Institute',
    issueDate: new Date('2025-07-28'),
    credentialId: 'W3I-BC-2025-087',
    blockchainHash: '0x9876543210fedcba0987654321fedcba09876543',
    ipfsHash: 'QmXvZBCsdfE4kj3gFhJ9LmNpQr6tYu8vWx2zA1bC3dE5fG',
    walletAddress: '0x742d35Cc6641C5e3c...8F1d4C1ebb5',
    skills: ['Solidity', 'Smart Contracts', 'DeFi', 'Web3.js'],
    level: 'expert',
    category: 'blockchain',
    verificationStatus: 'verified',
    publiclyVisible: true,
    downloadUrl: 'https://certificates.web3institute.org/blockchain-dev-cert.pdf',
    shareableLink: 'https://verify.web3institute.org/cert/W3I-BC-2025-087',
    blockchainNetwork: 'ethereum',
    gasUsed: '0.0045 ETH',
    transactionFee: '₹12.50',
  },
  {
    id: '3',
    title: 'Product Management Excellence',
    issuer: 'ProductCraft University',
    issueDate: new Date('2025-07-10'),
    credentialId: 'PCU-PM-2025-156',
    blockchainHash: '0xabcdef1234567890fedcba0987654321abcdef12',
    ipfsHash: 'QmPkL4mN7oBpQ1rS2tU3vW4xY5zA6bC7dE8fG9hI0jK1lM',
    walletAddress: '0x742d35Cc6641C5e3c...8F1d4C1ebb5',
    skills: ['Product Strategy', 'User Research', 'A/B Testing', 'Analytics'],
    level: 'intermediate',
    category: 'product',
    verificationStatus: 'verified',
    publiclyVisible: false,
    downloadUrl: 'https://certificates.productcraft.edu/pm-excellence-cert.pdf',
    shareableLink: 'https://verify.productcraft.edu/cert/PCU-PM-2025-156',
    blockchainNetwork: 'polygon',
    gasUsed: '0.0018 MATIC',
    transactionFee: '₹0.12',
  },
  {
    id: '4',
    title: 'Full Stack JavaScript Developer',
    issuer: 'CodeMasters Academy',
    issueDate: new Date('2025-06-22'),
    credentialId: 'CMA-FS-2025-089',
    blockchainHash: '0x555666777888999aaabbbcccdddeeefffggghhh',
    ipfsHash: 'QmRsT5uV6wX7yZ8aB9cD0eF1gH2iJ3kL4mN5oP6qR7sT8u',
    walletAddress: '0x742d35Cc6641C5e3c...8F1d4C1ebb5',
    skills: ['React', 'Node.js', 'MongoDB', 'Express.js'],
    level: 'advanced',
    category: 'fullstack',
    verificationStatus: 'pending',
    publiclyVisible: true,
    downloadUrl: 'https://certificates.codemasters.org/fullstack-js-cert.pdf',
    shareableLink: 'https://verify.codemasters.org/cert/CMA-FS-2025-089',
    blockchainNetwork: 'binance',
    gasUsed: '0.0008 BNB',
    transactionFee: '₹0.80',
  },
];

const walletStats: SkillWalletStats = {
  totalCertificates: sampleCertificates.length,
  verifiedCertificates: sampleCertificates.filter(c => c.verificationStatus === 'verified').length,
  totalSkills: [...new Set(sampleCertificates.flatMap(c => c.skills))].length,
  uniqueIssuers: [...new Set(sampleCertificates.map(c => c.issuer))].length,
  walletValue: '₹2,45,000',
  trustScore: 94,
};

const SkillWalletScreen: React.FC<SkillWalletScreenProps> = ({
  onBack,
  onCertificateDetails,
  onShareCertificate,
  onVerifyCertificate,
  onAddToLinkedIn,
}) => {
  const [certificates, setCertificates] = useState(sampleCertificates);
  const [selectedCertificate, setSelectedCertificate] = useState<BlockchainCertificate | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
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

  const getNetworkColor = (network: BlockchainCertificate['blockchainNetwork']) => {
    switch (network) {
      case 'ethereum': return '#627EEA';
      case 'polygon': return '#8247E5';
      case 'binance': return '#F3BA2F';
      case 'solana': return '#00FFA3';
      default: return Colors.neutral[400];
    }
  };

  const getNetworkIcon = (network: BlockchainCertificate['blockchainNetwork']) => {
    switch (network) {
      case 'ethereum': return '♦️';
      case 'polygon': return '🔷';
      case 'binance': return '🟨';
      case 'solana': return '🌈';
      default: return '⛓️';
    }
  };

  const getCategoryColor = (category: BlockchainCertificate['category']) => {
    switch (category) {
      case 'ai': return Colors.primary[500];
      case 'blockchain': return Colors.secondary[500];
      case 'product': return Colors.accent.orange;
      case 'fullstack': return Colors.accent.purple;
      case 'mobile': return Colors.accent.emerald;
      default: return Colors.neutral[400];
    }
  };

  const getLevelColor = (level: BlockchainCertificate['level']) => {
    switch (level) {
      case 'foundation': return Colors.neutral[400];
      case 'intermediate': return Colors.warning;
      case 'advanced': return Colors.accent.orange;
      case 'expert': return Colors.error;
      default: return Colors.neutral[400];
    }
  };

  const getStatusIcon = (status: BlockchainCertificate['verificationStatus']) => {
    switch (status) {
      case 'verified': return 'verified';
      case 'pending': return 'pending';
      case 'failed': return 'error';
      default: return 'help';
    }
  };

  const getStatusColor = (status: BlockchainCertificate['verificationStatus']) => {
    switch (status) {
      case 'verified': return Colors.success;
      case 'pending': return Colors.warning;
      case 'failed': return Colors.error;
      default: return Colors.neutral[400];
    }
  };

  const handleShareCertificate = async (certificate: BlockchainCertificate) => {
    try {
      await Share.share({
        message: `Check out my verified ${certificate.title} certificate on blockchain!\n\n🔗 ${certificate.shareableLink}\n\n✅ Verified on ${certificate.blockchainNetwork}\n📋 ID: ${certificate.credentialId}`,
        url: certificate.shareableLink,
        title: `${certificate.title} - Blockchain Verified Certificate`,
      });
      onShareCertificate?.(certificate.id);
    } catch (error) {
      console.log('Error sharing certificate:', error);
    }
  };

  const handleCopyHash = (hash: string, type: string) => {
    Clipboard.setString(hash);
    Alert.alert('Copied!', `${type} copied to clipboard`);
  };

  const handleVerifyOnBlockchain = (certificate: BlockchainCertificate) => {
    Alert.alert(
      'Verify on Blockchain',
      `This will open the blockchain explorer to verify the certificate on ${certificate.blockchainNetwork}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Verify', 
          onPress: () => {
            // Open blockchain explorer
            onVerifyCertificate?.(certificate.id);
          }
        },
      ]
    );
  };

  const filteredCertificates = certificates.filter(cert => 
    filterCategory === 'all' || cert.category === filterCategory
  );

  const renderTrustScore = () => (
    <View style={styles.trustScoreContainer}>
      <LinearGradient
        colors={[Colors.success, Colors.accent.emerald]}
        style={styles.trustScoreGradient}
      >
        <View style={styles.trustScoreContent}>
          <MaterialIcons name="verified-user" size={24} color="white" />
          <View>
            <Text style={styles.trustScoreValue}>{walletStats.trustScore}/100</Text>
            <Text style={styles.trustScoreLabel}>Trust Score</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderCertificate = (certificate: BlockchainCertificate) => (
    <TouchableOpacity
      key={certificate.id}
      style={styles.certificateCard}
      onPress={() => {
        setSelectedCertificate(certificate);
        setModalVisible(true);
      }}
    >
      <LinearGradient
        colors={[
          getCategoryColor(certificate.category),
          `${getCategoryColor(certificate.category)}80`
        ]}
        style={styles.certificateGradient}
      >
        <View style={styles.certificateContent}>
          <View style={styles.certificateHeader}>
            <View style={styles.certificateInfo}>
              <Text style={styles.certificateTitle}>{certificate.title}</Text>
              <Text style={styles.certificateIssuer}>{certificate.issuer}</Text>
            </View>
            
            <View style={styles.certificateStatus}>
              <MaterialIcons 
                name={getStatusIcon(certificate.verificationStatus)} 
                size={20} 
                color={getStatusColor(certificate.verificationStatus)} 
              />
            </View>
          </View>

          <View style={styles.certificateMetadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Network</Text>
              <View style={styles.networkInfo}>
                <Text style={styles.networkIcon}>{getNetworkIcon(certificate.blockchainNetwork)}</Text>
                <Text style={styles.networkName}>{certificate.blockchainNetwork.toUpperCase()}</Text>
              </View>
            </View>
            
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Level</Text>
              <View style={[
                styles.levelBadge,
                { backgroundColor: getLevelColor(certificate.level) }
              ]}>
                <Text style={styles.levelText}>{certificate.level.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.skillsPreview}>
            <Text style={styles.skillsLabel}>Skills:</Text>
            <View style={styles.skillsContainer}>
              {certificate.skills.slice(0, 3).map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
              {certificate.skills.length > 3 && (
                <Text style={styles.moreSkills}>+{certificate.skills.length - 3}</Text>
              )}
            </View>
          </View>

          <View style={styles.certificateActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShareCertificate(certificate)}
            >
              <MaterialIcons name="share" size={16} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleVerifyOnBlockchain(certificate)}
            >
              <MaterialIcons name="link" size={16} color={Colors.secondary[500]} />
              <Text style={styles.actionText}>Verify</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onAddToLinkedIn?.(certificate.id)}
            >
              <MaterialIcons name="work" size={16} color={Colors.accent.emerald} />
              <Text style={styles.actionText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
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
        <Text style={styles.headerTitle}>Skill Wallet</Text>
        <TouchableOpacity style={styles.walletButton}>
          <MaterialIcons name="account-balance-wallet" size={20} color={Colors.warning} />
          <Text style={styles.walletButtonText}>Web3</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Wallet Overview */}
      <Animated.View 
        style={[
          styles.walletOverview,
          {
            opacity: animatedValues.fadeIn,
            transform: [{ translateY: animatedValues.slideUp }],
          },
        ]}
      >
        <LinearGradient colors={[Colors.primary[500], Colors.secondary[500]]} style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View>
              <Text style={styles.walletTitle}>Digital Skill Wallet</Text>
              <Text style={styles.walletAddress}>0x742d35...1ebb5</Text>
            </View>
            {renderTrustScore()}
          </View>
          
          <View style={styles.walletStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{walletStats.totalCertificates}</Text>
              <Text style={styles.statLabel}>Certificates</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{walletStats.verifiedCertificates}</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{walletStats.totalSkills}</Text>
              <Text style={styles.statLabel}>Skills</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{walletStats.walletValue}</Text>
              <Text style={styles.statLabel}>Value</Text>
            </View>
          </View>
        </LinearGradient>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'ai', 'blockchain', 'product', 'fullstack', 'mobile'].map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                filterCategory === category && styles.activeFilterChip,
              ]}
              onPress={() => setFilterCategory(category)}
            >
              <Text style={[
                styles.filterChipText,
                filterCategory === category && styles.activeFilterChipText,
              ]}>
                {category === 'all' ? 'All Certificates' : category.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Certificates List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            {
              opacity: animatedValues.fadeIn,
              transform: [{ translateY: animatedValues.slideUp }],
            },
          ]}
        >
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map(renderCertificate)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="account-balance-wallet" size={64} color={Colors.neutral[400]} />
              <Text style={styles.emptyTitle}>No Certificates Found</Text>
              <Text style={styles.emptySubtitle}>
                Complete courses to earn blockchain-verified certificates.
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Certificate Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedCertificate && (
          <LinearGradient colors={[Colors.background.dark, Colors.background.tertiary]} style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.text.inverse} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Certificate Details</Text>
              <TouchableOpacity onPress={() => handleShareCertificate(selectedCertificate)}>
                <MaterialIcons name="share" size={20} color={Colors.primary[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.modalSection}>
                <LinearGradient
                  colors={[
                    getCategoryColor(selectedCertificate.category),
                    `${getCategoryColor(selectedCertificate.category)}40`
                  ]}
                  style={styles.certificatePreview}
                >
                  <MaterialIcons name="verified" size={48} color="white" />
                  <Text style={styles.previewTitle}>{selectedCertificate.title}</Text>
                  <Text style={styles.previewIssuer}>{selectedCertificate.issuer}</Text>
                  <Text style={styles.previewDate}>
                    Issued: {selectedCertificate.issueDate.toLocaleDateString()}
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Blockchain Details</Text>
                
                <View style={styles.blockchainDetails}>
                  <TouchableOpacity 
                    style={styles.hashRow}
                    onPress={() => handleCopyHash(selectedCertificate.blockchainHash, 'Blockchain Hash')}
                  >
                    <Text style={styles.hashLabel}>Blockchain Hash:</Text>
                    <View style={styles.hashValue}>
                      <Text style={styles.hashText}>{selectedCertificate.blockchainHash.slice(0, 20)}...</Text>
                      <MaterialIcons name="content-copy" size={16} color={Colors.neutral[400]} />
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.hashRow}
                    onPress={() => handleCopyHash(selectedCertificate.ipfsHash, 'IPFS Hash')}
                  >
                    <Text style={styles.hashLabel}>IPFS Hash:</Text>
                    <View style={styles.hashValue}>
                      <Text style={styles.hashText}>{selectedCertificate.ipfsHash.slice(0, 20)}...</Text>
                      <MaterialIcons name="content-copy" size={16} color={Colors.neutral[400]} />
                    </View>
                  </TouchableOpacity>

                  <View style={styles.networkDetails}>
                    <Text style={styles.networkDetailLabel}>Network:</Text>
                    <View style={styles.networkDetailValue}>
                      <Text style={styles.networkDetailIcon}>{getNetworkIcon(selectedCertificate.blockchainNetwork)}</Text>
                      <Text style={styles.networkDetailText}>{selectedCertificate.blockchainNetwork.toUpperCase()}</Text>
                    </View>
                  </View>

                  {selectedCertificate.gasUsed && (
                    <View style={styles.gasDetails}>
                      <Text style={styles.gasLabel}>Transaction Fee: {selectedCertificate.transactionFee}</Text>
                      <Text style={styles.gasValue}>Gas Used: {selectedCertificate.gasUsed}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Skills Verified</Text>
                <View style={styles.modalSkills}>
                  {selectedCertificate.skills.map((skill, index) => (
                    <View key={index} style={styles.modalSkillChip}>
                      <Text style={styles.modalSkillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Actions</Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => handleVerifyOnBlockchain(selectedCertificate)}
                  >
                    <MaterialIcons name="link" size={20} color={Colors.secondary[500]} />
                    <Text style={styles.modalActionText}>Verify on Blockchain</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => onAddToLinkedIn?.(selectedCertificate.id)}
                  >
                    <MaterialIcons name="work" size={20} color={Colors.accent.emerald} />
                    <Text style={styles.modalActionText}>Add to LinkedIn</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => {
                      // Open download link
                      Alert.alert('Download', 'Certificate will be downloaded');
                    }}
                  >
                    <MaterialIcons name="download" size={20} color={Colors.primary[500]} />
                    <Text style={styles.modalActionText}>Download PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
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
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  walletButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
  },
  walletOverview: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  walletCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'monospace',
  },
  trustScoreContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  trustScoreGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  trustScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trustScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  trustScoreLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  walletStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary[500],
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  certificateCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  certificateGradient: {
    padding: 2,
  },
  certificateContent: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  certificateIssuer: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  certificateStatus: {
    padding: 4,
  },
  certificateMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  metadataItem: {
    alignItems: 'center',
  },
  metadataLabel: {
    fontSize: 10,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  networkIcon: {
    fontSize: 12,
  },
  networkName: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  levelBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  skillsPreview: {
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
  certificateActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  actionText: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  modalSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  certificatePreview: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  previewIssuer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Spacing.sm,
  },
  previewDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.md,
  },
  blockchainDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  hashRow: {
    marginBottom: Spacing.md,
  },
  hashLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  hashValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  hashText: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontFamily: 'monospace',
  },
  networkDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  networkDetailLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  networkDetailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  networkDetailIcon: {
    fontSize: 14,
  },
  networkDetailText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  gasDetails: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  gasLabel: {
    fontSize: 11,
    color: Colors.text.tertiary,
    marginBottom: 2,
  },
  gasValue: {
    fontSize: 11,
    color: Colors.text.tertiary,
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
  modalActions: {
    gap: Spacing.md,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  modalActionText: {
    fontSize: 14,
    color: Colors.text.inverse,
    fontWeight: '500',
  },
});

export default SkillWalletScreen;
