import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Habit {
  id: string;
  title: string;
  desc: string;
  completed: boolean;
  icon: string;
  time?: string;
  recurrence?: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  avgCompletion: number;
  totalHabits: number;
  completedToday: number;
}

interface HabitContextType {
  habits: Habit[];
  stats: HabitStats;
  progress: number;
  weeklyData: number[];
  consistencyData: boolean[];
  isLoading: boolean;
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  resetDay: () => void;
  getDateKey: () => string;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const STORAGE_KEYS = {
  HABITS: '@habits',
  HISTORY: '@habit_history',
  STREAK: '@streak_data',
};

// Mock initial habits
const INITIAL_HABITS: Habit[] = [
  { id: '1', title: 'Workout', desc: '45min Resistance Training', completed: false, icon: 'dumbbell', time: '08:00 AM', recurrence: 'DAILY' },
  { id: '2', title: 'Walking', desc: '10,000 Step Minimum', completed: false, icon: 'user', time: '12:00 PM', recurrence: 'DAILY' },
  { id: '3', title: 'Hydration', desc: '3.0L Target', completed: false, icon: 'droplet', time: 'Every 2h', recurrence: 'DAILY' },
  { id: '4', title: 'Deep Focus', desc: 'No Screen 1hr Before Bed', completed: false, icon: 'eye-off', time: '09:00 PM', recurrence: 'DAILY' },
  { id: '5', title: 'Caffeine Control', desc: 'Stop intake after 12:00 PM', completed: false, icon: 'coffee', time: '12:00 PM', recurrence: 'DAILY' },
  { id: '6', title: 'Recovery', desc: '7.5 Hours Quality Rest', completed: false, icon: 'moon', time: '10:30 PM', recurrence: 'DAILY' },
];

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [history, setHistory] = useState<Record<string, string[]>>({});
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getDateKey = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Load data from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
      const storedHistory = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      const storedStreak = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);

      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      } else {
        setHabits(INITIAL_HABITS);
        await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
      }

      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        setHistory({});
      }

      if (storedStreak) {
        const streakData = JSON.parse(storedStreak);
        setStreak(streakData.current);
        setLongestStreak(streakData.longest);
      } else {
        setStreak(0);
        setLongestStreak(0);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setHabits(INITIAL_HABITS);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(newHabits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const saveHistory = async (newHistory: Record<string, string[]>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const updateStreak = async (completedToday: number, totalHabits: number) => {
    const todayKey = getDateKey();
    const yesterdayKey = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    let newStreak = streak;
    const yesterdayCompleted = history[yesterdayKey]?.length || 0;
    const yesterdayTotal = habits.length;
    
    if (completedToday === totalHabits && totalHabits > 0) {
      if (yesterdayCompleted === yesterdayTotal && yesterdayTotal > 0) {
        newStreak = streak + 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 0;
    }
    
    const newLongestStreak = Math.max(longestStreak, newStreak);
    setStreak(newStreak);
    setLongestStreak(newLongestStreak);
    
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({
      current: newStreak,
      longest: newLongestStreak
    }));
  };

  const toggleHabit = async (id: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);

    const todayKey = getDateKey();
    const completedTodayIds = updatedHabits
      .filter(h => h.completed)
      .map(h => h.id);
    
    const newHistory = {
      ...history,
      [todayKey]: completedTodayIds
    };
    setHistory(newHistory);
    await saveHistory(newHistory);

    const completedCount = completedTodayIds.length;
    await updateStreak(completedCount, updatedHabits.length);
  };

  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completed: false,
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter(h => h.id !== id);
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    );
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const resetDay = async () => {
    const resetHabits = habits.map(habit => ({ ...habit, completed: false }));
    setHabits(resetHabits);
    await saveHabits(resetHabits);
  };

  // Calculate progress and stats
  const completedCount = habits.filter(h => h.completed).length;
  const progress = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const stats: HabitStats = {
    currentStreak: streak,
    longestStreak: longestStreak,
    avgCompletion: progress,
    totalHabits: habits.length,
    completedToday: completedCount,
  };

  // Generate weekly data (last 7 days)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateKey = date.toISOString().split('T')[0];
    const completedOnDate = history[dateKey]?.length || 0;
    const totalOnDate = habits.length;
    return totalOnDate > 0 ? Math.round((completedOnDate / totalOnDate) * 100) : 0;
  });

  // Generate consistency data for last 180 days
  const consistencyData = Array.from({ length: 180 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (179 - i));
    const dateKey = date.toISOString().split('T')[0];
    const completedOnDate = history[dateKey]?.length || 0;
    const totalOnDate = habits.length;
    return totalOnDate > 0 && completedOnDate === totalOnDate;
  });

  return (
    <HabitContext.Provider value={{
      habits,
      stats,
      progress,
      weeklyData,
      consistencyData,
      isLoading,
      addHabit,
      toggleHabit,
      deleteHabit,
      updateHabit,
      resetDay,
      getDateKey,
    }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}