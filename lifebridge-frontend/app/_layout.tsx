import { Stack } from 'expo-router';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
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
        <Stack.Screen name="ai-chatbot" options={{ headerShown: false }} />
        
        {/* Medicine Ordering Screens */}
        <Stack.Screen name="order-medicines" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ headerShown: false }} />
        <Stack.Screen name="order-tracking" options={{ headerShown: false }} />
        <Stack.Screen name="shop-management" options={{ headerShown: false }} />
        <Stack.Screen name="notification-settings" options={{ headerShown: false }} />
        
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}