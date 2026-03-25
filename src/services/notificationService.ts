import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications'; // 1. Add this import

export async function scheduleDailyReminder(title: string, body: string, hour: number, minute: number) {
  await Notifications.scheduleNotificationAsync({
    content: { 
      title, 
      body, 
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH, // Pro tip: ensure high priority
    },
    trigger: {
      type: SchedulableTriggerInputTypes.CALENDAR, // 2. Add this specific type
      hour,
      minute,
      repeats: true,
    },
  });
}