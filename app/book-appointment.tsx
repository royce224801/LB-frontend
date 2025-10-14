import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

export default function BookAppointmentScreen() {
  const router = useRouter();
  const { userId, doctorName, specialty } = useLocalSearchParams();

  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [reason, setReason] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAppointmentDate(selectedDate);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setAppointmentTime(selectedTime);
    }
  };

  const handleBookAppointment = async () => {
    if (!userId || !doctorName || !specialty || !reason) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const dateString = appointmentDate.toISOString().split('T')[0];
    const timeString = appointmentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { id: userId },
          doctorName,
          specialty,
          appointmentDate: dateString,
          appointmentTime: timeString,
          reason,
          status: 'PENDING',
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Appointment booked successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        const errorText = await response.text();
        Alert.alert('Booking Failed', errorText || 'An error occurred on the server.');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Book Appointment</Text>
          <View style={styles.formContainer}>
            <Text style={styles.doctorInfo}>Dr. {doctorName} - {specialty}</Text>

            <TextInput
              style={styles.input}
              placeholder="Reason for Appointment"
              placeholderTextColor="#999"
              value={reason}
              onChangeText={setReason}
            />

            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: '#000', fontSize: 16 }}>
                <FontAwesome name="calendar" size={16} color="#999" />
                {' '}
                {appointmentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={appointmentDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}

            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text style={{ color: '#000', fontSize: 16 }}>
                <FontAwesome name="clock-o" size={16} color="#999" />
                {' '}
                {appointmentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </Text>
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={appointmentTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleTimeChange}
                themeVariant="dark"
              />
            )}

            <TouchableOpacity style={styles.button} onPress={handleBookAppointment}>
              <Text style={styles.buttonText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', },
  keyboardAvoidingContainer: { flex: 1, },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#1c1c1e', },
  formContainer: { width: '100%', },
  doctorInfo: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 20, color: '#555', },
  input: {
    backgroundColor: '#FFFFFF',
    height: 55,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
  },
  button: { backgroundColor: '#34C759', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
});