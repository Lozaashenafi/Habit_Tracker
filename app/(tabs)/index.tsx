import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Info } from 'lucide-react-native';
import { HabitCard } from '../../src/components/HabitCard';
import { ProgressBar } from '../../src/components/ProgressBar';
import { useHabits } from '../context/HabitContext';

export default function TodayScreen() {
  const { habits, progress, stats, weeklyData, toggleHabit, isLoading } = useHabits();
  
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B0F14] justify-center items-center">
        <ActivityIndicator size="large" color="#4ADE80" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B0F14]">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View className="mt-8 mb-6">
          <Text className="text-[#475569] font-bold uppercase tracking-widest text-[11px] mb-2">
            {dayName}, {monthDay}
          </Text>
          <View className="flex-row justify-between items-end">
            <Text className="text-white text-[44px] font-bold tracking-tighter leading-none">Daily Ritual</Text>
            <View className="items-end">
              <Text className="text-[#4ADE80] text-[52px] font-bold leading-none">{progress}%</Text>
              <Text className="text-[#475569] text-[10px] font-bold uppercase tracking-tighter">Progress</Text>
            </View>
          </View>
          
          <ProgressBar progress={progress} height={10} />
        </View>

        {/* Consistency Streak */}
        <View className="bg-[#14191F] p-5 rounded-[24px] mb-10">
          <View className="flex-row justify-between mb-5">
            <Text className="text-[#475569] text-[10px] font-bold uppercase tracking-widest">Consistency Streak</Text>
            <Text className="text-[#4ADE80] text-[10px] font-bold tracking-widest">{stats.currentStreak} Days</Text>
          </View>
          <View className="flex-row justify-between">
            {stats.currentStreak > 0 && Array.from({ length: Math.min(stats.currentStreak, 7) }).map((_, i) => (
              <View 
                key={i} 
                className="h-14 w-[12%] rounded-lg bg-[#4ADE80]" 
                style={{ opacity: 0.3 + (i * 0.1) }} 
              />
            ))}
            {stats.currentStreak === 0 && Array.from({ length: 7 }).map((_, i) => (
              <View key={i} className="h-14 w-[12%] rounded-lg bg-[#1C2229]" />
            ))}
          </View>
        </View>

        <Text className="text-white text-[20px] font-bold mb-5">Core Protocols</Text>
        
        {/* Habit List */}
        {habits.map((item) => (
          <HabitCard
            key={item.id}
            id={item.id}
            title={item.title}
            desc={item.desc}
            completed={item.completed}
            icon={item.icon}
            onToggle={() => toggleHabit(item.id)}
          />
        ))}

        {/* Weekly Distribution Chart */}
        <View className="bg-[#14191F] p-6 rounded-[32px] mt-4 mb-32 relative">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-white font-bold text-sm">Weekly Distribution</Text>
            <Info color="#475569" size={18} />
          </View>
          
          <View className="flex-row items-end justify-between h-32 px-1">
            {weeklyData.map((h, i) => (
              <View key={i} className="items-center w-[11%]">
                <View 
                  className={`w-full rounded-sm ${h > 0 ? 'bg-[#4ADE80]' : 'bg-[#4ADE80]/20'}`} 
                  style={{ height: `${h}%` }} 
                />
                <Text className="text-[#475569] text-[9px] font-bold mt-4">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}