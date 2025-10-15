import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import API_BASE_URL from '../api-config';

const HOSPITAL_ADMIN_ID = '5';

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
};

export default function DoctorConsultationScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = userId === HOSPITAL_ADMIN_ID;

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

  // --- Toggle Handler (Admin Action) ---
  const toggleAvailability = async (doctor: Doctor) => {
    if (!isAdmin) return;
    
    const newStatus = !doctor.available;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctors/toggle/${doctor.id}?isAvailable=${newStatus}`,
        { method: 'PUT' }
      );
      
      if (response.ok) {
        // Update local state immediately
        setDoctors(prev => prev.map(d => 
          d.id === doctor.id ? { ...d, available: newStatus } : d
        ));
      } else {
        const errorText = await response.text();
        Alert.alert("Update Failed", `Could not update status: ${errorText}`);
      }
    } catch (error) {
      Alert.alert("Network Error", "Failed to connect to the server.");
    }
  };
  
  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      <FontAwesome name="user-md" size={40} color={item.available ? "#34C759" : "#FF4D4D"} style={styles.doctorIcon} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        {item.available ? (
          <Text style={styles.availableText}>Available</Text>
        ) : (
          <Text style={styles.unavailableText}>Unavailable</Text>
        )}
      </View>
      
      {isAdmin ? (
        <View style={styles.adminToggle}>
             <Text style={styles.adminLabel}>Status</Text>
            <Switch
                trackColor={{ false: '#FF4D4D', true: '#34C759' }}
                thumbColor={item.available ? '#E0E0E0' : '#B0B0B0'}
                onValueChange={() => toggleAvailability(item)}
                value={item.available}
            />
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.bookButton, !item.available && styles.disabledButton]}
          disabled={!item.available}
          onPress={() => router.push({
            pathname: '/book-appointment',
            params: { userId: Number(userId), doctorName: item.name, specialty: item.specialty },
          })}
        >
          <Text style={styles.bookButtonText}>{item.available ? 'Book Now' : 'Unavailable'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
      return (
          <SafeAreaView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#578FFF" />
              <Text style={styles.loadingText}>Fetching doctor list...</Text>
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book a Consultation</Text>
        {isAdmin && <Text style={styles.adminWarning}>ADMIN MODE ACTIVE</Text>}
      </View>
      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
      color: '#B0B0B0',
      marginTop: 10,
  },
  header: {
      padding: 20,
      alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#E0E0E0',
  },
  adminWarning: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 5,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  doctorCard: {
    backgroundColor: '#2C2C2C',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  doctorIcon: {
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 2,
  },
  availableText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
    marginTop: 4,
  },
  unavailableText: {
    fontSize: 14,
    color: '#FF4D4D',
    fontWeight: '500',
    marginTop: 4,
  },
  adminToggle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminLabel: {
    color: '#B0B0B0',
    fontSize: 12,
    marginBottom: 5,
  },
  bookButton: {
    backgroundColor: '#578FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#4D4D4D',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});