import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications'; // 1. Import the types
import Constants from 'expo-constants';

export async function requestPermissions() {
  if (Constants.appOwnership === 'expo') {
    console.log("LOG: Running in Expo Go. Only Local Notifications will work.");
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyHabitReminder(id: string, title: string, hour: number, minute: number) {
  try {
    // Cancel any previous reminder for this habit ID
    await Notifications.cancelScheduledNotificationAsync(id);

    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: "Performance Lab ⚡",
        body: `Protocol: ${title}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.CALENDAR, // 2. Add this line to fix the TS error
        hour,
        minute,
        repeats: true,
      },
    });
    console.log(`Notification scheduled for ${title} at ${hour}:${minute}`);
  } catch (e) {
    console.warn("Notification failed: Check permissions or build type.", e);
  }
}