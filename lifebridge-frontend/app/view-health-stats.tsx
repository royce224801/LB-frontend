import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // Assumes you have installed react-native-chart-kit and react-native-svg
import API_BASE_URL from '../api-config';

const screenWidth = Dimensions.get('window').width;

type HealthLog = {
    id: number;
    systolic: number;
    diastolic: number;
    glucose: number;
    timestamp: string;
};

// --- CHART CONFIGURATION ---
const chartConfig = {
    backgroundGradientFrom: '#2C2C2C',
    backgroundGradientTo: '#2C2C2C',
    color: (opacity = 1) => `rgba(87, 143, 255, ${opacity})`, // Blue for charts
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(224, 224, 224, ${opacity})`, // Light gray labels
};

export default function ViewHealthStatsScreen() {
    const { userId } = useLocalSearchParams();
    const [logs, setLogs] = useState<HealthLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        if (!userId) {
            Alert.alert('Error', 'User ID is missing. Please log in again.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/health-logs/user/${userId}`);
            if (response.ok) {
                const data: HealthLog[] = await response.json();
                // Sort by timestamp descending (most recent first)
                const sortedData = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setLogs(sortedData);
            } else if (response.status === 404) {
                setLogs([]);
            } else {
                Alert.alert('Error', 'Failed to fetch logs.');
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
            Alert.alert('Network Error', 'Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            fetchLogs();
        }, [fetchLogs])
    );
    
    // --- New: Summary Generator ---
    const generateSummaryMessage = () => {
        if (logs.length === 0) return "No data yet. Log your first vital to see statistics.";
        
        const highBPSystolic = 130;
        const highBPDiastolic = 85;
        const highGlucose = 126;

        let highCount = 0;
        let normalCount = 0;
        
        logs.forEach(log => {
            if (log.systolic > highBPSystolic || log.diastolic > highBPDiastolic || log.glucose > highGlucose) {
                highCount++;
            } else {
                normalCount++;
            }
        });

        const totalCount = logs.length;
        const highPercentage = (highCount / totalCount) * 100;
        const lowPercentage = 100 - highPercentage;

        if (highPercentage >= 50) {
            return `🚨 Warning: ${Math.round(highPercentage)}% of your recent readings are elevated. You should review your lifestyle or consult a physician.`;
        } else if (highCount > 0 && highPercentage < 50) {
            return `Monitor Status: Your readings are mostly good, but ${highCount} log${highCount > 1 ? 's' : ''} were elevated. Keep logging regularly.`;
        } else {
            return `✅ Excellent: All ${totalCount} recorded readings fall within the healthy range!`;
        }
    };
    // --- End: Summary Generator ---

    // --- Data Transformation for Charts ---
    const lastFiveLogs = logs.slice(0, 5).reverse();
    const timestamps = lastFiveLogs.map(log => new Date(log.timestamp).toLocaleTimeString().substring(0, 5));

    const bloodPressureData = {
        labels: timestamps,
        datasets: [
            {
                data: lastFiveLogs.map(log => log.systolic),
                color: (opacity = 1) => `rgba(255, 87, 87, ${opacity})`, // Red for Systolic
                strokeWidth: 3,
            },
            {
                data: lastFiveLogs.map(log => log.diastolic),
                color: (opacity = 1) => `rgba(87, 143, 255, ${opacity})`, // Blue for Diastolic
                strokeWidth: 3,
            },
        ],
        legend: ['Systolic', 'Diastolic'],
    };

    const glucoseData = {
        labels: timestamps,
        datasets: [
            {
                data: lastFiveLogs.map(log => log.glucose),
                color: (opacity = 1) => `rgba(255, 204, 0, ${opacity})`, // Yellow/Gold for Glucose
                strokeWidth: 3,
            },
        ],
        legend: ['Glucose'],
    };
    
    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#578FFF" />
                <Text style={styles.loadingText}>Loading Vitals...</Text>
            </SafeAreaView>
        );
    }

    if (logs.length === 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={styles.emptyText}>{generateSummaryMessage()}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.title}>Health Vitals History</Text>
                
                {/* --- Display Summary Message --- */}
                <View style={styles.summaryMessageCard}>
                    <Text style={styles.summaryMessageText}>{generateSummaryMessage()}</Text>
                </View>
                {/* --- End Summary Message --- */}

                {/* Blood Pressure Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Blood Pressure Trend (mmHg)</Text>
                    <LineChart
                        data={bloodPressureData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                    />
                </View>

                {/* Glucose Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Blood Glucose Trend</Text>
                    <LineChart
                        data={glucoseData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                    />
                </View>

                {/* Latest Reading Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Latest Reading</Text>
                    <Text style={styles.summaryValue}>
                        BP: {logs[0].systolic}/{logs[0].diastolic} mmHg
                    </Text>
                    <Text style={styles.summaryValue}>
                        Glucose: {logs[0].glucose} mg/dL
                    </Text>
                    <Text style={styles.summaryTimestamp}>
                        Logged: {new Date(logs[0].timestamp).toLocaleString()}
                    </Text>
                </View>
            </ScrollView>
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
        alignItems: 'center',
    },
    loadingText: {
        color: '#E0E0E0',
        marginTop: 10,
        fontSize: 16,
    },
    emptyText: {
        color: '#B0B0B0',
        fontSize: 18,
        textAlign: 'center',
    },
    scrollViewContent: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E0E0E0',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#B0B0B0',
        textAlign: 'center',
        marginBottom: 20,
    },
    // New Styles for Summary Message
    summaryMessageCard: {
        backgroundColor: '#2C2C2C',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#578FFF', // Blue accent
        elevation: 5,
    },
    summaryMessageText: {
        fontSize: 16,
        color: '#E0E0E0',
        fontWeight: '600',
    },
    // End New Styles

    chartCard: {
        backgroundColor: '#2C2C2C',
        borderRadius: 15,
        padding: 10,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E0E0E0',
        marginLeft: 10,
        marginBottom: 10,
    },
    summaryCard: {
        backgroundColor: '#2C2C2C',
        padding: 20,
        borderRadius: 15,
        elevation: 5,
        marginTop: 10,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#578FFF',
        marginBottom: 10,
    },
    summaryValue: {
        fontSize: 18,
        color: '#E0E0E0',
        marginBottom: 5,
    },
    summaryTimestamp: {
        fontSize: 14,
        color: '#B0B0B0',
        marginTop: 10,
    },
});
