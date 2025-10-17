0# 🧪 Testing Checklist - New Features

## Pre-Testing Setup

- [ ] Backend server is running on `http://192.168.1.2:8080`
- [ ] Frontend app is started with `npm start`
- [ ] At least one doctor exists in the database
- [ ] At least one doctor is marked as available
- [ ] Device/Emulator has internet connection
- [ ] App is installed via Expo Go

---

## 🎨 Theme Toggle Testing

### Initial State
- [ ] App opens in dark mode by default (or last saved preference)
- [ ] Home screen displays correctly
- [ ] All colors are properly themed

### Toggle to Light Mode
- [ ] Navigate to Home/Dashboard screen
- [ ] Locate theme toggle button (top-right corner)
- [ ] Button shows moon 🌙 icon (in dark mode)
- [ ] Tap the theme toggle button
- [ ] Theme changes instantly to light mode
- [ ] Button icon changes to sun 🌞
- [ ] Background changes to light gray (#F5F5F7)
- [ ] Cards change to white (#FFFFFF)
- [ ] Text changes to dark (#1C1C1E)
- [ ] All UI elements are readable

### Toggle Back to Dark Mode
- [ ] Tap the sun icon
- [ ] Theme changes instantly to dark mode
- [ ] Button icon changes to moon 🌙
- [ ] Background changes to dark (#1A1A1A)
- [ ] Cards change to charcoal (#2C2C2C)
- [ ] Text changes to light (#E0E0E0)
- [ ] All UI elements are readable

### Persistence Test
- [ ] Set theme to Light mode
- [ ] Close the app completely (swipe away)
- [ ] Reopen the app
- [ ] App opens in Light mode ✅
- [ ] Set theme to Dark mode
- [ ] Close the app completely
- [ ] Reopen the app
- [ ] App opens in Dark mode ✅

### Navigation Test
- [ ] In Light mode, navigate to different screens
- [ ] Return to home - still in Light mode
- [ ] In Dark mode, navigate to different screens
- [ ] Return to home - still in Dark mode

---

## 🤖 AI Health Assistant Testing

### Access Test
- [ ] Home screen displays "AI Health Assistant" menu item
- [ ] Menu item is at the top (featured)
- [ ] Has chat bubble icon 💬
- [ ] Has sparkle icon ✨
- [ ] Shows subtext "Get doctor recommendations"
- [ ] Has special border/styling
- [ ] Tap menu item
- [ ] AI chatbot screen opens

### UI Components Test
- [ ] Header shows "AI Health Assistant"
- [ ] Back button is visible and functional
- [ ] Initial greeting message appears
- [ ] Bot avatar (medical icon) is visible
- [ ] Input field at bottom
- [ ] Send button is present
- [ ] Send button is disabled when input is empty

### Greeting Message Test
- [ ] Bot sends welcome message automatically
- [ ] Message explains the assistant's purpose
- [ ] Message asks user to describe symptoms
- [ ] Message appears in bot bubble (gray/dark card)

### Symptom Analysis Test - Cardiology
- [ ] Type: "I have chest pain and shortness of breath"
- [ ] Tap Send button
- [ ] Message appears in user bubble (blue)
- [ ] Bot shows typing indicator (with "Analyzing...")
- [ ] Bot responds within 2 seconds
- [ ] Bot recommends Cardiologist
- [ ] Shows available doctors with Cardiology specialty
- [ ] Shows doctor name, specialty, and availability

### Symptom Analysis Test - Dermatology
- [ ] Type: "skin rash and itching"
- [ ] Bot recommends Dermatologist
- [ ] Shows relevant doctors

### Symptom Analysis Test - Gastroenterology
- [ ] Type: "stomach pain and nausea"
- [ ] Bot recommends Gastroenterologist
- [ ] Shows relevant doctors

### Symptom Analysis Test - Psychiatry
- [ ] Type: "feeling anxious and depressed"
- [ ] Bot recommends Psychiatrist
- [ ] Shows relevant doctors

### Symptom Analysis Test - General Medicine
- [ ] Type: "fever and cough"
- [ ] Bot recommends General Medicine doctor
- [ ] Shows relevant doctors

### Symptom Analysis Test - Orthopedics
- [ ] Type: "knee pain and joint issues"
- [ ] Bot recommends Orthopedic doctor
- [ ] Shows relevant doctors

### Symptom Analysis Test - Multiple Keywords
- [ ] Type: "chest pain, breathing difficulty, and heart palpitations"
- [ ] Bot correctly identifies Cardiology
- [ ] Scores symptoms appropriately

### No Match Test
- [ ] Type random text: "xyz abc random"
- [ ] Bot handles gracefully
- [ ] Suggests General Medicine or shows all available doctors

### Long Symptom Description
- [ ] Type detailed paragraph about symptoms
- [ ] Bot analyzes correctly
- [ ] Recommendations are relevant

### Chat Flow Test
- [ ] Multiple messages display correctly
- [ ] Scroll works smoothly
- [ ] New messages auto-scroll to bottom
- [ ] Old messages remain visible above

### Quick Action Test
- [ ] After bot recommends doctors
- [ ] "Book Appointment" button appears at bottom
- [ ] Tap the button
- [ ] Redirects to Doctor Consultation page
- [ ] Can navigate back to chatbot

### Input Field Test
- [ ] Can type multiple lines
- [ ] Text wraps properly
- [ ] Max height respects limits
- [ ] Placeholder text visible when empty
- [ ] Clears after sending

### Send Button Test
- [ ] Disabled (gray) when input is empty
- [ ] Enabled (blue) when text is entered
- [ ] Shows send icon ➤
- [ ] Tappable when enabled
- [ ] Not tappable when disabled

### Back Button Test
- [ ] Tap back button
- [ ] Returns to Home screen
- [ ] No crashes
- [ ] Home screen displays correctly

### Keyboard Test
- [ ] Typing opens keyboard
- [ ] Input field moves above keyboard
- [ ] Messages remain visible
- [ ] Keyboard closes when tapping outside
- [ ] Send button accessible with keyboard open

---

## 🔄 Integration Testing

### Theme + AI Chatbot
- [ ] Open AI chatbot in Light mode
- [ ] Switch to Dark mode on home
- [ ] Return to AI chatbot
- [ ] Verify chatbot respects dark theme (not implemented yet, but home does)

### Doctor Availability Integration
- [ ] Mark all doctors as unavailable (via admin)
- [ ] Open AI chatbot
- [ ] Describe symptoms
- [ ] Bot handles "no available doctors" gracefully
- [ ] Mark doctor as available again
- [ ] Refresh or reopen chatbot
- [ ] Bot shows newly available doctor

### Navigation Flow
- [ ] Home → AI Chatbot → Back → Home ✅
- [ ] Home → AI Chatbot → Book Appointment → Doctor Consultation ✅
- [ ] Home → AI Chatbot → Book Appointment → Book Appointment Flow ✅

### Multi-User Test
- [ ] Login as User 1
- [ ] Set theme to Light
- [ ] Use AI chatbot
- [ ] Logout
- [ ] Login as User 2
- [ ] Theme is Dark (or User 2's preference)
- [ ] Use AI chatbot
- [ ] Separate theme preferences work

---

## 📱 Device Testing

### iOS Testing
- [ ] Theme toggle works
- [ ] Icons display correctly
- [ ] AI chatbot works
- [ ] Keyboard behavior correct
- [ ] Navigation smooth

### Android Testing
- [ ] Theme toggle works
- [ ] Icons display correctly
- [ ] AI chatbot works
- [ ] Keyboard behavior correct
- [ ] Navigation smooth

---

## ⚡ Performance Testing

### Theme Toggle Performance
- [ ] Toggle happens instantly (< 100ms)
- [ ] No lag or stutter
- [ ] Smooth visual transition
- [ ] No memory leaks after multiple toggles

### AI Chatbot Performance
- [ ] Messages render quickly
- [ ] Scroll is smooth
- [ ] No lag when typing
- [ ] Bot response time < 2 seconds
- [ ] Multiple messages don't slow down app

---

## 🐛 Edge Cases

### Empty States
- [ ] No doctors in database
- [ ] All doctors unavailable
- [ ] Network error
- [ ] Invalid symptom input

### Boundary Cases
- [ ] Very long symptom description (500 chars)
- [ ] Single word symptom
- [ ] Special characters in symptoms
- [ ] Emoji in symptom description
- [ ] Numbers in symptom description

### Rapid Actions
- [ ] Toggle theme rapidly 10 times
- [ ] Send multiple messages quickly
- [ ] Tap buttons multiple times rapidly
- [ ] Navigate back and forth quickly

---

## ✅ Acceptance Criteria

### Must Pass:
- ✅ Theme toggle works on home screen
- ✅ Theme persists after app restart
- ✅ AI chatbot opens from home screen
- ✅ Bot analyzes at least 5 specialty types correctly
- ✅ Only available doctors are shown
- ✅ Messages display correctly
- ✅ Navigation works properly
- ✅ No crashes or errors
- ✅ Backend unchanged (no new APIs needed)

### Nice to Have:
- ⭐ Smooth animations
- ⭐ Professional UI/UX
- ⭐ Fast response times
- ⭐ Helpful error messages
- ⭐ Intuitive user experience

---

## 📊 Test Results Template

```
Test Date: _______________
Tester: _______________
Device: _______________
OS Version: _______________

Theme Toggle: ☐ Pass ☐ Fail
AI Chatbot: ☐ Pass ☐ Fail
Integration: ☐ Pass ☐ Fail
Performance: ☐ Pass ☐ Fail
Edge Cases: ☐ Pass ☐ Fail

Issues Found:
1. _______________
2. _______________
3. _______________

Overall Status: ☐ Approved ☐ Needs Fixes
```

---

## 🎯 Critical Tests (Must Pass)

1. **Theme Toggle on Home Screen** ⚠️ CRITICAL
2. **Theme Persistence After Restart** ⚠️ CRITICAL
3. **AI Chatbot Opens and Displays** ⚠️ CRITICAL
4. **Bot Recommends Correct Specialty** ⚠️ CRITICAL
5. **Only Available Doctors Shown** ⚠️ CRITICAL
6. **Back Navigation Works** ⚠️ CRITICAL
7. **No Crashes or Freezes** ⚠️ CRITICAL

---

## 📝 Notes

- Test in both Light and Dark modes
- Test with different user accounts
- Test with different symptom types
- Test on different devices/screen sizes
- Report any visual inconsistencies
- Note any performance issues
- Document all crashes with steps to reproduce

---

**Last Updated**: October 16, 2025
**Test Plan Version**: 1.0
