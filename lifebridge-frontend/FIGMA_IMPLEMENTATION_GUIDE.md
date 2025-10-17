# 🎨 Figma to React Native Implementation Guide

## 📋 Overview

This guide will help you implement your Figma design into the LifeBridge React Native app.

---

## 🚀 Step-by-Step Process

### Step 1: Prepare Your Figma File

#### 1.1 Export Assets
- **Images/Icons**: Export as PNG or SVG
  - Right-click on image → Export → Choose format
  - Recommended: PNG @2x and @3x for different screen densities
  - Or SVG for scalable icons

- **Icons**: Export as SVG for best quality
  - File → Export → SVG

#### 1.2 Get Design Specifications
- **Colors**: Copy hex codes from Figma
- **Typography**: Note font families, sizes, weights
- **Spacing**: Note margins, padding values
- **Dimensions**: Note component heights, widths

#### 1.3 Use Figma Inspect Mode
- Select any element in Figma
- Press **Ctrl/Cmd + C** to copy CSS properties
- Look at the right panel for dimensions, colors, etc.

---

### Step 2: Add Assets to Your Project

#### 2.1 Place Images
Put your exported images in:
```
frontend/lifebridge-frontend/assets/images/
```

Example structure:
```
assets/
├── images/
│   ├── logo.png
│   ├── logo@2x.png
│   ├── logo@3x.png
│   ├── banner.png
│   ├── doctor-icon.svg
│   └── ...
```

#### 2.2 Use Images in Code
```typescript
import { Image } from 'react-native';

// Local images
<Image 
  source={require('../assets/images/logo.png')} 
  style={{ width: 100, height: 100 }}
/>

// For SVG, install react-native-svg (already installed):
import { SvgUri } from 'react-native-svg';
```

---

### Step 3: Update Theme Colors

#### 3.1 Extract Colors from Figma
In Figma, note down all colors used:
- Primary color
- Secondary color
- Background colors
- Text colors
- Border colors
- etc.

#### 3.2 Update ThemeContext.tsx

Edit: `contexts/ThemeContext.tsx`

```typescript
const lightColors = {
  // Replace with your Figma colors
  background: '#F5F5F7',        // Your light background
  cardBackground: '#FFFFFF',     // Your card background
  text: '#1C1C1E',              // Your text color
  textSecondary: '#8E8E93',     // Your secondary text
  primary: '#578FFF',           // Your primary brand color
  success: '#34C759',           // Your success color
  warning: '#FFD700',           // Your warning color
  danger: '#FF4D4D',            // Your error color
  border: '#E5E5EA',            // Your border color
  
  // Add more colors from your Figma design
  accent: '#FF6B6B',            // Example
  highlight: '#FFE66D',         // Example
};

const darkColors = {
  // Adjust for dark mode
  background: '#1A1A1A',
  cardBackground: '#2C2C2C',
  text: '#E0E0E0',
  // ... etc
};
```

---

### Step 4: Create New Screen Based on Figma

#### 4.1 Create New Screen File

For example, if you designed a "Profile" screen:

```typescript
// app/profile.tsx
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/profile-icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.title}>Profile</Text>
      </View>
      
      {/* Add your Figma design components here */}
      
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
});
```

#### 4.2 Add Route to Navigation

Edit: `app/_layout.tsx`

```typescript
<Stack.Screen name="profile" options={{ headerShown: false }} />
```

---

### Step 5: Translate Figma Components to React Native

#### Common Figma → React Native Mappings:

| Figma Element | React Native Component |
|---------------|------------------------|
| Frame/Rectangle | `<View>` |
| Text | `<Text>` |
| Button | `<TouchableOpacity>` + `<Text>` |
| Image | `<Image>` |
| Input Field | `<TextInput>` |
| Scroll Area | `<ScrollView>` |
| List | `<FlatList>` |
| Icon | `<Ionicons>` or custom SVG |

#### Example Conversions:

**Figma Button → React Native**
```typescript
<TouchableOpacity 
  style={styles.button}
  onPress={() => console.log('Pressed')}
>
  <Text style={styles.buttonText}>Click Me</Text>
</TouchableOpacity>

// Styles from Figma
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#578FFF',  // From Figma
    paddingVertical: 15,         // From Figma
    paddingHorizontal: 30,       // From Figma
    borderRadius: 12,            // From Figma
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**Figma Card → React Native**
```typescript
<View style={styles.card}>
  <Text style={styles.cardTitle}>Card Title</Text>
  <Text style={styles.cardContent}>Card content here</Text>
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,  // For Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});
```

---

### Step 6: Handle Typography

#### 6.1 Match Fonts from Figma

If Figma uses custom fonts:

1. **Download font files** (.ttf or .otf)
2. **Place in:** `assets/fonts/`
3. **Load fonts:**

Edit: `app/_layout.tsx`

```typescript
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'CustomFont-Regular': require('../assets/fonts/CustomFont-Regular.ttf'),
    'CustomFont-Bold': require('../assets/fonts/CustomFont-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      {/* ... */}
    </ThemeProvider>
  );
}
```

4. **Use in styles:**

```typescript
{
  fontFamily: 'CustomFont-Regular',
  fontSize: 16,
}
```

---

### Step 7: Responsive Layout

#### 7.1 Get Screen Dimensions

```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,  // 90% of screen width
    height: height * 0.5, // 50% of screen height
  },
});
```

#### 7.2 Use Flexbox (like Figma Auto Layout)

```typescript
<View style={styles.container}>
  <View style={styles.row}>
    <Text>Item 1</Text>
    <Text>Item 2</Text>
  </View>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',          // Horizontal layout
    justifyContent: 'space-between', // Space between items
    alignItems: 'center',           // Center vertically
    gap: 10,                        // Space between children
  },
});
```

---

### Step 8: Add Animations (Optional)

If your Figma has interactive prototypes:

```typescript
import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);

<Animated.View style={{ opacity: fadeAnim }}>
  <Text>Fades in</Text>
</Animated.View>
```

---

## 📝 Example: Full Screen Implementation

Here's a complete example of implementing a Figma design:

```typescript
// app/new-screen.tsx
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity,
  Image,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NewScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - from Figma */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Screen Title</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Content - from Figma */}
      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={require('../assets/images/hero.png')}
            style={styles.heroImage}
          />
          <Text style={styles.heroTitle}>Welcome</Text>
          <Text style={styles.heroSubtitle}>Your health matters</Text>
        </View>

        {/* Cards Section */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="heart" size={40} color={colors.primary} />
            <Text style={styles.cardTitle}>Health Records</Text>
            <Text style={styles.cardDescription}>
              View your medical history
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Ionicons name="calendar" size={40} color={colors.success} />
            <Text style={styles.cardTitle}>Appointments</Text>
            <Text style={styles.cardDescription}>
              Schedule consultations
            </Text>
          </TouchableOpacity>
        </View>

        {/* Button - from Figma */}
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    width: '47%',
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 10,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## 🛠️ Useful Tools

### Figma Plugins:
1. **Design Tokens** - Export colors and typography
2. **Figma to Code** - Auto-generate React Native code
3. **Icon Generator** - Export icons in different sizes

### VS Code Extensions:
1. **React Native Tools** - Better development experience
2. **ES7+ React/Redux/React-Native snippets** - Code snippets

---

## 📏 Design Specifications Checklist

When reviewing your Figma design, note:

- [ ] Color palette (hex codes)
- [ ] Font families and weights
- [ ] Font sizes (heading, body, caption)
- [ ] Spacing values (margins, padding)
- [ ] Border radius values
- [ ] Shadow/elevation specifications
- [ ] Icon set used
- [ ] Image dimensions
- [ ] Button states (normal, hover, pressed)
- [ ] Screen breakpoints (if responsive)

---

## 🎯 Tips for Best Results

1. **Use Figma's Dev Mode** - Shows exact CSS values
2. **Component Names** - Name Figma layers clearly for easy reference
3. **Consistent Spacing** - Use 4px or 8px grid system
4. **Color Variables** - Use consistent color styles in Figma
5. **Export @2x and @3x** - For different screen densities
6. **Test on Device** - Always test on actual mobile devices

---

## 🔄 Workflow

```
Figma Design
    ↓
Export Assets & Specs
    ↓
Add to assets/ folder
    ↓
Update ThemeContext with colors
    ↓
Create/Update screen components
    ↓
Apply styles from Figma
    ↓
Test on device
    ↓
Iterate and refine
```

---

## 💡 Need Help?

**Share your Figma design with me:**
1. Open Figma file
2. Click "Share" button
3. Set to "Anyone with link can view"
4. Share the link

I can then help you:
- Extract colors and styles
- Create the component structure
- Write the React Native code
- Implement specific UI elements

---

## 📚 Additional Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [Figma Dev Mode](https://help.figma.com/hc/en-us/articles/360055203533)

---

**Ready to implement your design? Share your Figma link and I'll help you code it!** 🚀
