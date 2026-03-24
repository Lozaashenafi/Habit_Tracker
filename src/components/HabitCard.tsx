import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Dumbbell, User, Droplet, EyeOff, Coffee, Moon, Check } from 'lucide-react-native';

const iconMap: Record<string, any> = {
  dumbbell: Dumbbell,
  user: User,
  droplet: Droplet,
  'eye-off': EyeOff,
  coffee: Coffee,
  moon: Moon,
};

interface HabitCardProps {
  id: string;
  title: string;
  desc: string;
  completed: boolean;
  icon: string;
  onToggle: () => void;
}

export function HabitCard({ id, title, desc, completed, icon, onToggle }: HabitCardProps) {
  const IconComponent = iconMap[icon] || Dumbbell;
  const scaleValue = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle();
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <Animated.View 
        style={{ transform: [{ scale: scaleValue }] }}
        className={`bg-[#14191F] p-4 rounded-2xl mb-3 flex-row items-center border ${
          completed ? 'border-[#4ADE80]/30' : 'border-[#1C2229]'
        }`}
      >
        <View className={`w-12 h-12 rounded-lg items-center justify-center mr-4 ${
          completed ? 'bg-[#4ADE80]/20' : 'bg-[#1C2229]'
        }`}>
          <IconComponent color={completed ? '#4ADE80' : '#475569'} size={22} />
        </View>
        
        <View className="flex-1">
          <Text className={`font-bold text-[16px] ${completed ? 'text-[#4ADE80]' : 'text-white'}`}>
            {title}
          </Text>
          <Text className="text-[#475569] text-[12px] mt-0.5">{desc}</Text>
        </View>

        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          completed 
            ? 'bg-[#4ADE80] border-[#4ADE80]' 
            : 'border-[#475569] bg-transparent'
        }`}>
          {completed && <Check color="#0B0F14" size={14} />}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}