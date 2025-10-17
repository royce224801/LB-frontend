# LifeBridge Mobile App 🏥

A comprehensive healthcare management application built with React Native and Expo.

## ✨ Latest Features (October 2025)

### 🤖 AI Health Assistant
- Intelligent chatbot that analyzes symptoms
- Recommends appropriate doctors based on 15+ medical specialties
- Real-time doctor availability checking
- Seamless appointment booking integration

### 🎨 Light/Dark Mode Toggle
- One-tap theme switching
- Persistent user preference
- Professional color schemes for both modes
- Reduces eye strain in low-light conditions

## 🚀 Get Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the app**

   ```bash
   npx expo start
   ```

3. **Open on your device**
   - Scan the QR code with Expo Go app
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## 📱 Features

- **Health Records Management** - Track and manage medical records
- **Medicine Reminders** - Never miss a dose
- **AI Health Assistant** - Get instant doctor recommendations ✨ NEW
- **Appointment Booking** - Schedule consultations with doctors
- **Health Vitals Logging** - Monitor blood pressure, heart rate, etc.
- **Health Statistics** - Visualize your health data
- **Doctor Management** - Admin features for managing doctors
- **Light/Dark Mode** - Comfortable viewing in any environment ✨ NEW

## 📚 Documentation

### For Users:
- **[QUICK_START.md](./QUICK_START.md)** - How to use new features
- **[NEW_FEATURES.md](./NEW_FEATURES.md)** - Detailed feature documentation

### For Developers:
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Testing guide

### Quick Reference:
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Complete summary

## 🛠️ Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - Navigation
- **AsyncStorage** - Local storage
- **React Context** - State management

## 🔧 Project Structure

```
app/
├── _layout.tsx           # Root layout with ThemeProvider
├── home.tsx              # Dashboard with theme toggle
├── ai-chatbot.tsx        # AI Health Assistant 🆕
├── login.tsx             # Authentication
├── doctor-consultation.tsx
├── health-records.tsx
└── ...other screens

contexts/
└── ThemeContext.tsx      # Theme management 🆕

constants/
└── theme.ts              # Theme colors

api-config.ts             # Backend API configuration
```

## 🎨 Theming

The app supports two themes:

- **Light Mode**: Clean, professional, easy on eyes in bright environments
- **Dark Mode**: Modern, reduces eye strain, battery-friendly

Toggle between themes using the sun/moon icon on the home screen.

## 🤖 AI Health Assistant

The chatbot understands symptoms and recommends specialists in:

- Cardiology (heart issues)
- Dermatology (skin problems)
- Orthopedics (bone/joint)
- Psychiatry (mental health)
- Gastroenterology (digestive)
- General Medicine (fever, cold)
- And 9 more specialties...

Simply describe your symptoms naturally, and the AI will guide you to the right doctor!

## 🔗 Backend Integration

Connects to Spring Boot backend API:
- Base URL: `http://192.168.1.2:8080`
- Endpoints: `/api/doctors`, `/api/appointments`, `/api/health-records`, etc.

## 📱 Running the App

### Development:
```bash
npm start
```

### Production Build:
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

## 🧪 Testing

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for comprehensive testing guide.

Quick tests:
- [ ] Theme toggle on home screen
- [ ] AI chatbot symptom analysis
- [ ] Doctor recommendations
- [ ] Appointment booking
- [ ] Health records CRUD

## 🌟 What's New in v2.0

### October 16, 2025 Release:

**Major Features:**
1. AI Health Assistant Chatbot
   - Symptom-based doctor recommendations
   - 15+ medical specialties covered
   - Natural language understanding
   - Real-time doctor availability

2. Light/Dark Mode
   - Global theme system
   - Persistent user preference
   - Dynamic color adaptation
   - Smooth theme transitions

**Technical Improvements:**
- Enhanced TypeScript support
- Better state management
- Improved navigation
- Comprehensive documentation

## 📄 License

This project is for educational and healthcare purposes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues or questions:
- Check the documentation in this repository
- Review the testing checklist
- Contact the development team

## 🎯 Roadmap

- [ ] Voice input for AI chatbot
- [ ] Multi-language support
- [ ] Wearable device integration
- [ ] Advanced health analytics
- [ ] Telemedicine features

---

**Built with ❤️ for better healthcare access**

**Latest Update**: October 16, 2025 - v2.0 with AI Assistant & Theming
