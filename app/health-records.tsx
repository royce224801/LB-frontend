import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Button,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet, Text,
    TextInput,
    View
} from 'react-native';

export default function HealthRecordsScreen() {
  const router = useRouter();

  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<string | null>(null);

  const calculateBmi = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(2));
    } else {
      Alert.alert('Invalid Input', 'Please enter valid numbers for height and weight.');
    }
  };

  const handleSaveRecord = () => {
    if (!bloodGroup || !height || !weight) {
      Alert.alert('Validation Error', 'Please fill in at least blood group, height, and weight.');
      return;
    }

    let recordDetails = `Blood Group: ${bloodGroup}\nHeight: ${height} cm\nWeight: ${weight} kg`;
    if (bmi) {
      recordDetails += `\nBMI: ${bmi}`;
    }
    recordDetails += `\nAllergies: ${allergies || 'None'}\nChronic Diseases: ${chronicDiseases || 'None'}`;

    Alert.alert('Record Saved (Mock)', recordDetails, [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Add Health Record</Text>

          <TextInput
            style={styles.input}
            placeholder="Blood Group (e.g., O+)"
            placeholderTextColor="#999"
            value={bloodGroup}
            onChangeText={setBloodGroup}
          />
          <TextInput
            style={styles.input}
            placeholder="Known Allergies (e.g., Peanuts)"
            placeholderTextColor="#999"
            value={allergies}
            onChangeText={setAllergies}
          />
          <TextInput
            style={styles.input}
            placeholder="Chronic Diseases (e.g., Diabetes)"
            placeholderTextColor="#999"
            value={chronicDiseases}
            onChangeText={setChronicDiseases}
          />

          <View style={styles.bmiSection}>
            <Text style={styles.sectionTitle}>BMI Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Height (cm)"
              placeholderTextColor="#999"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              placeholderTextColor="#999"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <Button title="Calculate BMI" onPress={calculateBmi} />
            {bmi && <Text style={styles.bmiResult}>Your BMI is: {bmi}</Text>}
          </View>

          <View style={styles.saveButtonContainer}>
            <Button title="Save Record" onPress={handleSaveRecord} color="#34C759" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1c1c1e',
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
  bmiSection: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  bmiResult: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007AFF',
  },
  saveButtonContainer: {
    marginTop: 10,
  }
});