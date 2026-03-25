import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if we're in Expo Go
const IS_EXPO_GO = Constants.appOwnership === 'expo';

// Configure notification handler (only works in dev builds)
if (!IS_EXPO_GO) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Request permissions and get push token
export async function registerForPushNotificationsAsync() {
  // Notifications don't work in Expo Go with SDK 53+
  if (IS_EXPO_GO) {
    console.log('Notifications are not supported in Expo Go. Please use a development build.');
    return null;
  }
  
  let token;
  
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('habits', {
        name: 'Habit Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4ADE80',
      });
    } catch (error) {
      console.log('Error setting notification channel:', error);
    }
  }
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }
  
  try {
    let projectId;
    try {
      const expoConfig = Constants.expoConfig;
      projectId = expoConfig?.extra?.eas?.projectId;
      
      if (!projectId && Constants.easConfig) {
        projectId = Constants.easConfig.projectId;
      }
    } catch (e) {
      console.log('Could not get project ID:', e);
    }
    
    if (projectId) {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } else {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }
    console.log('Push token:', token);
  } catch (error) {
    console.log('Error getting push token:', error);
  }
  
  return token;
}

// Schedule a daily reminder
export async function scheduleDailyReminder(
  title: string, 
  body: string, 
  hour: number, 
  minute: number = 0
) {
  // Notifications don't work in Expo Go with SDK 53+
  if (IS_EXPO_GO) {
    console.log('Notifications are not supported in Expo Go. Please use a development build.');
    return null;
  }
  
  try {
    // Validate hour and minute
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      console.error('Invalid time for notification:', { hour, minute });
      return null;
    }
    
    // Use the correct trigger format for daily notifications
    const trigger = {
      hour,
      minute,
      repeats: true,
    } as Notifications.NotificationTriggerInput;
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: { type: 'habit_reminder', title },
        ...(Platform.OS === 'android' && {
          priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
      },
      trigger,
    });
    console.log(`Scheduled notification for ${title} at ${hour}:${minute}, ID: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

// Schedule a habit reminder
export async function scheduleHabitReminder(habit: {
  title: string;
  time?: string;
  reminderEnabled: boolean;
  reminderHour?: number;
  reminderMinute?: number;
}) {
  if (!habit.reminderEnabled || IS_EXPO_GO) return;
  
  let hour = habit.reminderHour;
  let minute = habit.reminderMinute;
  
  if (habit.time && (hour === undefined || minute === undefined)) {
    const parsed = parseTimeString(habit.time);
    hour = parsed.hour;
    minute = parsed.minute;
  }
  
  if (hour !== undefined && minute !== undefined) {
    await scheduleDailyReminder(
      `⏰ ${habit.title}`,
      `Time to complete your ${habit.title} habit!`,
      hour,
      minute
    );
  }
}

// Parse time string
function parseTimeString(timeStr: string): { hour: number; minute: number } {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return { hour: 9, minute: 0 };
  
  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const period = match[3]?.toUpperCase();
  
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return { hour, minute };
}

// Cancel all scheduled notifications
export async function cancelAllNotifications() {
  if (IS_EXPO_GO) return;
  
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
}

// Cancel a specific notification by ID
export async function cancelNotification(notificationId: string) {
  if (IS_EXPO_GO) return;
  
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Cancelled notification: ${notificationId}`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

// Get all scheduled notifications
export async function getAllScheduledNotifications() {
  if (IS_EXPO_GO) return [];
  
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

// Check if notifications are enabled
export async function areNotificationsEnabled() {
  if (IS_EXPO_GO) return false;
  
  try {
    const settings = await Notifications.getPermissionsAsync();
    return settings.status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
}