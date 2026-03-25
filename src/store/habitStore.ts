import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { scheduleDailyReminder, cancelAllNotifications } from '../utils/notifications';

export interface Habit {
  id: string;
  title: string;
  desc: string;
  icon: string;
  time?: string;
  recurrence: string;
  reminderEnabled: boolean;
  reminderHour?: number;
  reminderMinute?: number;
  completed?: boolean; // Add optional completed property for UI state
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  avgCompletion: number;
  totalHabits: number;
  completedToday: number;
}

interface HabitState {
  // State
  habits: Habit[];
  history: Record<string, string[]>; // date -> habit ids completed
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
  
  // Computed getters
  getProgress: () => number;
  getStats: () => HabitStats;
  getWeeklyData: () => number[];
  getConsistencyData: () => boolean[];
  getHabitsWithCompletion: () => (Habit & { completed: boolean })[];
  
  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'reminderEnabled'> & { reminderEnabled?: boolean }) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  resetDay: () => Promise<void>;
  resetAllData: () => Promise<void>;
  checkAndResetDay: () => Promise<void>;
  getDateKey: () => string;
}

// Helper to get today's date key
const getDateKey = (date: Date = new Date()) => {
  return date.toISOString().split('T')[0];
};

// Initial habits without completed flag
const INITIAL_HABITS: Omit<Habit, 'completed'>[] = [
  { 
    id: '1', 
    title: 'Workout', 
    desc: '45min Resistance Training', 
    icon: 'dumbbell', 
    time: '08:00 AM', 
    recurrence: 'DAILY',
    reminderEnabled: false,
    reminderHour: 8,
    reminderMinute: 0
  },
  { 
    id: '2', 
    title: 'Walking', 
    desc: '10,000 Step Minimum', 
    icon: 'user', 
    time: '12:00 PM', 
    recurrence: 'DAILY',
    reminderEnabled: false,
    reminderHour: 12,
    reminderMinute: 0
  },
  { 
    id: '3', 
    title: 'Hydration', 
    desc: '3.0L Target', 
    icon: 'droplet', 
    time: 'Every 2h', 
    recurrence: 'DAILY',
    reminderEnabled: false,
    reminderHour: 10,
    reminderMinute: 0
  },
  { 
    id: '4', 
    title: 'Deep Focus', 
    desc: 'No Screen 1hr Before Bed', 
    icon: 'eye-off', 
    time: '09:00 PM', 
    recurrence: 'DAILY',
    reminderEnabled: false,
    reminderHour: 21,
    reminderMinute: 0
  },
  { 
    id: '5', 
    title: 'Caffeine Control', 
    desc: 'Stop intake after 12:00 PM', 
    icon: 'coffee', 
    time: '12:00 PM', 
    recurrence: 'DAILY',
    reminderEnabled: false,
    reminderHour: 12,
    reminderMinute: 0
  },
  { 
    id: '6', 
    title: 'Recovery', 
    desc: '7.5 Hours Quality Rest', 
    icon: 'moon', 
    time: '10:30 PM', 
    recurrence: 'DAILY',
    reminderEnabled: false,
    reminderHour: 22,
    reminderMinute: 30
  },
];

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: INITIAL_HABITS as Habit[],
      history: {},
      currentStreak: 0,
      longestStreak: 0,
      isLoading: false,

      getDateKey: () => getDateKey(),

      getHabitsWithCompletion: () => {
        const { habits, history } = get();
        const todayKey = getDateKey();
        const todayCompletedIds = history[todayKey] || [];
        
        return habits.map(habit => ({
          ...habit,
          completed: todayCompletedIds.includes(habit.id),
        }));
      },

      getProgress: () => {
        const { habits, history } = get();
        const todayKey = getDateKey();
        const todayCompletedIds = history[todayKey] || [];
        const completedCount = todayCompletedIds.length;
        return habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
      },

      getStats: () => {
        const { habits, history, currentStreak, longestStreak } = get();
        const todayKey = getDateKey();
        const todayCompletedIds = history[todayKey] || [];
        const completedToday = todayCompletedIds.length;
        const progress = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
        
        return {
          currentStreak,
          longestStreak,
          avgCompletion: progress,
          totalHabits: habits.length,
          completedToday,
        };
      },

      getWeeklyData: () => {
        const { habits, history } = get();
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateKey = getDateKey(date);
          const completedOnDate = history[dateKey]?.length || 0;
          const totalOnDate = habits.length;
          return totalOnDate > 0 ? Math.round((completedOnDate / totalOnDate) * 100) : 0;
        });
      },

      getConsistencyData: () => {
        const { habits, history } = get();
        return Array.from({ length: 180 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (179 - i));
          const dateKey = getDateKey(date);
          const completedOnDate = history[dateKey]?.length || 0;
          const totalOnDate = habits.length;
          return totalOnDate > 0 && completedOnDate === totalOnDate;
        });
      },

      checkAndResetDay: async () => {
        const { history, habits, currentStreak, longestStreak } = get();
        const todayKey = getDateKey();
        const yesterdayKey = getDateKey(new Date(Date.now() - 86400000));
        
        // If today's data already exists, nothing to reset
        if (history[todayKey]) {
          return;
        }
        
        // Check if user completed all habits yesterday to update streak
        const yesterdayCompleted = history[yesterdayKey]?.length || 0;
        const totalHabits = habits.length;
        
        if (yesterdayCompleted === totalHabits && totalHabits > 0) {
          // User completed all habits yesterday - continue streak
          const newStreak = currentStreak + 1;
          set({ 
            currentStreak: newStreak,
            longestStreak: Math.max(longestStreak, newStreak)
          });
        } else if (yesterdayCompleted > 0 && yesterdayCompleted < totalHabits) {
          // User did some but not all - break streak
          set({ currentStreak: 0 });
        }
      },

      addHabit: async (habit) => {
        const { habits } = get();
        
        const newHabit: Habit = {
          ...habit,
          id: Date.now().toString(),
          reminderEnabled: habit.reminderEnabled || false,
        };
        
        const updatedHabits = [...habits, newHabit];
        
        // Schedule notification if enabled
        if (newHabit.reminderEnabled && newHabit.reminderHour !== undefined) {
          await scheduleDailyReminder(
            newHabit.title,
            `Time to complete your ${newHabit.title} habit!`,
            newHabit.reminderHour,
            newHabit.reminderMinute || 0
          );
        }
        
        set({ habits: updatedHabits });
      },

      toggleHabit: async (id: string) => {
        const { habits, history, currentStreak, longestStreak } = get();
        const todayKey = getDateKey();
        
        // Get current completed IDs
        const currentCompletedIds = history[todayKey] || [];
        const isCurrentlyCompleted = currentCompletedIds.includes(id);
        
        // Toggle the habit
        let updatedCompletedIds;
        if (isCurrentlyCompleted) {
          updatedCompletedIds = currentCompletedIds.filter(habitId => habitId !== id);
        } else {
          updatedCompletedIds = [...currentCompletedIds, id];
        }
        
        // Update history
        const updatedHistory = {
          ...history,
          [todayKey]: updatedCompletedIds,
        };
        
        // Update streak based on today's completion
        const completedCount = updatedCompletedIds.length;
        const totalHabits = habits.length;
        
        let newStreak = currentStreak;
        if (completedCount === totalHabits && totalHabits > 0) {
          // All habits completed - check if we should increase streak
          const yesterdayKey = getDateKey(new Date(Date.now() - 86400000));
          const yesterdayCompleted = history[yesterdayKey]?.length || 0;
          
          if (yesterdayCompleted === totalHabits && totalHabits > 0) {
            newStreak = currentStreak + 1;
          } else if (newStreak === 0) {
            newStreak = 1;
          }
        } else {
          // Not all habits completed - reset streak
          newStreak = 0;
        }
        
        const newLongestStreak = Math.max(longestStreak, newStreak);
        
        set({
          history: updatedHistory,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
        });
      },

      deleteHabit: async (id: string) => {
        const { habits } = get();
        const updatedHabits = habits.filter(h => h.id !== id);
        
        // Also remove from history
        const { history } = get();
        const updatedHistory: Record<string, string[]> = {};
        Object.keys(history).forEach(date => {
          updatedHistory[date] = history[date].filter(habitId => habitId !== id);
        });
        
        set({ 
          habits: updatedHabits,
          history: updatedHistory
        });
      },

      updateHabit: async (id: string, updates: Partial<Habit>) => {
        const { habits } = get();
        const updatedHabits = habits.map(habit =>
          habit.id === id ? { ...habit, ...updates } : habit
        );
        
        // Update notification if reminder settings changed
        const habit = updatedHabits.find(h => h.id === id);
        if (habit && habit.reminderEnabled && habit.reminderHour !== undefined) {
          await scheduleDailyReminder(
            habit.title,
            `Time to complete your ${habit.title} habit!`,
            habit.reminderHour,
            habit.reminderMinute || 0
          );
        }
        
        set({ habits: updatedHabits });
      },

      resetDay: async () => {
        // This is handled by checkAndResetDay, but we keep for manual reset
        const { habits } = get();
        const todayKey = getDateKey();
        const updatedHistory = {
          ...get().history,
          [todayKey]: [],
        };
        
        set({ history: updatedHistory });
      },

      resetAllData: async () => {
        // Cancel all notifications
        await cancelAllNotifications();
        
        // Reset to initial state
        set({
          habits: INITIAL_HABITS as Habit[],
          history: {},
          currentStreak: 0,
          longestStreak: 0,
        });
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        habits: state.habits,
        history: state.history,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
      }),
    }
  )
);