# SkillBoost - AI-Powered Startup Training Platform

<div align="center">
  <img src="./assets/icon.png" alt="SkillBoost Logo" width="120" height="120">
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.74.5-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-53.0.0-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
</div>

## 🚀 Overview

SkillBoost is a revolutionary React Native application designed to train startup employees in cutting-edge technologies including **AI**, **Blockchain**, and **Product Development**. Unlike traditional learning platforms, SkillBoost offers a complete ecosystem with AI-powered career guidance, internal job marketplace, and blockchain-verified certificates.

## ✨ Key Features

### 🎓 **Core Learning Platform**
- **Personalized Assessment**: AI-driven skill evaluation and learning path recommendations
- **Interactive Courses**: Comprehensive modules in AI, Blockchain, and Product Development
- **Progress Tracking**: Real-time analytics with streaks, XP points, and achievement levels
- **Gamification**: Badges, leaderboards, and daily challenges to boost engagement

### 🤖 **AI-Powered Career Mapping**
- **Smart Career Paths**: Machine learning algorithms suggest optimal career trajectories
- **Skill Gap Analysis**: Identify missing skills and get personalized recommendations
- **Salary Insights**: Real-time market data for different career paths
- **Company Matching**: AI-powered suggestions for companies aligned with your skills

### 💼 **Internal Job Marketplace**
- **Gig Board**: Internal project marketplace for skill-verified professionals
- **Smart Matching**: Algorithm-based project-to-candidate matching
- **Skill Verification**: Only certified learners can access premium opportunities
- **Application Tracking**: Complete workflow from application to project completion

### 🔐 **Blockchain Skill Wallet**
- **Multi-Chain Support**: Ethereum, Polygon, Binance Smart Chain, Solana
- **IPFS Storage**: Decentralized certificate storage for permanence
- **Trust Scoring**: Blockchain-based reputation system (0-100 scale)
- **Shareable Certificates**: Verifiable credentials for employers and clients

### 👥 **Community & Collaboration**
- **Peer Learning**: Community feed with knowledge sharing
- **Project Collaboration**: Team-based learning projects
- **Mentorship Program**: Connect with industry experts
- **Real-time Chat**: Built-in communication tools

### 📊 **Admin Dashboard**
- **Analytics & Reports**: Comprehensive learning analytics
- **Team Challenges**: Company-wide skill competitions
- **Progress Monitoring**: Track employee development
- **Custom Learning Paths**: Tailored training programs

## 🛠 Tech Stack

- **Frontend**: React Native with Expo SDK 53
- **Language**: TypeScript for type safety
- **Navigation**: Custom state-based navigation system
- **Styling**: Custom design system with consistent theming
- **Blockchain**: Web3 integration with multi-network support
- **Storage**: IPFS for decentralized certificate storage
- **AI/ML**: Machine learning algorithms for personalization

## 📱 Screenshots

<div align="center">
  <img src="./docs/screenshots/home.png" alt="Home Dashboard" width="250">
  <img src="./docs/screenshots/career-mapping.png" alt="Career Mapping" width="250">
  <img src="./docs/screenshots/skill-wallet.png" alt="Skill Wallet" width="250">
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shirshak001/Upskillx.git
   cd Upskillx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `w` for web browser
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 📂 Project Structure

```
upskillx/
├── components/           # Reusable UI components
│   ├── HomeDashboard.tsx
│   ├── CareerMappingScreen.tsx
│   ├── JobMarketplaceScreen.tsx
│   ├── SkillWalletScreen.tsx
│   └── ...
├── constants/           # Design system and constants
│   ├── Colors.ts
│   └── Design.ts
├── assets/             # Images and static assets
├── docs/              # Documentation and screenshots
├── App.tsx            # Main application component
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## 🎯 Core Components

### Navigation Flow
The app uses a state-based navigation system managing 25+ different screens:

```typescript
type AppState = 
  | 'splash' | 'welcome' | 'signup' | 'login' 
  | 'assessment' | 'personalization' | 'home'
  | 'careerMapping' | 'jobMarketplace' | 'skillWallet'
  // ... and more
```

### Key Screens

1. **HomeDashboard**: Central hub with progress tracking and navigation
2. **CareerMappingScreen**: AI-powered career path recommendations
3. **JobMarketplaceScreen**: Internal gig board with smart matching
4. **SkillWalletScreen**: Blockchain certificate management
5. **LearningPath**: Structured learning modules
6. **CommunityFeed**: Social learning features

## 🎨 Design System

### Color Palette
```typescript
Colors: {
  primary: { 500: '#6366F1', 600: '#4F46E5' },
  secondary: { 500: '#EC4899', 600: '#DB2777' },
  accent: {
    orange: '#F97316',
    emerald: '#10B981',
    purple: '#8B5CF6'
  }
}
```

### Typography & Spacing
- Consistent spacing system (xs: 4px, sm: 8px, md: 16px, lg: 24px)
- Typography scale with proper contrast ratios
- Responsive design for various screen sizes

## 🔗 Blockchain Integration

### Supported Networks
- **Ethereum**: Primary network for certificate storage
- **Polygon**: Low-cost transactions for frequent operations
- **Binance Smart Chain**: Alternative network support
- **Solana**: High-speed blockchain integration

### Certificate Structure
```typescript
interface Certificate {
  id: string;
  title: string;
  issuer: string;
  recipient: string;
  completedAt: Date;
  skills: string[];
  blockchainNetwork: 'ethereum' | 'polygon' | 'binance' | 'solana';
  txHash: string;
  ipfsHash: string;
  trustScore: number;
}
```

## 🤖 AI Features

### Career Path Algorithm
- **Skill Matching**: ML-based compatibility scoring
- **Market Analysis**: Real-time job market data integration
- **Progression Modeling**: Predictive career timeline generation
- **Salary Prediction**: Data-driven compensation insights

### Personalization Engine
- Learning style adaptation
- Content recommendation system
- Difficulty adjustment algorithms
- Progress optimization

## 📊 Analytics & Metrics

### User Progress Tracking
- Daily/weekly/monthly progress metrics
- Skill acquisition tracking
- Learning streak monitoring
- Achievement system

### Admin Analytics
- Team performance dashboards
- Learning completion rates
- Skill gap analysis
- ROI tracking for training programs

## 🔐 Security & Privacy

- **Data Encryption**: End-to-end encryption for sensitive data
- **Blockchain Security**: Immutable certificate records
- **Privacy Controls**: User-controlled data sharing
- **GDPR Compliance**: Privacy-first design approach

## 🚦 Development Workflow

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run eject      # Eject from Expo (use with caution)
```

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Consistent component architecture

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

### Q4 2025
- [ ] Advanced AI mentor system
- [ ] VR/AR learning modules
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

### Q1 2026
- [ ] Enterprise SSO integration
- [ ] White-label solutions
- [ ] Advanced blockchain features
- [ ] Mobile app store deployment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Team

- **Lead Developer**: [Shirshak](https://github.com/shirshak001)
- **Contributors**: Open to community contributions

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/shirshak001/Upskillx/issues)
- **Documentation**: [Wiki](https://github.com/shirshak001/Upskillx/wiki)
- **Email**: support@skillboost.app

## 🌟 Acknowledgments

- React Native community for excellent documentation
- Expo team for seamless development experience
- Open source contributors and early adopters

---

<div align="center">
  <strong>Built with ❤️ for the future of workplace learning</strong>
  
  [Website](https://skillboost.app) • [Demo](https://demo.skillboost.app) • [Documentation](https://docs.skillboost.app)
</div>
- **Pink**: `#EC4899` - Gamification elements

### Neutral Palette
- **Light**: `#F8FAFC` to `#E2E8F0`
- **Medium**: `#94A3B8` to `#64748B`  
- **Dark**: `#334155` to `#0F172A`

## 🚀 Features

### Splash Screen
- ✅ Modern gradient background with primary brand colors
- ✅ Animated logo with rotation effect
- ✅ Brand tagline: "Empowering India's Next-Gen Workforce"
- ✅ Skill indicators: AI • Blockchain • Product Skills
- ✅ Smooth progress bar animation
- ✅ Floating particle effects
- ✅ 2-3 second duration with brand intro animation

### Welcome Screen
- ✅ Sign up / Log in options with modern UI
- ✅ Value proposition: "Upskill in AI, Blockchain, Product skills with gamified learning"
- ✅ Feature highlights with proper icons (no emojis)
  - AI & Machine Learning with brain/smart-toy icon
  - Blockchain Technology with bank/balance icon  
  - Product Skills with trending-up icon
- ✅ Gradient action buttons with smooth animations
- ✅ Guest browsing option
- ✅ Social login placeholders (Google, LinkedIn)
- ✅ Trust indicators with stats (10K+ Learners, 50+ Courses, 95% Success Rate)
- ✅ Consistent color palette and design system

### Login / Signup Screens
- ✅ **Multiple Authentication Options**:
  - Email/Password with validation
  - Google OAuth integration ready
  - LinkedIn OAuth integration ready
  - GitHub OAuth integration ready
- ✅ **Company Onboarding Features**:
  - Company invite code support
  - Company domain email detection
  - Auto-switching between individual/company signup
  - Company benefits information display
- ✅ **User Experience**:
  - Form validation with helpful error messages
  - Password visibility toggle
  - Loading states and animations
  - Smooth navigation between login/signup
  - Forgot password functionality
  - Remember me / auto-login ready
- ✅ **Security Features**:
  - Password strength validation (min 6 characters)
  - Email format validation
  - Company domain verification system
  - Secure input handling

### Upcoming Features
- 🔄 Course dashboard and learning modules
- 🔄 Interactive training content (AI, Blockchain, Product)
- 🔄 Gamified challenges and rewards system
- 🔄 Progress tracking and analytics
- 🔄 Certification system with digital badges
- 🔄 User profiles and leaderboards
- 🔄 Offline learning capabilities
- 🔄 Push notifications for learning reminders
- 🔄 Team collaboration features for companies

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Animations**: React Native Animated API
- **UI Components**: Custom design system
- **Icons**: Expo Vector Icons (Material Icons)
- **Gradients**: expo-linear-gradient

## 📱 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Expo Go app on your mobile device

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd upskillx
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## 🎯 Target Audience

- Startup employees and teams
- Tech professionals seeking upskilling
- Students and fresh graduates
- Career changers entering tech
- Organizations wanting to train their workforce

## 📚 Learning Modules

### AI & Machine Learning
- Introduction to AI/ML concepts
- Python for data science
- Machine learning algorithms
- Deep learning fundamentals
- AI ethics and best practices

### Blockchain Technology
- Blockchain fundamentals
- Cryptocurrency and DeFi
- Smart contracts development
- Web3 technologies
- NFTs and digital assets

### Product Skills
- Product management fundamentals
- User experience (UX) design
- Data-driven decision making
- Agile methodologies
- Product analytics

## 🏆 Gamification Elements

- **Progress Tracking**: Visual progress bars and milestones
- **Achievements**: Badges for completing modules and challenges
- **Leaderboards**: Compete with peers and colleagues
- **Streaks**: Daily learning streaks and consistency rewards
- **Certificates**: Digital certificates for course completion

## 🎨 Design System

### Colors
Located in `constants/Colors.ts` with comprehensive color palette including:
- Primary and secondary brand colors
- Accent colors for different skill areas
- Semantic colors for states (success, warning, error)
- Neutral grays for text and backgrounds

### Typography
Located in `constants/Design.ts` with:
- Font sizes from xs (12px) to 6xl (64px)
- Font weights from thin to black
- Line heights and letter spacing

### Spacing & Layout
- Consistent spacing scale (4px base unit)
- Border radius utilities
- Shadow presets for depth

## 📁 Project Structure

```
upskillx/
├── App.tsx                 # Main application with complete navigation flow
├── components/             # Reusable UI components
│   ├── SplashScreen.tsx   # Animated splash screen
│   ├── WelcomeScreen.tsx  # Welcome/onboarding screen
│   ├── SignUpScreen.tsx   # Enhanced registration with company features
│   ├── LoginScreen.tsx    # Complete login with social auth options
│   └── CompanyDomainScreen.tsx # Company domain verification
├── constants/             # Design tokens and constants
│   ├── Colors.ts         # Modern color palette
│   └── Design.ts         # Typography, spacing, shadows
├── assets/               # Images, icons, fonts
└── package.json         # Dependencies and scripts
```

## 🤝 Contributing

This project is designed to help upskill India's next-generation workforce. Contributions are welcome!

## 📄 License

MIT License - see LICENSE file for details

---

**Made with ❤️ for India's startup ecosystem**
