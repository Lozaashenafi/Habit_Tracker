import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { LayoutDashboard, BarChart2, CalendarDays, Settings, Zap, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { AddHabitModal } from '../../src/components/AddHabitModal';
import { useHabits } from '../context/HabitContext';
import "../../global.css";
import { SafeAreaView } from 'react-native-safe-area-context'; 

export default function TabLayout() {
  const { addHabit } = useHabits();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1419' }}>
      {/* 1. FIXED TOP SPACE: Added edges={['top']} 
          This prevents the header from adding extra space at the bottom of the bar */}
      <SafeAreaView className="bg-[#0F1419]" edges={['top']}>
        <View className="px-6 py-3 flex-row justify-between items-center border-b border-slate-800/30">
          <View className="flex-row items-center">
            <Text className="text-[#4ADE80] font-bold text-xl tracking-tight">
              Performance Lab
            </Text>
          </View>
          <Zap color="#4ADE80" size={22} fill="#4ADE80" />
        </View>
      </SafeAreaView>

      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { 
              backgroundColor: '#0F1419', 
              borderTopColor: '#1C2229', 
              height: 70,           // 2. FIXED BOTTOM SPACE: Reduced from 90 to 70
              paddingBottom: 12,    // 3. FIXED BOTTOM SPACE: Reduced from 25 to 12
            },
            tabBarActiveTintColor: '#22C55E',
            tabBarInactiveTintColor: '#475569',
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: 'bold',
              letterSpacing: 0.5,
              marginBottom: 5,
            }
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'TODAY',
              tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={22} />,
            }}
          />
          <Tabs.Screen
            name="progress"
            options={{
              title: 'PROGRESS',
              tabBarIcon: ({ color }) => <BarChart2 color={color} size={22} />,
            }}
          />
          <Tabs.Screen
            name="manage"
            options={{
              title: 'MANAGE',
              tabBarIcon: ({ color }) => <CalendarDays color={color} size={22} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'SETTINGS',
              tabBarIcon: ({ color }) => <Settings color={color} size={22} />,
            }}
          />
        </Tabs>

        {/* Global Floating Plus Button (Kept exactly as requested) */}
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="absolute bottom-8 self-center bg-[#4ADE80] w-16 h-16 rounded-full items-center justify-center shadow-2xl"
          style={{ 
            elevation: 10,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            zIndex: 1000,
          }}
        >
          <Plus color="#0B0F14" size={32} strokeWidth={3} />
        </TouchableOpacity>
      </View>

      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addHabit}
      />
    </View>
  );
}