import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet, Text,
    TextInput, TouchableOpacity
} from 'react-native';
import API_BASE_URL from '../api-config';

export default function HealthRecordsScreen() {
    const router = useRouter();
    // Get the userId that was passed from the home screen
    const { userId } = useLocalSearchParams();

    // State to hold the form data
    const [bloodGroup, setBloodGroup] = useState('');
    const [allergies, setAllergies] = useState('');
    const [medicalConditions, setMedicalConditions] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState<string | null>(null);

    // --- Fetch existing record when the screen loads ---
    useEffect(() => {
        const fetchRecord = async () => {
            if (!userId) return; // Don't run if userId is not available yet
            try {
                // Ask the backend for the record belonging to this user
                const response = await fetch(`${API_BASE_URL}/api/records/user/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    // Fill the form with the data from the database
                    setBloodGroup(data.bloodGroup || '');
                    setAllergies(data.allergies || '');
                    setMedicalConditions(data.medicalConditions || '');
                    setHeight(data.height?.toString() || '');
                    setWeight(data.weight?.toString() || '');
                } else {
                    // It's okay if no record is found, it just means the user is new
                    console.log('No existing health record found for this user.');
                }
            } catch (error) {
                console.error('Failed to fetch health record:', error);
            }
        };

        fetchRecord();
    }, [userId]);

    const calculateBmi = () => {
        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        if (heightInMeters > 0 && weightInKg > 0) {
            const bmiValue = weightInKg / (heightInMeters * heightInMeters);
            setBmi(bmiValue.toFixed(2));
        } else {
            setBmi(null); // Clear BMI if input is invalid
        }
    };
    
    // Recalculate BMI whenever height or weight changes
    useEffect(calculateBmi, [height, weight]);

    // --- handleSaveRecord now sends data to the backend ---
    const handleSaveRecord = async () => {
        // ADDED ROBUST VALIDATION: Ensures userId is a valid number before proceeding
        const id = Array.isArray(userId) ? userId[0] : userId; // Handle array case
        const parsedId = parseInt(id, 10);

        if (!id || isNaN(parsedId)) {
            Alert.alert('Error', 'User ID is invalid. Please log in again.');
            return;
        }

        if (!bloodGroup || !height || !weight) {
            Alert.alert('Validation Error', 'Please fill in at least blood group, height, and weight.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/records/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // The change is here: userId is now nested inside a 'user' object
                    user: { id: parsedId }, 
                    bloodGroup,
                    allergies,
                    medicalConditions,
                    height: parseFloat(height),
                    weight: parseFloat(weight),
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Health record saved successfully!', [
                    { text: 'OK', onPress: () => router.back() } // Go back after saving
                ]);
            } else {
                const errorText = await response.text();
                Alert.alert('Save Failed', errorText || 'An error occurred on the server.');
            }
        } catch (error) {
            console.error('Save Health Record Error:', error);
            Alert.alert('Network Error', 'Could not connect to the server.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.title}>Your Health Record</Text>
                    
                    <Text style={styles.label}>Blood Group</Text>
                    <TextInput style={styles.input} placeholder="e.g., O+" value={bloodGroup} onChangeText={setBloodGroup} />

                    <Text style={styles.label}>Known Allergies</Text>
                    <TextInput style={styles.input} placeholder="e.g., Peanuts, Penicillin" value={allergies} onChangeText={setAllergies} />

                    <Text style={styles.label}>Chronic Medical Conditions</Text>
                    <TextInput style={styles.input} placeholder="e.g., Diabetes, Asthma" value={medicalConditions} onChangeText={setMedicalConditions} />

                    <Text style={styles.label}>Height (cm)</Text>
                    <TextInput style={styles.input} placeholder="Your height in centimeters" value={height} onChangeText={setHeight} keyboardType="numeric" />

                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput style={styles.input} placeholder="Your weight in kilograms" value={weight} onChangeText={setWeight} keyboardType="numeric" />

                    {bmi && <Text style={styles.bmiResult}>Calculated BMI: {bmi}</Text>}

                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecord}>
                        <Text style={styles.saveButtonText}>Save Record</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7', },
    scrollViewContent: { flexGrow: 1, padding: 24, },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#1c1c1e', },
    label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, },
    input: { backgroundColor: '#FFFFFF', height: 55, borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: '#EFEFEF', },
    bmiResult: { marginTop: -5, marginBottom: 20, fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#007AFF', },
    saveButton: { backgroundColor: '#34C759', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
});