import { Stack } from 'expo-router';
import HabitProvider from './context/HabitContext';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import "./global.css";

export default function RootLayout() {
  useEffect(() => {
    console.log('App initialized. Notifications require a development build.');
  }, []);

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