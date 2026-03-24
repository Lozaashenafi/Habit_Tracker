import { Stack } from 'expo-router';
import { HabitProvider } from './context/HabitContext';
import "./global.css";

export default function RootLayout() {
  return (
    <HabitProvider>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            animation: 'fade'
          }} 
        />
      </Stack>
    </HabitProvider>
  );
}