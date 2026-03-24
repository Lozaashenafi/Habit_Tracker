import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Search, BookOpen, Dumbbell, Droplet, UserPlus, Trash2, BarChart3, Calendar, CheckCircle2 } from 'lucide-react-native';
import { useHabits } from '../context/HabitContext';
import { AddHabitModal } from '../../src/components/AddHabitModal';
import { DeleteConfirmationModal } from '../../src/components/DeleteConfirmationModal';

export default function ManageScreen() {
  const { habits, addHabit, deleteHabit, stats, weeklyData } = useHabits();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHabitForStats, setSelectedHabitForStats] = useState<any>(null);

  const filteredHabits = habits.filter(habit =>
    habit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePress = (habit: any) => {
    setSelectedHabit(habit);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedHabit) {
      deleteHabit(selectedHabit.id);
      setDeleteModalVisible(false);
      setSelectedHabit(null);
    }
  };

  // Calculate consistency metrics for a specific habit
  // This would require storing habit-specific history, but for now we'll show general metrics
  const getHabitStats = (habitId: string) => {
    // In a real implementation, you'd track completion per habit per day
    // For now, return mock data based on general stats
    return {
      completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
      streakDays: Math.floor(Math.random() * stats.currentStreak) || 0,
      totalCompletions: Math.floor(Math.random() * 30) + 10,
      bestStreak: Math.floor(Math.random() * 20) + 5,
    };
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0F14]">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="mt-6 mb-8">
          <Text className="text-white text-[40px] font-bold tracking-tight">Manage Habits</Text>
          <Text className="text-[#475569] text-[15px] font-medium leading-5 mt-2">
            Optimize your performance protocol by adjusting your daily technical requirements.
          </Text>
        </View>

        {/* Search Bar */}
        <View className="mb-6">
          <View className="relative">
            <View className="absolute left-4 top-4 z-10">
              <Search color="#475569" size={18} />
            </View>
            <TextInput 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search habits..." 
              placeholderTextColor="#2D3748"
              className="bg-[#14191F] text-white p-4 pl-12 rounded-xl border border-[#1C2229] text-[15px]"
            />
          </View>
        </View>

        {/* Add New Habit Button */}
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="bg-[#4ADE80] h-14 rounded-xl items-center justify-center mb-10"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <UserPlus color="#0B0F14" size={24} strokeWidth={2.5} />
            <Text className="text-[#0B0F14] font-bold text-[16px] ml-2">Initialize New Routine</Text>
          </View>
        </TouchableOpacity>

        {/* Active Habits Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-[12px] font-bold uppercase tracking-widest">Active Habits</Text>
          <View className="bg-[#1C2229] px-2 py-1 rounded-md">
            <Text className="text-[#4ADE80] text-[9px] font-bold">{habits.length} TOTAL</Text>
          </View>
        </View>

        {/* Habits List */}
        {filteredHabits.map((item) => {
          const habitStats = getHabitStats(item.id);
          const [isExpanded, setIsExpanded] = useState(false);
          
          return (
            <View key={item.id} className="mb-4">
              <TouchableOpacity 
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}
              >
                <View className="flex-row">
                  <View className={`w-1.5 rounded-full mr-2 ${item.completed ? 'bg-[#4ADE80]' : 'bg-[#1C2229]'}`} />
                  
                  <View className="flex-1 bg-[#14191F] p-4 rounded-2xl">
                    <View className="flex-row items-center">
                      <View className="bg-[#1C2229] w-12 h-12 rounded-lg items-center justify-center mr-4">
                        {item.icon === 'dumbbell' && <Dumbbell color="#4ADE80" size={20} />}
                        {item.icon === 'droplet' && <Droplet color="#4ADE80" size={20} />}
                        {item.icon === 'book-open' && <BookOpen color="#4ADE80" size={20} />}
                        {(!item.icon || item.icon === 'user') && <UserPlus color="#4ADE80" size={20} />}
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-[17px]">{item.title}</Text>
                        <Text className="text-[#475569] text-[11px] mt-1">{item.desc}</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleDeletePress(item)}
                        className="p-2"
                      >
                        <Trash2 color="#F87171" size={20} />
                      </TouchableOpacity>
                    </View>

                    {/* Expanded Stats Section */}
                    {isExpanded && (
                      <Animated.View className="mt-4 pt-4 border-t border-[#1C2229]">
                        <Text className="text-[#4ADE80] text-[10px] font-bold uppercase tracking-widest mb-3">
                          Consistency Metrics
                        </Text>
                        
                        <View className="flex-row justify-between mb-3">
                          <View className="flex-1">
                            <Text className="text-[#475569] text-[9px] font-bold mb-1">COMPLETION RATE</Text>
                            <View className="flex-row items-center">
                              <Text className="text-white text-xl font-bold">{habitStats.completionRate}%</Text>
                              <BarChart3 color="#4ADE80" size={14} className="ml-2" />
                            </View>
                          </View>
                          <View className="flex-1">
                            <Text className="text-[#475569] text-[9px] font-bold mb-1">CURRENT STREAK</Text>
                            <View className="flex-row items-center">
                              <Text className="text-white text-xl font-bold">{habitStats.streakDays}</Text>
                              <Calendar color="#4ADE80" size={14} className="ml-2" />
                            </View>
                          </View>
                        </View>

                        <View className="flex-row justify-between">
                          <View className="flex-1">
                            <Text className="text-[#475569] text-[9px] font-bold mb-1">TOTAL COMPLETIONS</Text>
                            <Text className="text-white text-xl font-bold">{habitStats.totalCompletions}</Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-[#475569] text-[9px] font-bold mb-1">BEST STREAK</Text>
                            <Text className="text-white text-xl font-bold">{habitStats.bestStreak}</Text>
                          </View>
                        </View>

                        {/* Progress Bar */}
                        <View className="mt-4">
                          <View className="h-2 bg-[#1C2229] rounded-full overflow-hidden">
                            <View 
                              className="h-full bg-[#4ADE80] rounded-full"
                              style={{ width: `${habitStats.completionRate}%` }}
                            />
                          </View>
                          <View className="flex-row justify-between mt-2">
                            <Text className="text-[#475569] text-[9px]">Consistency Score</Text>
                            <Text className="text-[#4ADE80] text-[9px] font-bold">{habitStats.completionRate}%</Text>
                          </View>
                        </View>
                      </Animated.View>
                    )}

                    {/* Expand/Collapse Indicator */}
                    <View className="items-center mt-2">
                      <View className={`w-6 h-1 bg-[#1C2229] rounded-full ${isExpanded ? 'opacity-100' : 'opacity-50'}`} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Overall Consistency Metrics Grid */}
        <View className="mt-10 mb-20">
          <Text className="text-white text-[11px] font-bold uppercase tracking-widest mb-4">Overall Consistency Metrics</Text>
          <View className="bg-[#14191F] p-5 rounded-2xl">
            <View className="flex-row justify-between mb-6">
              <View>
                <Text className="text-[#475569] text-[10px] mb-1">Overall Success Rate</Text>
                <Text className="text-white text-2xl font-bold">{stats.avgCompletion}%</Text>
              </View>
              <View>
                <Text className="text-[#475569] text-[10px] mb-1">Active Streak</Text>
                <Text className="text-white text-2xl font-bold">{stats.currentStreak} days</Text>
              </View>
              <View>
                <Text className="text-[#475569] text-[10px] mb-1">Best Streak</Text>
                <Text className="text-white text-2xl font-bold">{stats.longestStreak} days</Text>
              </View>
            </View>
            
            <View className="h-2 bg-[#1C2229] rounded-full overflow-hidden mb-4">
              <View 
                className="h-full bg-[#4ADE80] rounded-full"
                style={{ width: `${stats.avgCompletion}%` }}
              />
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-[#475569] text-[9px]">Weekly Average</Text>
              <Text className="text-[#4ADE80] text-[9px] font-bold">
                {Math.round(weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length)}%
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addHabit}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        habitTitle={selectedHabit?.title || ''}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}