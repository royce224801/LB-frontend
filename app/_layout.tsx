import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="health-records" options={{ headerShown: false }} />
      <Stack.Screen name="medicine-reminder" options={{ headerShown: false }} />
      <Stack.Screen name="add-reminder" options={{ headerShown: false }} />
      <Stack.Screen name="doctor-consultation" options={{ headerShown: false }} />
      <Stack.Screen name="book-appointment" options={{ headerShown: false }} />
      <Stack.Screen name="view-appointments" options={{ headerShown: false }} />
      <Stack.Screen name="add-health-log" options={{ headerShown: false }} />
      <Stack.Screen name="view-health-stats" options={{ headerShown: false }} /> {/* NEW ROUTE */}
    </Stack>
  );
}
