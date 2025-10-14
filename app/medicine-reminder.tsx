import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import API_BASE_URL from '../api-config';

type Reminder = {
  id: number;
  medicineName: string;
  reminderTime: string; // The time the reminder should fire
  dosage: string; // e.g., "1 tablet", "5 ml"
  isActive: boolean;
};

export default function MedicineReminderScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Function to fetch reminders from the backend
  const fetchReminders = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID is missing. Please log in again.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/reminders/user/${userId}`);
      if (response.ok) {
        const data: Reminder[] = await response.json();
        setReminders(data);
      } else if (response.status === 404) {
        console.log('No reminders found for this user.');
        setReminders([]);
      } else {
        Alert.alert('Error', 'Failed to fetch reminders.');
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    }
  };

  // Fetch reminders on screen load and when userId changes
  useEffect(() => {
    fetchReminders();
  }, [userId]);

  // Function to toggle reminder status
  const toggleReminderStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reminders/toggle/${id}?active=${!isActive}`, {
        method: 'PUT',
      });
      if (response.ok) {
        // Optimistically update the UI
        setReminders(currentReminders =>
          currentReminders.map(r => (r.id === id ? { ...r, isActive: !r.isActive } : r))
        );
      } else {
        Alert.alert('Error', 'Failed to update reminder status.');
      }
    } catch (error) {
      console.error('Failed to toggle reminder status:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={[styles.reminderItem, !item.isActive && styles.inactiveReminderItem]}>
      <View style={styles.reminderInfo}>
        <Text style={styles.reminderName}>{item.medicineName}</Text>
        <Text style={styles.reminderDetails}>Dosage: {item.dosage} at {item.reminderTime}</Text>
      </View>
      <Switch
        trackColor={{ false: '#dcdcdc', true: '#a0c8ff' }}
        thumbColor={item.isActive ? '#007AFF' : '#f4f3f4'}
        onValueChange={() => toggleReminderStatus(item.id, item.isActive)}
        value={item.isActive}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicine Reminders</Text>
      </View>

      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push({
          pathname: '/add-reminder',
          params: { userId: Number(userId) }
        })}
      >
        <Text style={styles.addButtonText}>Add New Reminder</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1c1c1e',
  },
  list: {
    paddingHorizontal: 20,
  },
  reminderItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inactiveReminderItem: {
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderName: {
    fontSize: 18,
    fontWeight: '600',
  },
  reminderDetails: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});