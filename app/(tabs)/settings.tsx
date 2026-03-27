import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Zap, Dumbbell, Droplet, Moon, Clock, Palette, Database, Info, ChevronRight, Download, Trash2, Bell, BellOff } from 'lucide-react-native';
import { useHabits } from '../context/HabitContext';
import { useHabitStore } from '../../src/store/habitStore';
import { registerForPushNotificationsAsync, cancelAllNotifications, scheduleHabitReminder } from '../../src/utils/notifications';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context'; // New import

export default function SettingsScreen() {
  const { stats } = useHabits();
  const store = useHabitStore();
  const [notifications, setNotifications] = useState({
    workout: false,
    hydration: false,
    sleep: false,
  });
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationPermission(status === 'granted');
    if (status === 'granted') {
      const token = await registerForPushNotificationsAsync();
      setPushToken(token || null);
    }
  };

  const requestNotificationPermissions = async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      setPushToken(token);
      setNotificationPermission(true);
      Alert.alert('Success', 'Notifications enabled!');
    } else {
      Alert.alert('Error', 'Failed to enable notifications');
    }
  };

  const toggleNotification = async (habitType: string, enabled: boolean) => {
    setNotifications({ ...notifications, [habitType]: enabled });
    
    if (enabled && !notificationPermission) {
      await requestNotificationPermissions();
    }
    
    // Find and update the habit in store
    const habitToUpdate = store.habits.find(h => {
      if (habitType === 'workout') return h.title === 'Workout';
      if (habitType === 'hydration') return h.title === 'Hydration';
      if (habitType === 'sleep') return h.title === 'Recovery' || h.title === 'Sleep';
      return false;
    });
    
    if (habitToUpdate) {
      await store.updateHabit(habitToUpdate.id, { reminderEnabled: enabled });
    }
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset All Data',
      'This will reset all your habits and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await store.resetAllData();
            Alert.alert('Success', 'All data has been reset');
          }
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        habits: store.habits,
        history: store.history,
        streak: {
          current: store.currentStreak,
          longest: store.longestStreak,
        },
        exportDate: new Date().toISOString(),
      };
      
      Alert.alert('Export Ready', JSON.stringify(exportData, null, 2));
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleDisableAllNotifications = async () => {
    await cancelAllNotifications();
    // Update all habits to disable reminders
    for (const habit of store.habits) {
      await store.updateHabit(habit.id, { reminderEnabled: false });
    }
    setNotifications({ workout: false, hydration: false, sleep: false });
    Alert.alert('Notifications', 'All notifications have been disabled');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0F14]">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="mt-6 mb-10">
          <Text className="text-white text-[40px] font-bold tracking-tight">Settings</Text>
          <Text className="text-[#475569] text-[15px] font-medium leading-5 mt-2">
            Configure your precision laboratory environment.
          </Text>
        </View>

        {/* Statistics Overview */}
        <View className="bg-[#14191F] p-4 rounded-xl mb-6">
          <Text className="text-[#4ADE80] text-xs font-bold mb-2">Your Stats</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-[#475569] text-[10px]">Total Habits</Text>
              <Text className="text-white text-xl font-bold">{stats.totalHabits}</Text>
            </View>
            <View>
              <Text className="text-[#475569] text-[10px]">Today's Progress</Text>
              <Text className="text-white text-xl font-bold">{stats.completedToday}/{stats.totalHabits}</Text>
            </View>
            <View>
              <Text className="text-[#475569] text-[10px]">Current Streak</Text>
              <Text className="text-white text-xl font-bold">{stats.currentStreak}</Text>
            </View>
          </View>
        </View>

        {/* Notification Status */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[#4ADE80] font-bold text-[11px] uppercase tracking-[3px]">Notifications</Text>
          {notificationPermission ? (
            <View className="bg-[#4ADE80]/20 px-2 py-1 rounded flex-row items-center">
              <Bell color="#4ADE80" size={12} />
              <Text className="text-[#4ADE80] text-[9px] font-bold ml-1">Enabled</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={requestNotificationPermissions} className="bg-[#1C2229] px-2 py-1 rounded flex-row items-center">
              <BellOff color="#475569" size={12} />
              <Text className="text-[#475569] text-[9px] font-bold ml-1">Enable</Text>
            </TouchableOpacity>
          )}
        </View>

        <NotificationCard 
          icon={Dumbbell} 
          title="Morning Workout" 
          time="06:30 AM" 
          desc="Daily catalyst to trigger metabolism and mental clarity."
          enabled={notifications.workout}
          onToggle={(val: any) => toggleNotification('workout', val)}
        />

        <NotificationCard 
          icon={Droplet} 
          title="Hydration Flow" 
          time="Every 2 Hours" 
          desc="Systematic fluid intake for optimal cellular performance."
          enabled={notifications.hydration}
          onToggle={(val: any) => toggleNotification('hydration', val)}
        />

        {/* Night Sleep Special Card */}
        <View className="bg-[#1C2229] p-6 rounded-[24px] mb-10 border border-[#2D3748]/30">
          <View className="flex-row mb-6">
            <View className="bg-[#2D3748]/30 w-14 h-14 rounded-2xl items-center justify-center mr-4">
              <Moon color="#4ADE80" size={24} fill="#4ADE80" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-[18px]">Night Sleep Reminders</Text>
              <Text className="text-[#475569] text-[12px] mt-1 leading-4">Enforce recovery protocols with wind-down alerts.</Text>
            </View>
          </View>
          
          <View className="bg-[#0B0F14] flex-row items-center justify-between p-4 rounded-xl">
             <View className="flex-row items-center">
                <Text className="text-[#4ADE80] text-2xl font-bold mr-2">10:00</Text>
                <Clock color="#475569" size={18} />
             </View>
             <Switch 
                trackColor={{ false: '#1C2229', true: '#4ADE80' }} 
                thumbColor="white" 
                value={notifications.sleep}
                onValueChange={(val) => toggleNotification('sleep', val)}
              />
          </View>
        </View>

        {/* General Control Section */}
        <Text className="text-[#4ADE80] font-bold text-[11px] uppercase tracking-[3px] mb-6">General Control</Text>
        
        <View className="bg-[#14191F] rounded-[24px] overflow-hidden border border-[#1C2229] mb-10">
          <MenuRow 
            icon={Database} 
            title="Data Management" 
            detail="Export logs to JSON or CSV" 
            onPress={handleExportData}
            hasDownload 
          />
          <MenuRow 
            icon={Info} 
            title="About Lab" 
            detail="Version 2.4.0 (Stable Release)" 
            hasArrow 
            isLast 
          />
        </View>

        {/* Danger Zone */}
        <TouchableOpacity 
          onPress={handleResetAll}
          className="border border-[#F87171]/20 bg-[#F87171]/5 p-5 rounded-2xl flex-row items-center justify-center mb-8"
          activeOpacity={0.8}
        >
          <Trash2 color="#F87171" size={16} />
          <Text className="text-[#F87171] font-bold text-[11px] uppercase tracking-widest ml-2">Purge All Analytical Data</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleDisableAllNotifications}
          className="border border-[#475569]/20 bg-[#1C2229] p-5 rounded-2xl flex-row items-center justify-center mb-32"
          activeOpacity={0.8}
        >
          <BellOff color="#94A3B8" size={16} />
          <Text className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest ml-2">Disable All Notifications</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationCard({ icon: Icon, title, time, desc, enabled, onToggle }: any) {
  return (
    <View className="bg-[#14191F] p-5 rounded-[24px] mb-4 border border-[#1C2229]">
      <View className="flex-row justify-between items-center mb-6">
        <View className="bg-[#1C2229] p-3 rounded-lg">
          <Icon color="#4ADE80" size={20} />
        </View>
        <Switch
          trackColor={{ false: '#1C2229', true: '#4ADE80' }}
          thumbColor="white"
          value={enabled}
          onValueChange={onToggle}
        />
      </View>
      <Text className="text-white font-bold text-[20px] mb-2">{title}</Text>
      <View className="bg-[#0B0F14] self-start px-2 py-1 rounded flex-row items-center mb-4">
        <Clock color="#4ADE80" size={12} />
        <Text className="text-[#4ADE80] font-bold text-[12px] ml-1">{time}</Text>
      </View>
      <Text className="text-[#475569] text-[13px] leading-5">{desc}</Text>
    </View>
  );
}

function MenuRow({ icon: Icon, title, detail, hasArrow, hasDownload, onPress, isLast }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`flex-row items-center p-5 ${!isLast ? 'border-b border-[#0B0F14]' : ''}`}
    >
      <View className="bg-[#1C2229] p-2.5 rounded-xl mr-4">
        <Icon color="#D1D5DB" size={18} />
      </View>
      <View className="flex-1">
        <Text className="text-white font-bold text-[15px]">{title}</Text>
        <Text className="text-[#475569] text-[11px] mt-0.5">{detail}</Text>
      </View>
      {hasArrow && <ChevronRight color="#475569" size={18} />}
      {hasDownload && <Download color="#D1D5DB" size={18} />}
    </TouchableOpacity>
  );
}