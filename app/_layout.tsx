import { Stack } from 'expo-router';
import HabitProvider from './context/HabitContext'; // Ensure this path is correct
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* HabitProvider must wrap the Stack so ALL screens can see it */}
      <HabitProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        </Stack>
      </HabitProvider>
    </SafeAreaProvider>
  );
}