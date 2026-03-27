import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Flame, Trophy, Activity, Info, TrendingUp, RefreshCw, Download, Sparkles, Target, Award } from 'lucide-react-native';
import { useHabits } from '../context/HabitContext';
import { SafeAreaView } from 'react-native-safe-area-context'; // New import

// Motivational messages for different scenarios
const getMotivationalMessage = (streak: number, completionRate: number, totalHabits: number) => {
  const messages = [
    {
      condition: streak === 0,
      message: "💪 Start today! Every great journey begins with a single step. Your first day of consistency awaits!",
      icon: Sparkles,
      color: "#4ADE80"
    },
    {
      condition: streak >= 1 && streak < 3,
      message: `🔥 Day ${streak}! You're building momentum. Keep showing up - consistency is the key to transformation!`,
      icon: Flame,
      color: "#F59E0B"
    },
    {
      condition: streak >= 3 && streak < 7,
      message: `⚡ ${streak} days strong! You're forming new neural pathways. Science shows habits stick after 21 days - you're on your way!`,
      icon: TrendingUp,
      color: "#10B981"
    },
    {
      condition: streak >= 7 && streak < 14,
      message: `🌟 ${streak} day streak! Amazing work! You're now in the top 10% of consistency performers. The compound effect is real!`,
      icon: Award,
      color: "#3B82F6"
    },
    {
      condition: streak >= 14 && streak < 30,
      message: `🏆 ${streak} days! You're crushing it! At this rate, you're building unshakeable discipline. Keep the momentum going!`,
      icon: Trophy,
      color: "#8B5CF6"
    },
    {
      condition: streak >= 30,
      message: `👑 ${streak} DAY STREAK! LEGENDARY STATUS! You've mastered the art of consistency. You're an inspiration to yourself and others!`,
      icon: Award,
      color: "#EF4444"
    },
    {
      condition: completionRate === 100 && totalHabits > 0,
      message: "🎯 PERFECT DAY! You've completed all your habits! This is what peak performance looks like. Celebrate this win!",
      icon: Target,
      color: "#4ADE80"
    },
    {
      condition: completionRate >= 80 && completionRate < 100,
      message: `📈 ${completionRate}% completion rate! Excellent progress! Just a few more habits and you'll hit perfection.`,
      icon: TrendingUp,
      color: "#10B981"
    },
    {
      condition: completionRate >= 50 && completionRate < 80,
      message: `🌱 ${completionRate}% completed! Good foundation. Tomorrow is another opportunity to push even further!`,
      icon: Sparkles,
      color: "#F59E0B"
    }
  ];

  // Find the first message that matches the conditions
  const matchingMessage = messages.find(msg => msg.condition);
  if (matchingMessage) {
    return matchingMessage;
  }

  // Default message
  return {
    message: "💫 Every habit you complete is a vote for the person you want to become. Keep going!",
    icon: Sparkles,
    color: "#4ADE80"
  };
};

export default function ProgressScreen() {
  const { stats, progress, weeklyData, consistencyData } = useHabits();
  const [motivationalMessage, setMotivationalMessage] = useState<any>(null);
  
  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Update motivational message daily (or when stats change)
  useEffect(() => {
    const message = getMotivationalMessage(stats.currentStreak, progress, stats.totalHabits);
    setMotivationalMessage(message);
  }, [stats.currentStreak, progress]);

  // Calculate average completion from weekly data
  const avgCompletion = weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length;

  const MotivationIcon = motivationalMessage?.icon || Sparkles;

  return (
    <SafeAreaView className="flex-1 bg-[#0B0F14]">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="mt-6 mb-8">
          <Text className="text-white text-[40px] font-bold tracking-tight">Progress</Text>
          <Text className="text-[#475569] text-[13px] font-medium mt-1">
            {formattedDate}
          </Text>
        </View>

        {/* Daily Motivational Message */}
        {motivationalMessage && (
          <View 
            className="bg-gradient-to-r from-[#14191F] to-[#1C2229] p-5 rounded-2xl mb-8 border border-[#4ADE80]/20"
            style={{ backgroundColor: '#14191F' }}
          >
            <View className="flex-row items-start">
              <View className="mr-3 mt-1">
                <MotivationIcon color={motivationalMessage.color} size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-[#4ADE80] text-[10px] font-bold uppercase tracking-widest mb-2">
                  Daily Insight
                </Text>
                <Text className="text-white text-[15px] leading-6 font-medium">
                  {motivationalMessage.message}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Triple Stat Stack */}
        <StatCard label="Current Streak" value={stats.currentStreak.toString()} unit="DAYS" icon={Flame} />
        <StatCard label="Longest Streak" value={stats.longestStreak.toString()} unit="DAYS" icon={Trophy} />
        <StatCard label="Avg Completion" value={Math.round(avgCompletion).toString()} unit="%" icon={Activity} />

        {/* Activity History Heatmap */}
        <View className="mt-10">
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className="text-white text-[18px] font-bold">Activity History</Text>
              <Text className="text-[#475569] text-[10px] font-bold uppercase tracking-widest mt-1">Last 180 Days of Performance</Text>
            </View>
            <View className="flex-row items-center">
               <Text className="text-[#475569] text-[9px] font-bold mr-2 uppercase">Less</Text>
               {[0.2, 0.4, 0.7, 1].map((op, i) => (
                 <View key={i} className="w-2.5 h-2.5 rounded-sm bg-[#4ADE80] mx-0.5" style={{ opacity: op }} />
               ))}
               <Text className="text-[#475569] text-[9px] font-bold ml-2 uppercase">More</Text>
            </View>
          </View>

         <View className="flex-row flex-wrap justify-between">
  {consistencyData.slice(-98).map((completed, i) => ( // Use .slice(-98) to show the most recent 3 months
    <View 
      key={i} 
      className={`w-[6.5%] mb-1.5 rounded-sm ${
        completed ? 'bg-[#4ADE80]' : 'bg-[#1C2229]'
      }`}
      style={{ 
        opacity: completed ? 1 : 0.4, 
        aspectRatio: 1 // <--- THIS FORCES THE BOX TO SHOW EVEN IF EMPTY
      }}
    />
  ))}
</View>
          <View className="flex-row justify-between px-1 mt-2">
            {['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'].map(m => (
              <Text key={m} className="text-[#475569] text-[9px] font-bold">{m}</Text>
            ))}
          </View>
        </View>

        {/* Weekly Distribution Chart */}
        <View className="mt-12">
          <Text className="text-white text-[18px] font-bold mb-6">Weekly Distribution</Text>
          <View className="bg-[#14191F] p-6 rounded-[24px]">
            <View className="flex-row items-end justify-between h-40 mb-8 border-b border-[#1C2229] pb-4">
               {weeklyData.map((value, i) => (
                 <View key={i} className="items-center w-[10%]">
                   <View className="w-full bg-[#4ADE80] rounded-t-sm" style={{ height: `${value}%` }} />
                   <Text className={`text-[10px] font-bold mt-4 ${value === Math.max(...weeklyData) ? 'text-[#4ADE80]' : 'text-[#475569]'}`}>
                     {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                   </Text>
                 </View>
               ))}
            </View>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-[#475569] text-[9px] font-bold uppercase tracking-widest">Most Active</Text>
                <Text className="text-[#4ADE80] text-[15px] font-bold mt-1">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][
                    weeklyData.indexOf(Math.max(...weeklyData))
                  ]}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-[#475569] text-[9px] font-bold uppercase tracking-widest">Completion Rate</Text>
                <Text className="text-white text-[15px] font-bold mt-1">{Math.round(avgCompletion)}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Insights Section */}
        <View className="mt-12 mb-10">
          <Text className="text-white text-[18px] font-bold mb-6">Insights</Text>
          
          <InsightCard 
            icon={TrendingUp} 
            title="Morning Consistency" 
            text={`Your completion rate is ${stats.currentStreak > 0 ? 'increasing' : 'building'}. ${stats.currentStreak > 0 ? `Keep your ${stats.currentStreak}-day streak alive!` : 'Start today to build momentum!'}`}
          />
          
          <InsightCard 
            icon={RefreshCw} 
            title="Recovery Cycle" 
            text={`${stats.longestStreak} days is your longest streak. ${stats.currentStreak === stats.longestStreak ? "You're matching your record! Push for a new milestone!" : `Aim to beat your record of ${stats.longestStreak} days!`}`}
          />

          <InsightCard 
            icon={Target} 
            title="Daily Goal" 
            text={`Complete ${stats.totalHabits - stats.completedToday} more habit${stats.totalHabits - stats.completedToday !== 1 ? 's' : ''} today to reach 100% completion. You've got this!`}
          />

          <TouchableOpacity 
            className="bg-[#1C2229] py-4 rounded-xl flex-row items-center justify-center mt-4 border border-[#2D3748]"
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert('Export Data', 'Your habit data would be exported here');
            }}
          >
            <Download color="#94A3B8" size={18} />
            <Text className="text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest ml-2">Export Data Log</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, unit, icon: Icon }: any) {
  return (
    <View className="bg-[#14191F] p-6 rounded-[24px] mb-4 border border-[#1C2229]">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-[#475569] text-[10px] font-bold uppercase tracking-widest">{label}</Text>
          <View className="flex-row items-baseline mt-4">
            <Text className="text-white text-[48px] font-bold leading-none">{value}</Text>
            <Text className="text-[#475569] text-[12px] font-bold ml-2 tracking-widest">{unit}</Text>
          </View>
        </View>
        <View className="bg-[#1C2229] p-2 rounded-lg">
          <Icon color="#4ADE80" size={18} strokeWidth={2.5} />
        </View>
      </View>
    </View>
  );
}

function InsightCard({ icon: Icon, title, text }: any) {
  return (
    <View className="flex-row mb-4">
      <View className="w-1.5 rounded-full bg-[#4ADE80] mr-3" />
      <View className="flex-1 bg-[#14191F] p-5 rounded-2xl">
        <View className="flex-row items-center mb-2">
          <Icon color="#4ADE80" size={16} strokeWidth={2} />
          <Text className="text-[#475569] text-[10px] font-bold uppercase tracking-widest ml-2">{title}</Text>
        </View>
        <Text className="text-[#D1D5DB] text-[14px] leading-5 font-medium">{text}</Text>
      </View>
    </View>
  );
}