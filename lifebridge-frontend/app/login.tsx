import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet, Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import API_BASE_URL from '../api-config';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        Alert.alert('Success', `Welcome back, ${user.name}!`);
        router.replace(`/home?userId=${user.id}`);
      } else {
        const errorText = await response.text();
        Alert.alert('Login Failed', errorText || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
              <MaterialCommunityIcons 
                name={theme === 'dark' ? 'weather-sunny' : 'weather-night'} 
                size={24} 
                color={colors.primary} 
              />
            </TouchableOpacity>
            <MaterialCommunityIcons name="heart-pulse" size={50} color={colors.primary} />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your LifeBridge account.</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text></Text>
            </TouchableOpacity>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  keyboardAvoidingContainer: { 
    flex: 1, 
  },
  scrollViewContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 24, 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 40, 
  },
  themeToggle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: colors.text, 
    marginTop: 20, 
  },
  subtitle: { 
    fontSize: 16, 
    color: colors.textSecondary, 
    marginTop: 8, 
  },
  formContainer: { 
    width: '100%', 
  },
  input: { 
    backgroundColor: colors.surface, 
    height: 55, 
    borderRadius: 12, 
    marginBottom: 16, 
    paddingHorizontal: 16, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: colors.border, 
    color: colors.text,
  },
  button: { 
    backgroundColor: colors.primary, 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10, 
  },
  buttonText: { 
    color: colors.textInverse, 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  linkButton: { 
    marginTop: 24, 
    alignItems: 'center', 
    paddingBottom: 20, 
  },
  linkText: { 
    color: colors.textMuted, 
    fontSize: 14, 
  },
  linkTextBold: { 
    color: colors.primary, 
    fontWeight: 'bold', 
  },
});