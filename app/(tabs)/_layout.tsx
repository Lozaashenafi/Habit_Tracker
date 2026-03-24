import { Tabs } from 'expo-router';
import { View, Text, Image, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { LayoutDashboard, BarChart2, CalendarDays, Settings, Zap, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { AddHabitModal } from '../../src/components/AddHabitModal';
import { useHabits } from '../context/HabitContext';
import "../../global.css";

export default function TabLayout() {
  const { addHabit } = useHabits();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* Persistent Header */}
      <SafeAreaView className="bg-[#0F1419]">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-slate-800/30">
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-[#1C2229] mr-3 border border-[#2D3748] overflow-hidden">
              <Image 
                source={{ uri: 'https://avatar.iran.liara.run/public/job/designer/male' }} 
                className="w-full h-full" 
              />
            </View>
            <View>
              <Text className="text-[#4ADE80] font-bold text-xl tracking-tight leading-tight">
                Performance Lab
              </Text>
            </View>
          </View>
          <Zap color="#4ADE80" size={22} fill="#4ADE80" />
        </View>
      </SafeAreaView>

      {/* The Bottom Tabs Navigation */}
      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { 
              backgroundColor: '#0F1419', 
              borderTopColor: '#1C2229', 
              height: 90,
              paddingTop: 10,
              paddingBottom: 25
            },
            tabBarActiveTintColor: '#22C55E',
            tabBarInactiveTintColor: '#475569',
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: 'bold',
              letterSpacing: 0.5,
            }
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'TODAY',
              tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
            }}
          />
          <Tabs.Screen
            name="progress"
            options={{
              title: 'PROGRESS',
              tabBarIcon: ({ color }) => <BarChart2 color={color} size={24} />,
            }}
          />
          <Tabs.Screen
            name="manage"
            options={{
              title: 'MANAGE',
              tabBarIcon: ({ color }) => <CalendarDays color={color} size={24} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'SETTINGS',
              tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
            }}
          />
        </Tabs>

        {/* Global Floating Plus Button */}
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="absolute bottom-24 self-center bg-[#4ADE80] w-16 h-16 rounded-full items-center justify-center shadow-2xl"
          style={{ 
            elevation: 10,
            shadowColor: '#4ADE80',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            zIndex: 1000,
          }}
        >
          <Plus color="#0B0F14" size={32} strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Global Add Habit Modal */}
      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addHabit}
      />
    </>
  );
}