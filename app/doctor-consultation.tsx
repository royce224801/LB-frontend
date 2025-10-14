import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  availabilityTime?: string;
  nextAvailable?: string;
};

const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Emily Carter', specialty: 'General Physician', available: true, availabilityTime: '10:00 AM - 1:00 PM' },
  { id: '2', name: 'Dr. Ben Adams', specialty: 'Cardiologist', available: false, nextAvailable: 'Available Tomorrow' },
  { id: '3', name: 'Dr. Olivia Chen', specialty: 'Dermatologist', available: true, availabilityTime: '2:00 PM - 5:00 PM' },
  { id: '4', name: 'Dr. Jacob Lee', specialty: 'Pediatrician', available: true, availabilityTime: '9:00 AM - 12:00 PM' },
];

export default function DoctorConsultationScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      <FontAwesome name="user-md" size={40} color="#007AFF" style={styles.doctorIcon} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        {item.available ? (
          <Text style={styles.availableText}>{item.availabilityTime}</Text>
        ) : (
          <Text style={styles.unavailableText}>{item.nextAvailable}</Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.bookButton, !item.available && styles.disabledButton]}
        disabled={!item.available}
        onPress={() => router.push({
          pathname: '/book-appointment',
          params: { userId: Number(userId), doctorName: item.name, specialty: item.specialty },
        })}
      >
        <Text style={styles.bookButtonText}>{item.available ? 'Book' : 'Unavailable'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.title}>Book a Consultation</Text>
      </View>
      <FlatList
        data={mockDoctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
      padding: 20,
      alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1c1c1e',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
    color: '#1c1c1e',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#8e8e93',
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
    color: '#FF9500',
    fontWeight: '500',
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ced4da',
  },
  bookButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});