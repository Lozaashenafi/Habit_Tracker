export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  iconName: string;      // Make sure this is exactly "iconName"
  reminderTime: string; // "08:00 AM"
  isEnabled: boolean;
  completedDates: string[]; // Array of ISO dates "2024-10-23"
  streak: number;
}

export interface DayLog {
  date: string;
  completedHabitIds: string[];
}