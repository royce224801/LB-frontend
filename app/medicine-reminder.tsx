import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
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
  reminderTime: string;
  dosage: string;
  isActive: boolean;
};

export default function MedicineReminderScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const fetchReminders = useCallback(async () => {
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
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [fetchReminders])
  );

  const toggleReminderStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reminders/toggle/${id}?active=${!isActive}`, {
        method: 'PUT',
      });
      if (response.ok) {
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

  const deleteReminder = async (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this reminder?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/reminders/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                setReminders(currentReminders => currentReminders.filter(r => r.id !== id));
              } else {
                Alert.alert('Error', 'Failed to delete reminder.');
              }
            } catch (error) {
              console.error('Failed to delete reminder:', error);
              Alert.alert('Network Error', 'Could not connect to the server.');
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={[styles.reminderItem, !item.isActive && styles.inactiveReminderItem]}>
      <View style={styles.reminderInfo}>
        <Text style={styles.reminderName}>{item.medicineName}</Text>
        <Text style={styles.reminderDetails}>Dosage: {item.dosage} at {item.reminderTime}</Text>
      </View>
      <Switch
        trackColor={{ false: '#4D4D4D', true: '#578FFF' }}
        thumbColor={item.isActive ? '#E0E0E0' : '#B0B0B0'}
        onValueChange={() => toggleReminderStatus(item.id, item.isActive)}
        value={item.isActive}
      />
      <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.deleteButton}>
        <FontAwesome name="trash-o" size={24} color="#FF4D4D" />
      </TouchableOpacity>
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
    backgroundColor: '#1A1A1A',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#E0E0E0',
  },
  list: {
    paddingHorizontal: 20,
  },
  reminderItem: {
    backgroundColor: '#2C2C2C',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  inactiveReminderItem: {
    backgroundColor: '#3A3A3A',
    opacity: 0.6,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  reminderDetails: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#578FFF',
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
  deleteButton: {
    marginLeft: 15,
  },
});