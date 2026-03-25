import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHabitStore = create<any>()(
  persist(
    (set, get) => ({
      habits: [
        { id: '1', title: 'Workout', goal: '45min', icon: 'dumbbell', reminders: ['06:30'], completedDates: [] },
        { id: '2', title: 'Hydration', goal: '3L', icon: 'water', reminders: ['09:00', '14:00'], completedDates: [] },
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
      addHabit: (habit: any) => set((state: any) => ({ habits: [...state.habits, habit] })),
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);