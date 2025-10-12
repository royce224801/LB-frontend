import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ## 1. UPDATE THE DATA STRUCTURE ##
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  availabilityTime?: string; // Add optional property for available times
  nextAvailable?: string;    // Add optional property for next availability
};

// ## 2. UPDATE THE MOCK DATA ##
const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Emily Carter', specialty: 'General Physician', available: true, availabilityTime: '10:00 AM - 1:00 PM' },
  { id: '2', name: 'Dr. Ben Adams', specialty: 'Cardiologist', available: false, nextAvailable: 'Available Tomorrow' },
  { id: '3', name: 'Dr. Olivia Chen', specialty: 'Dermatologist', available: true, availabilityTime: '2:00 PM - 5:00 PM' },
  { id: '4', name: 'Dr. Jacob Lee', specialty: 'Pediatrician', available: true, availabilityTime: '9:00 AM - 12:00 PM' },
];

export default function DoctorConsultationScreen() {
  const router = useRouter();

  // ## 3. UPDATE THE UI COMPONENT ##
  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      <FontAwesome name="user-md" size={40} color="#007AFF" style={styles.doctorIcon} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        
        {/* Conditionally render the availability text based on status */}
        {item.available ? (
          <Text style={styles.availableText}>{item.availabilityTime}</Text>
        ) : (
          <Text style={styles.unavailableText}>{item.nextAvailable}</Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.bookButton, !item.available && styles.disabledButton]}
        disabled={!item.available}
        onPress={() => alert(`Booking appointment with ${item.name}...`)}
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

// ## 4. UPDATE THE STYLES ##
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
  // New styles for the availability text
  availableText: {
    fontSize: 14,
    color: '#34C759', // Green for available
    fontWeight: '500',
    marginTop: 4,
  },
  unavailableText: {
    fontSize: 14,
    color: '#FF9500', // Orange for unavailable
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