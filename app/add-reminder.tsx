import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function AddReminderScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowPicker(false);
    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };

  const handleSaveReminder = async () => {
    if (!userId || isNaN(Number(userId))) {
      Alert.alert('Error', 'User ID is invalid. Please log in again.');
      return;
    }
    if (!medicineName || !dosage) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const timeString = reminderTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/reminders/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { id: userId },
          medicineName,
          dosage,
          reminderTime: timeString,
          isActive: true,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Reminder saved successfully!', [
          {
            text: 'OK',
            onPress: () => router.replace({
              pathname: '/medicine-reminder',
              params: { userId: Number(userId) },
            }),
          },
        ]);
      } else {
        const errorText = await response.text();
        Alert.alert('Save Failed', errorText || 'An error occurred on the server.');
      }
    } catch (error) {
      console.error('Save Reminder Error:', error);
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
            <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
              <Text style={{ color: '#000', fontSize: 16 }}>
                {reminderTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </Text>
            </TouchableOpacity>
            
            {showPicker && (
              <DateTimePicker
                value={reminderTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={handleTimeChange}
                themeVariant="dark"
              />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSaveReminder}>
              <Text style={styles.buttonText}>Save Reminder</Text>
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
    backgroundColor: '#efececc9',
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
    borderColor: '#d8d2ccff',
    justifyContent: 'center',
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