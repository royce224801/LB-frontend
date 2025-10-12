import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// We are importing an icon set to make the UI look better
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to LifeBridge</Text>
      </View>

      {/* This View holds our navigation cards */}
      <View style={styles.gridContainer}>
        {/* Card 1: Health Records */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/health-records')}>
          <FontAwesome name="heartbeat" size={32} color="#007bff" />
          <Text style={styles.cardText}>Health Records</Text>
        </TouchableOpacity>

        {/* Card 2: Medicine Reminders */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/medicine-reminder')}>
          <MaterialCommunityIcons name="pill" size={32} color="#28a745" />
          <Text style={styles.cardText}>Medicine Reminders</Text>
        </TouchableOpacity>

        {/* Card 3: Doctor Consultation */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/doctor-consultation')}>
          <FontAwesome name="user-md" size={32} color="#dc3545" />
          <Text style={styles.cardText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* A styled logout button at the bottom */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f0f2f5', // A lighter, softer background
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '48%', // Each card takes up slightly less than half the screen width
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    // Adding a subtle shadow for a "floating" effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto', // Pushes the button to the bottom
    marginBottom: 40,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});