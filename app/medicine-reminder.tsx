import { useRouter } from 'expo-router'; // <-- IMPORT THE ROUTER
import { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type Reminder = {
  id: string; name: string; time: string; dosage: string; isActive: boolean;
};

const initialReminders: Reminder[] = [
  { id: '1', name: 'Metformin', time: '8:00 AM', dosage: '1 tablet', isActive: true },
  { id: '2', name: 'Aspirin', time: '12:00 PM', dosage: '1 tablet', isActive: true },
  { id: '3', name: 'Atorvastatin', time: '9:00 PM', dosage: '2 tablets', isActive: false },
];

export default function MedicineReminderScreen() {
  const router = useRouter(); // <-- GET THE ROUTER INSTANCE
  const [reminders, setReminders] = useState(initialReminders);

  const toggleReminderStatus = (id: string) => {
    setReminders(currentReminders =>
      currentReminders.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
    );
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={[styles.reminderItem, !item.isActive && styles.inactiveReminderItem]}>
      <View style={styles.reminderInfo}>
        <Text style={styles.reminderName}>{item.name}</Text>
        <Text style={styles.reminderDetails}>Dosage: {item.dosage} at {item.time}</Text>
      </View>
      <Switch
        trackColor={{ false: '#dcdcdc', true: '#a0c8ff' }}
        thumbColor={item.isActive ? '#007AFF' : '#f4f3f4'}
        onValueChange={() => toggleReminderStatus(item.id)}
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
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      {/* THIS BUTTON NOW NAVIGATES TO THE NEW SCREEN */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-reminder')}>
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
      alignItems: 'center'
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
      alignItems: 'center'
  },
  addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold'
  }
});