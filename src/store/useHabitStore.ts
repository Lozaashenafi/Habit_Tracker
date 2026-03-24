import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Fallback for Web if native storage fails
const storage = Platform.OS === 'web' 
  ? localStorage 
  : AsyncStorage;

export const useHabitStore = create<any>()(
  persist(
    (set) => ({
      habits: [
        { id: '1', title: 'Workout', description: '45min Training', iconName: 'Dumbbell', reminderTime: '06:30', completedDates: [], streak: 0 },
        { id: '2', title: 'Walking', description: '10,000 Steps', iconName: 'Footprints', reminderTime: '18:00', completedDates: [], streak: 0 },
        { id: '3', title: 'Hydration', description: '3.0L Target', iconName: 'Droplet', reminderTime: '09:00', completedDates: [], streak: 0 },
      ],
      toggleHabit: (id: string, date: string) => set((state: any) => ({
        habits: state.habits.map((h: any) => {
          if (h.id === id) {
            const isCompleted = h.completedDates.includes(date);
            return {
              ...h,
              completedDates: isCompleted 
                ? h.completedDates.filter((d: string) => d !== date)
                : [...h.completedDates, date],
            };
          }
          return h;
        }),
      })),
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => storage as any),
    }
  )
);
