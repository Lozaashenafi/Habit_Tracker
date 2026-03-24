import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Switch, TouchableOpacity, Image, Alert } from 'react-native';
import { Zap, Dumbbell, Droplet, Moon, Clock, Palette, Database, Info, ChevronRight, Download, Trash2, Home, BarChart2, Calendar, Settings as SettingsIcon } from 'lucide-react-native';
import { useHabits } from '../context/HabitContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { resetDay, stats } = useHabits();
  const [notifications, setNotifications] = useState({
    workout: true,
    hydration: true,
    sleep: true,
  });

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
            await AsyncStorage.clear();
            Alert.alert('Success', 'All data has been reset');
            // You might want to reload the app or refresh context here
          }
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const allData = await AsyncStorage.multiGet([
        '@habits',
        '@habit_history',
        '@streak_data'
      ]);
      
      const exportData = {
        habits: allData[0][1] ? JSON.parse(allData[0][1]) : [],
        history: allData[1][1] ? JSON.parse(allData[1][1]) : {},
        streak: allData[2][1] ? JSON.parse(allData[2][1]) : {},
        exportDate: new Date().toISOString(),
      };
      
      // In a real app, you'd share this data
      Alert.alert('Export Ready', JSON.stringify(exportData, null, 2));
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
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

        {/* Notifications Section */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-[#4ADE80] font-bold text-[11px] uppercase tracking-[3px]">Notifications</Text>
          <View className="bg-[#1C2229] px-2 py-1 rounded">
            <Text className="text-[#475569] text-[9px] font-bold uppercase">Active Protocol</Text>
          </View>
        </View>

        <NotificationCard 
          icon={Dumbbell} 
          title="Morning Workout" 
          time="06:30 AM" 
          desc="Daily catalyst to trigger metabolism and mental clarity."
          enabled={notifications.workout}
          onToggle={() => setNotifications({...notifications, workout: !notifications.workout})}
        />

        <NotificationCard 
          icon={Droplet} 
          title="Hydration Flow" 
          time="Every 2 Hours" 
          desc="Systematic fluid intake for optimal cellular performance."
          enabled={notifications.hydration}
          onToggle={() => setNotifications({...notifications, hydration: !notifications.hydration})}
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
                onValueChange={() => setNotifications({...notifications, sleep: !notifications.sleep})}
              />
          </View>
        </View>

        {/* General Control Section */}
        <Text className="text-[#4ADE80] font-bold text-[11px] uppercase tracking-[3px] mb-6">General Control</Text>
        
        <View className="bg-[#14191F] rounded-[24px] overflow-hidden border border-[#1C2229] mb-10">
          <MenuRow icon={Palette} title="Visual Theme" detail="High-contrast dark editorial" hasArrow />
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
          className="border border-[#F87171]/20 bg-[#F87171]/5 p-5 rounded-2xl flex-row items-center justify-center mb-32"
          activeOpacity={0.8}
        >
          <Trash2 color="#F87171" size={16} />
          <Text className="text-[#F87171] font-bold text-[11px] uppercase tracking-widest ml-2">Purge All Analytical Data</Text>
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