import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import API_BASE_URL from '../api-config';

export default function AddHealthLogScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [glucose, setGlucose] = useState('');

  const handleSaveLog = async () => {
    if (!userId || isNaN(Number(userId))) {
      Alert.alert('Error', 'User ID is invalid. Please log in again.');
      return;
    }
    if (!systolic || !diastolic || !glucose) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/health-logs/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { id: userId },
          systolic: parseInt(systolic, 10),
          diastolic: parseInt(diastolic, 10),
          glucose: parseInt(glucose, 10),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Health vitals logged successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        const errorText = await response.text();
        Alert.alert('Save Failed', errorText || 'An error occurred on the server.');
      }
    } catch (error) {
      console.error('Save Log Error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Log Health Vitals</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Blood Pressure</Text>
            <View style={styles.bpContainer}>
              <TextInput
                style={[styles.input, styles.bpInput]}
                placeholder="Systolic (e.g., 120)"
                placeholderTextColor="#B0B0B0"
                value={systolic}
                onChangeText={setSystolic}
                keyboardType="numeric"
              />
              <Text style={styles.divider}>/</Text>
              <TextInput
                style={[styles.input, styles.bpInput]}
                placeholder="Diastolic (e.g., 80)"
                placeholderTextColor="#B0B0B0"
                value={diastolic}
                onChangeText={setDiastolic}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.label}>Blood Glucose</Text>
            <TextInput
              style={styles.input}
              placeholder="Glucose (e.g., 100)"
              placeholderTextColor="#B0B0B0"
              value={glucose}
              onChangeText={setGlucose}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveLog}>
              <Text style={styles.buttonText}>Save Vitals</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#E0E0E0',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 8,
  },
  bpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bpInput: {
    flex: 1,
  },
  divider: {
    fontSize: 24,
    color: '#E0E0E0',
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#2C2C2C',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
    color: '#E0E0E0',
  },
  button: {
    backgroundColor: '#578FFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});