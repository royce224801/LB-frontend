import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import API_BASE_URL from '../api-config';

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
};

export default function ManageDoctorsScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Fetch Doctors from Backend ---
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctors`);
      if (response.ok) {
        const data: Doctor[] = await response.json();
        setDoctors(data);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not fetch doctors.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    fetchDoctors();
  }, [fetchDoctors]));

  // --- Add New Doctor ---
  const handleAddDoctor = async () => {
    if (!name || !specialty) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctors?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, specialty, available: true }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Doctor added successfully!');
        setName('');
        setSpecialty('');
        fetchDoctors();
      } else {
        Alert.alert('Error', 'Failed to add doctor.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not add doctor.');
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Doctor ---
  const handleDeleteDoctor = async (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this doctor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(`${API_BASE_URL}/api/doctors/${id}?userId=${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
              });
              if (response.ok) {
                Alert.alert('Success', 'Doctor deleted successfully!');
                fetchDoctors();
              } else {
                Alert.alert('Error', 'Failed to delete doctor.');
              }
            } catch (error) {
              Alert.alert('Network Error', 'Could not delete doctor.');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteDoctor(item.id)} style={styles.deleteButton}>
        <FontAwesome name="trash-o" size={24} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#578FFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.listContainer}>
        <Text style={styles.title}>Manage Doctors</Text>
        <Text style={styles.subtitle}>Add or remove doctors from the list.</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Doctor Name"
            placeholderTextColor="#B0B0B0"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Specialty"
            placeholderTextColor="#B0B0B0"
            value={specialty}
            onChangeText={setSpecialty}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddDoctor}>
            <Text style={styles.buttonText}>Add Doctor</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.listTitle}>Current Doctors</Text>
        <FlatList
          data={doctors}
          renderItem={renderDoctor}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' },
  listContainer: { paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E0E0E0', textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#B0B0B0', textAlign: 'center', marginBottom: 20 },
  formContainer: { width: '100%', marginBottom: 20, },
  input: { backgroundColor: '#2C2C2C', height: 55, borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: '#444', color: '#E0E0E0', },
  addButton: { backgroundColor: '#578FFF', paddingVertical: 18, borderRadius: 12, alignItems: 'center', },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
  listTitle: { fontSize: 20, fontWeight: 'bold', color: '#E0E0E0', marginTop: 20, marginBottom: 10 },
  doctorCard: { backgroundColor: '#2C2C2C', padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, },
  doctorInfo: { flex: 1, },
  doctorName: { fontSize: 18, fontWeight: '600', color: '#E0E0E0' },
  doctorSpecialty: { fontSize: 14, color: '#B0B0B0', marginTop: 2 },
  deleteButton: { marginLeft: 15, padding: 10, },
});