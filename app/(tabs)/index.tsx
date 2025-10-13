import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
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
import API_BASE_URL from '../../api-config';

export default function RegistrationScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Send data to the CORRECT backend path
      const response = await fetch(`${API_BASE_URL}/api/users/register`, { // <-- THE FIX IS HERE
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created. Please log in.',
        );
        setName('');
        setEmail('');
        setPassword('');
      } else {
        // Get the plain text error message from your backend
        const errorText = await response.text();
        Alert.alert('Registration Failed', errorText || 'An error occurred.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Network Error', 'Could not connect to the server. Please check your Wi-Fi.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Feather name="user-plus" size={40} color="#007AFF" />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your journey with LifeBridge.</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <Link href="/login" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>Already have an account? <Text style={styles.linkTextBold}>Sign In</Text></Text>
            </TouchableOpacity>
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
    button: { backgroundColor: '#34C759', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
    linkButton: { marginTop: 24, alignItems: 'center', paddingBottom: 20, },
    linkText: { color: '#8e8e93', fontSize: 14, },
    linkTextBold: { color: '#007AFF', fontWeight: 'bold', },
});