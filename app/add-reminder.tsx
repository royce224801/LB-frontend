import { useRouter } from 'expo-router';
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

export default function AddReminderScreen() {
  const router = useRouter();
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  const handleSaveReminder = () => {
    if (!medicineName || !dosage || !time) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const reminderDetails = `Medicine: ${medicineName}\nDosage: ${dosage}\nTime: ${time}`;
    
    // In a real app, you'd save this to state or a database.
    // For now, we'll just show an alert and go back.
    Alert.alert('Reminder Saved (Mock)', reminderDetails, [
      { text: 'OK', onPress: () => router.back() } // Go back to the reminder list
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Add New Reminder</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Medicine Name (e.g., Paracetamol)"
              placeholderTextColor="#999"
              value={medicineName}
              onChangeText={setMedicineName}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage (e.g., 1 tablet)"
              placeholderTextColor="#999"
              value={dosage}
              onChangeText={setDosage}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 8:00 AM)"
              placeholderTextColor="#999"
              value={time}
              onChangeText={setTime}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveReminder}>
              <Text style={styles.buttonText}>Save Reminder</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Using the same modern styles as our other forms
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
    color: '#1c1c1e',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 55,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});