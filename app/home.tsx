import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Current User ID: {userId}</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push({
              pathname: "/health-records",
              params: { userId: Number(userId) }
            })}
          >
            <FontAwesome name="heartbeat" size={30} color="#578FFF" />
            <Text style={styles.menuItemText}>Manage Health Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push({
              pathname: "/medicine-reminder",
              params: { userId: Number(userId) }
            })}
          >
            <MaterialCommunityIcons name="pill" size={30} color="#28a745" />
            <Text style={styles.menuItemText}>Medicine Reminders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push({
              pathname: "/doctor-consultation",
              params: { userId: Number(userId) }
            })}
          >
            <FontAwesome name="user-md" size={30} color="#FFD700" />
            <Text style={styles.menuItemText}>Book an Appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push({
              pathname: "/view-appointments",
              params: { userId: Number(userId) }
            })}
          >
            <FontAwesome name="list-alt" size={30} color="#F2F2F7" />
            <Text style={styles.menuItemText}>View Appointments</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginTop: 50,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
    gap: 15,
  },
  menuItem: {
    backgroundColor: '#2C2C2C',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});