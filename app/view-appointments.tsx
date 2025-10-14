import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import API_BASE_URL from '../api-config';

type Appointment = {
  id: number;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
};

export default function ViewAppointmentsScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID is missing. Please log in again.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/user/${userId}`);
      if (response.ok) {
        const data: Appointment[] = await response.json();
        setAppointments(data);
      } else if (response.status === 404) {
        setAppointments([]);
      } else {
        Alert.alert('Error', 'Failed to fetch appointments.');
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentInfo}>
        <Text style={styles.doctorName}>Dr. {item.doctorName}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <Text style={styles.details}>Date: {item.appointmentDate}</Text>
        <Text style={styles.details}>Time: {item.appointmentTime}</Text>
        <Text style={styles.reason}>Reason: {item.reason}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Appointments</Text>
      </View>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no pending appointments.</Text>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => router.push({
                pathname: '/doctor-consultation',
                params: { userId: Number(userId) }
              })}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#1c1c1e' },
  listContainer: { paddingHorizontal: 20 },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentInfo: { flex: 1 },
  doctorName: { fontSize: 18, fontWeight: '600', color: '#1c1c1e' },
  specialty: { fontSize: 14, color: '#8e8e93', marginTop: 2 },
  details: { fontSize: 14, color: '#555', marginTop: 5 },
  reason: { fontSize: 14, fontStyle: 'italic', color: '#888', marginTop: 5 },
  statusContainer: {
    backgroundColor: '#FF9500',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  statusText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50, },
  emptyText: { fontSize: 18, color: '#8e8e93', textAlign: 'center', marginBottom: 20, },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  bookButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});