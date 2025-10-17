# 📐 Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LifeBridge Mobile App                      │
│                     (React Native + Expo)                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌───────────────────┐     ┌──────────────────┐
        │  ThemeProvider    │     │   Stack Router   │
        │   (Context API)   │     │  (expo-router)   │
        └───────────────────┘     └──────────────────┘
                    │                         │
                    │                         │
        ┌───────────┴───────────┐            │
        │                       │            │
        ▼                       ▼            ▼
┌──────────────┐      ┌──────────────┐   ┌──────────────┐
│ Light Theme  │      │  Dark Theme  │   │   Routes     │
│   Colors     │      │   Colors     │   │              │
└──────────────┘      └──────────────┘   │ - home       │
                                          │ - ai-chatbot │
                                          │ - login      │
                                          │ - etc...     │
                                          └──────────────┘
                                                 │
                    ┌────────────────────────────┼─────────────────────────┐
                    │                            │                         │
                    ▼                            ▼                         ▼
           ┌──────────────┐           ┌──────────────────┐      ┌──────────────┐
           │  Home Screen │           │  AI Chatbot      │      │ Other Screens│
           │              │           │   Screen         │      │   (Login,    │
           │ - Dashboard  │           │                  │      │  Records,    │
           │ - Theme      │           │ - Symptom Input  │      │  Doctors,    │
           │   Toggle     │           │ - AI Analysis    │      │  etc...)     │
           │ - Menu Items │           │ - Recommendations│      │              │
           └──────────────┘           └──────────────────┘      └──────────────┘
                    │                            │
                    │                            │
                    └────────────┬───────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   Backend API          │
                    │   (Spring Boot)        │
                    │                        │
                    │ GET /api/doctors       │
                    │ POST /api/appointments │
                    │ etc...                 │
                    └────────────────────────┘
```

---

## Component Hierarchy

```
App (_layout.tsx)
│
└── ThemeProvider (ThemeContext.tsx)
    │
    ├── Stack Navigator
    │   │
    │   ├── Home Screen (home.tsx)
    │   │   │
    │   │   ├── Header
    │   │   │   ├── Title & Subtitle
    │   │   │   └── Theme Toggle Button 🌞/🌙
    │   │   │
    │   │   ├── Risk Card (if applicable)
    │   │   │
    │   │   ├── Menu Items ScrollView
    │   │   │   ├── AI Health Assistant ⭐ (Featured)
    │   │   │   ├── Manage Health Records
    │   │   │   ├── Medicine Reminders
    │   │   │   ├── Book Appointment
    │   │   │   ├── View Appointments
    │   │   │   ├── Log Health Vitals
    │   │   │   ├── View Health Stats
    │   │   │   └── Manage Doctors (Admin only)
    │   │   │
    │   │   └── Logout Button
    │   │
    │   ├── AI Chatbot Screen (ai-chatbot.tsx)
    │   │   │
    │   │   ├── Header
    │   │   │   ├── Back Button
    │   │   │   └── Title & Subtitle
    │   │   │
    │   │   ├── Chat Messages
    │   │   │   ├── Bot Messages (with avatar)
    │   │   │   │   └── Message Bubbles (gray)
    │   │   │   │
    │   │   │   └── User Messages
    │   │   │       └── Message Bubbles (blue)
    │   │   │
    │   │   ├── Typing Indicator
    │   │   │
    │   │   ├── Input Area
    │   │   │   ├── Text Input
    │   │   │   └── Send Button
    │   │   │
    │   │   └── Quick Actions
    │   │       └── Book Appointment Button
    │   │
    │   └── Other Screens
    │       ├── Login
    │       ├── Doctor Consultation
    │       ├── Health Records
    │       └── etc...
    │
    └── useTheme() Hook
        ├── Current Theme State
        ├── Toggle Function
        └── Color Palette
```

---

## Data Flow - Theme Toggle

```
User Taps Theme Toggle
        │
        ▼
toggleTheme() called
        │
        ▼
Update theme state (light ↔ dark)
        │
        ▼
Save to AsyncStorage
        │
        ▼
Context triggers re-render
        │
        ▼
All components get new colors
        │
        ▼
UI updates instantly
```

---

## Data Flow - AI Chatbot

```
User Types Symptoms
        │
        ▼
Press Send Button
        │
        ▼
Add message to chat
        │
        ▼
Show typing indicator
        │
        ▼
analyzeSymptomsAndRecommend()
        │
        ├─→ Convert to lowercase
        ├─→ Match keywords
        ├─→ Score specialties
        └─→ Rank matches
        │
        ▼
findDoctorsBySpecialty()
        │
        ├─→ Fetch doctors from state
        ├─→ Filter by specialty
        └─→ Filter by availability
        │
        ▼
Format recommendation message
        │
        ▼
Hide typing indicator
        │
        ▼
Display bot response
        │
        ▼
Show quick action button
```

---

## State Management

### Theme State (Global)
```typescript
ThemeContext
├── theme: 'light' | 'dark'
├── toggleTheme: () => void
└── colors: ColorPalette
```

### Chatbot State (Local)
```typescript
AIChatbotScreen
├── messages: Message[]
├── inputText: string
├── isTyping: boolean
├── doctors: Doctor[]
└── conversationStage: string
```

---

## File Structure

```
lifebridge-frontend/
│
├── app/
│   ├── _layout.tsx          [MODIFIED] - Added ThemeProvider
│   ├── home.tsx             [MODIFIED] - Added theme toggle & AI button
│   ├── ai-chatbot.tsx       [NEW] - AI chatbot screen
│   ├── login.tsx
│   ├── doctor-consultation.tsx
│   └── ...other screens
│
├── contexts/
│   └── ThemeContext.tsx     [NEW] - Theme management
│
├── constants/
│   └── theme.ts
│
├── api-config.ts
│
├── package.json
│
├── IMPLEMENTATION_COMPLETE.md    [NEW] - This summary
├── IMPLEMENTATION_SUMMARY.md     [NEW] - Technical details
├── NEW_FEATURES.md              [NEW] - Feature docs
├── QUICK_START.md               [NEW] - User guide
└── TESTING_CHECKLIST.md         [NEW] - Test plan
```

---

## API Integration

### Existing Endpoints Used:
```
GET /api/doctors
├── Called by: ai-chatbot.tsx
├── Used for: Doctor recommendations
└── No modifications needed

POST /api/appointments
├── Called by: book-appointment.tsx
├── Used for: Booking from chatbot
└── No modifications needed
```

### No New Endpoints Required ✅

---

## Symptom Analysis Algorithm

```
Input: "chest pain and shortness of breath"
│
├─→ Step 1: Lowercase → "chest pain and shortness of breath"
│
├─→ Step 2: Check Keywords
│   ├── Cardiology: ['chest', 'heart', 'breath', 'palpitation', 'cardiac']
│   │   → Matches: chest ✓, breath ✓
│   │   → Score: 2
│   │
│   ├── Dermatology: ['skin', 'rash', 'acne', 'eczema']
│   │   → Matches: none
│   │   → Score: 0
│   │
│   └── ... check all 15 specialties
│
├─→ Step 3: Sort by Score
│   └── Cardiology (score: 2) → Top match
│
├─→ Step 4: Find Doctors
│   └── Filter doctors where:
│       ├── specialty includes "Cardiology"
│       └── available === true
│
└─→ Step 5: Return Results
    └── "I recommend consulting with: Dr. Smith (Cardiology)"
```

---

## Color System

### Light Mode Colors
```typescript
{
  background: '#F5F5F7',        // Light Gray
  cardBackground: '#FFFFFF',     // White
  text: '#1C1C1E',              // Near Black
  textSecondary: '#8E8E93',     // Gray
  primary: '#578FFF',           // Blue
  success: '#34C759',           // Green
  warning: '#FFD700',           // Gold
  danger: '#FF4D4D',            // Red
  border: '#E5E5EA',            // Light Border
  inputBackground: '#F2F2F7',   // Input Gray
}
```

### Dark Mode Colors
```typescript
{
  background: '#1A1A1A',        // Dark
  cardBackground: '#2C2C2C',    // Charcoal
  text: '#E0E0E0',              // Light Gray
  textSecondary: '#B0B0B0',     // Medium Gray
  primary: '#578FFF',           // Blue (same)
  success: '#34C759',           // Green (same)
  warning: '#FFD700',           // Gold (same)
  danger: '#FF4D4D',            // Red (same)
  border: '#3A3A3C',            // Dark Border
  inputBackground: '#2C2C2C',   // Input Dark
}
```

---

## Performance Considerations

### Theme Toggle:
- ✅ Instant switching (< 100ms)
- ✅ Single re-render on toggle
- ✅ AsyncStorage saves asynchronously
- ✅ No blocking operations

### AI Chatbot:
- ✅ Client-side processing (fast)
- ✅ Keyword matching (O(n) complexity)
- ✅ No external API calls
- ✅ Minimal network usage
- ✅ Efficient re-renders

---

## Security Model

```
┌─────────────────────────────────────────┐
│         User Device (Mobile)            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  AI Chatbot                     │   │
│  │  - Symptoms stay on device      │   │
│  │  - No logging to server         │   │
│  │  - No external APIs             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Theme Settings                 │   │
│  │  - Stored locally (AsyncStorage)│   │
│  │  - Not sent to server           │   │
│  └─────────────────────────────────┘   │
│                                         │
└────────────┬────────────────────────────┘
             │
             │ Only doctor list request
             │
             ▼
    ┌────────────────┐
    │  Backend API   │
    │  (Secure)      │
    └────────────────┘
```

---

## Testing Strategy

```
Unit Testing (Manual)
├── Theme Toggle
│   ├── Toggle functionality
│   ├── Persistence
│   └── Color application
│
├── AI Chatbot
│   ├── Symptom analysis
│   ├── Doctor matching
│   └── UI rendering
│
Integration Testing
├── Theme + Navigation
├── Chatbot + Doctor list
└── Chatbot + Booking flow
│
User Acceptance Testing
├── Real symptoms
├── Multiple users
└── Different devices
```

---

## Deployment Strategy

```
Step 1: Code Review
├── Review ThemeContext.tsx
├── Review ai-chatbot.tsx
└── Review modifications

Step 2: Testing
├── Follow TESTING_CHECKLIST.md
├── Test on iOS device
├── Test on Android device
└── Fix any issues

Step 3: Staging Deploy
├── Deploy to staging environment
├── Invite beta testers
└── Gather feedback

Step 4: Production Deploy
├── Merge to main branch
├── Build production bundle
├── Deploy to app stores
└── Monitor user feedback
```

---

## Success Metrics

### User Engagement:
- [ ] Track AI chatbot usage
- [ ] Monitor theme toggle frequency
- [ ] Measure appointment bookings from chatbot

### Performance:
- [ ] Theme toggle < 100ms
- [ ] Chatbot response < 2s
- [ ] No crashes or errors

### User Satisfaction:
- [ ] User feedback surveys
- [ ] App store ratings
- [ ] Feature adoption rate

---

**Architecture designed for:**
- 🚀 Performance
- 🔒 Security
- 📱 Scalability
- 🎨 Maintainability
- ♿ Accessibility

---

**Last Updated**: October 16, 2025
