import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Animated, PanResponder, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import API_BASE_URL from '../api-config';

// Key to store acknowledgment status
const RISK_ACKNOWLEDGED_KEY = '@LifeBridge:RiskAck';
const HOSPITAL_ADMIN_ID = '5';

type RiskStatus = {
    status: string;
    message: string;
    color: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [riskStatus, setRiskStatus] = useState<RiskStatus | null>(null);
  const [loadingRisk, setLoadingRisk] = useState(true);
  const [showRiskCard, setShowRiskCard] = useState(true);
  
  const pan = useRef(new Animated.Value(0)).current;

  const acknowledgeRisk = async (acknowledged: boolean) => {
    if (userId) {
        await AsyncStorage.setItem(RISK_ACKNOWLEDGED_KEY + userId, acknowledged ? 'true' : 'false');
        setShowRiskCard(!acknowledged);
    }
  };

  const fetchRiskStatus = useCallback(async () => {
    if (!userId) return;
    setLoadingRisk(true);
    
    const acknowledged = await AsyncStorage.getItem(RISK_ACKNOWLEDGED_KEY + userId) === 'true';

    try {
        const response = await fetch(`${API_BASE_URL}/api/health-logs/risk/${userId}`);
        if (response.ok) {
            const data: RiskStatus = await response.json();
            setRiskStatus(data);
            
            const isHighRisk = data.status === 'HIGH_RISK' || data.status === 'ELEVATED';

            if (isHighRisk) {
                setShowRiskCard(!acknowledged);
            } else {
                await AsyncStorage.setItem(RISK_ACKNOWLEDGED_KEY + userId, 'false');
                setShowRiskCard(false);
            }
            
        } else {
            setRiskStatus({ status: "NO_DATA", message: "Log your first vital reading!", color: "#B0B0B0" });
            setShowRiskCard(false);
        }
    } catch (error) {
        console.error("Failed to fetch risk status:", error);
        setRiskStatus({ status: "ERROR", message: "Network error.", color: "#FF4D4D" });
        setShowRiskCard(true);
    } finally {
        setLoadingRisk(false);
    }
  }, [userId]);
  
  useFocusEffect(
    useCallback(() => {
      fetchRiskStatus();
    }, [fetchRiskStatus])
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        const swipeThreshold = 50;
        
        if (Math.abs(gestureState.dx) > swipeThreshold) {
          acknowledgeRisk(true);

          Animated.timing(pan, {
            toValue: gestureState.dx > 0 ? 300 : -300,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            setShowRiskCard(false);
            pan.setValue(0);
          });
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    }),
  ).current;

  const handleLogout = () => {
    router.replace('/login');
  };
  
  const RiskCard = () => {
    if (loadingRisk) {
        return (
            <View style={[styles.riskCard, { borderLeftColor: '#444' }]}>
                <ActivityIndicator size="small" color="#578FFF" />
                <Text style={[styles.riskCardTitle, { marginLeft: 10 }]}>Calculating Risk...</Text>
            </View>
        );
    }

    const statusColor = riskStatus?.color || '#B0B0B0';

    return (
      <Animated.View 
        {...panResponder.panHandlers} 
        style={[
            styles.riskCard, 
            { borderLeftColor: statusColor, transform: [{ translateX: pan }] }
        ]}
      >
        <TouchableOpacity 
            style={styles.riskContent} 
            onPress={() => acknowledgeRisk(true)} 
        >
            <Text style={styles.riskCardTitle}>Health Status:</Text>
            <Text style={[styles.riskCardMessage, { color: statusColor }]}>
                {riskStatus?.message || "Error"}
            </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const isUserAdmin = userId === HOSPITAL_ADMIN_ID;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Current User ID: {userId}</Text>
        </View>
        
        {showRiskCard && <RiskCard />}

        <ScrollView contentContainerStyle={styles.menuScrollContent} showsVerticalScrollIndicator={false}>
          
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

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push({
              pathname: "/add-health-log",
              params: { userId: Number(userId) }
            })}
          >
            <Ionicons name="stats-chart" size={30} color="#E0E0E0" />
            <Text style={styles.menuItemText}>Log Health Vitals</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push({
              pathname: "/view-health-stats",
              params: { userId: Number(userId) }
            })}
          >
            <Ionicons name="analytics" size={30} color="#34C759" />
            <Text style={styles.menuItemText}>View Health Statistics</Text>
          </TouchableOpacity>

          {isUserAdmin && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push({
                pathname: "/manage-doctors",
                params: { userId: Number(userId) }
              })}
            >
              <Ionicons name="people-circle" size={30} color="#FFD700" />
              <Text style={styles.menuItemText}>Manage Doctors</Text>
            </TouchableOpacity>
          )}

        </ScrollView>

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
    marginBottom: 20,
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
  riskCard: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 5,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  riskContent: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    flexShrink: 1,
    paddingRight: 10,
  },
  riskCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
    marginRight: 8,
  },
  riskCardMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
    textAlign: 'left',
  },
  menuScrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
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
    marginTop: 20,
    marginBottom: 0,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});