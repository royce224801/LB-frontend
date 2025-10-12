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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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
        // --- KEY CHANGES START HERE ---

        // 1. Get the user data from the backend's response
        const user = await response.json(); 

        // 2. Show a personalized welcome message
        Alert.alert('Success', `Welcome back, ${user.name}!`);

        // 3. Navigate to the home screen and pass the user's ID
        //    This is how other screens will know who is logged in.
        router.replace(`/home?userId=${user.id}`); 
        
        // --- KEY CHANGES END HERE ---
        
      } else {
        const errorText = await response.text();
        Alert.alert('Login Failed', errorText || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    }
  };

  return (
    // ... all your JSX UI code remains exactly the same ...
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="heart-pulse" size={50} color="#007AFF" />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your LifeBridge account.</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry/>
            <TouchableOpacity style={styles.button} onPress={handleLogin}><Text style={styles.buttonText}>Sign In</Text></TouchableOpacity>
          </View>
          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.linkButton}><Text style={styles.linkText}>Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text></Text></TouchableOpacity>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// STYLES remain the same
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7', },
    keyboardAvoidingContainer: { flex: 1, },
    scrollViewContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, },
    header: { alignItems: 'center', marginBottom: 40, },
    title: { fontSize: 32, fontWeight: '700', color: '#1c1c1e', marginTop: 20, },
    subtitle: { fontSize: 16, color: '#8e8e93', marginTop: 8, },
    formContainer: { width: '100%', },
    input: { backgroundColor: '#FFFFFF', height: 55, borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: '#EFEFEF', },
    button: { backgroundColor: '#007AFF', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
    linkButton: { marginTop: 24, alignItems: 'center', paddingBottom: 20, },
    linkText: { color: '#8e8e93', fontSize: 14, },
    linkTextBold: { color: '#007AFF', fontWeight: 'bold', },
});