import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
    const { userId } = useLocalSearchParams();
    const [recordId, setRecordId] = useState(null);

    const [bloodGroup, setBloodGroup] = useState('');
    const [allergies, setAllergies] = useState('');
    const [medicalConditions, setMedicalConditions] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Fetch existing record when the screen loads ---
    useEffect(() => {
        const fetchRecord = async () => {
            if (!userId) {
                Alert.alert('Error', 'User ID is missing.');
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/records/user/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setRecordId(data.id);
                    setBloodGroup(data.bloodGroup || '');
                    setAllergies(data.allergies || '');
                    setMedicalConditions(data.medicalConditions || '');
                    setHeight(data.height?.toString() || '');
                    setWeight(data.weight?.toString() || '');
                } else {
                    console.log('No existing health record found for this user, will create a new one.');
                }
            } catch (error) {
                console.error('Failed to fetch health record:', error);
                Alert.alert('Network Error', 'Could not connect to the server.');
            } finally {
                setLoading(false);
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
            setBmi(null);
        }
    };
    
    useEffect(calculateBmi, [height, weight]);

    const handleSaveRecord = async () => {
        if (!userId || isNaN(Number(userId))) {
            Alert.alert('Error', 'User ID is invalid. Please log in again.');
            return;
        }

        if (!bloodGroup || !height || !weight) {
            Alert.alert('Validation Error', 'Please fill in at least blood group, height, and weight.');
            return;
        }
        
        const method = recordId ? 'PUT' : 'POST';
        const url = recordId 
            ? `${API_BASE_URL}/api/records/user/${userId}` 
            : `${API_BASE_URL}/api/records/save/${userId}`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: recordId,
                    user: { id: userId }, 
                    bloodGroup,
                    allergies,
                    medicalConditions,
                    height: parseFloat(height),
                    weight: parseFloat(weight),
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Health record saved successfully!', [
                    { text: 'OK', onPress: () => router.back() }
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
    
    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#578FFF" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.title}>{recordId ? 'Edit Health Record' : 'Your Health Record'}</Text>
                    
                    <Text style={styles.label}>Blood Group</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="e.g., O+" 
                        placeholderTextColor="#B0B0B0"
                        value={bloodGroup} 
                        onChangeText={setBloodGroup} 
                    />

                    <Text style={styles.label}>Known Allergies</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="e.g., Peanuts, Penicillin" 
                        placeholderTextColor="#B0B0B0"
                        value={allergies} 
                        onChangeText={setAllergies} 
                    />

                    <Text style={styles.label}>Chronic Medical Conditions</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="e.g., Diabetes, Asthma" 
                        placeholderTextColor="#B0B0B0"
                        value={medicalConditions} 
                        onChangeText={setMedicalConditions} 
                    />

                    <Text style={styles.label}>Height (cm)</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Your height in centimeters" 
                        placeholderTextColor="#B0B0B0"
                        value={height} 
                        onChangeText={setHeight} 
                        keyboardType="numeric" 
                    />

                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Your weight in kilograms" 
                        placeholderTextColor="#B0B0B0"
                        value={weight} 
                        onChangeText={setWeight} 
                        keyboardType="numeric" 
                    />

                    {bmi && <Text style={styles.bmiResult}>Calculated BMI: {bmi}</Text>}

                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecord}>
                        <Text style={styles.saveButtonText}>{recordId ? 'Update Record' : 'Save Record'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A1A', },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollViewContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#E0E0E0', },
    label: { fontSize: 16, fontWeight: '600', color: '#E0E0E0', marginBottom: 8, },
    input: { 
        backgroundColor: '#2C2C2C', 
        height: 55, 
        borderRadius: 12, 
        marginBottom: 16, 
        paddingHorizontal: 16, 
        fontSize: 16, 
        borderWidth: 1, 
        borderColor: '#444', 
        color: '#E0E0E0',
    },
    bmiResult: { marginTop: -5, marginBottom: 20, fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#578FFF', },
    saveButton: { backgroundColor: '#578FFF', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
});