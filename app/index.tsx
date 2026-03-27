import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkFirstTime = async () => {
      const hasOnboarded = await AsyncStorage.getItem('@has_onboarded');
      if (hasOnboarded === 'true') {
        router.replace('/(tabs)');
      }
    };
    checkFirstTime();
  }, []);

  const handleStart = async () => {
    await AsyncStorage.setItem('@has_onboarded', 'true');
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-[#0B0F14]">
      {/* Aesthetic Glow - Removed the invalid blurRadius */}
      <View 
        className="absolute -top-24 -right-24 w-96 h-96 bg-[#4ADE80]/10 rounded-full" 
        style={{ opacity: 0.5 }} 
      />

      <SafeAreaView className="flex-1 px-8 justify-between py-12">
        {/* Top Logo Section */}
        <View className="items-center mt-10">
          <View className="bg-[#14191F] p-6 rounded-[30px] border border-[#4ADE80]/20 shadow-2xl">
            <Zap color="#4ADE80" size={60} fill="#4ADE80" />
          </View>
          <Text className="text-white text-[32px] font-bold mt-8 tracking-tighter text-center">
            PERFORMANCE <Text className="text-[#4ADE80]">LAB</Text>
          </Text>
          <View className="h-1 w-12 bg-[#4ADE80] mt-2 rounded-full self-center" />
        </View>

        {/* Middle Content */}
        <View>
          <Text className="text-white text-[42px] font-bold leading-[48px] tracking-tight">
            Optimize your{"\n"}daily protocols.
          </Text>
          <Text className="text-[#475569] text-lg mt-4 leading-7 font-medium">
            Systematic habit tracking designed for high-performance individuals. 
          </Text>
        </View>

        {/* Bottom Action */}
        <View>
          <TouchableOpacity 
            onPress={handleStart}
            activeOpacity={0.9}
            className="bg-[#4ADE80] h-20 rounded-[24px] flex-row items-center justify-center shadow-xl"
          >
            <Text className="text-[#0B0F14] font-bold text-xl mr-2">Initialize System</Text>
            <ArrowRight color="#0B0F14" size={20} strokeWidth={3} />
          </TouchableOpacity>
          
          <Text className="text-[#475569] text-center mt-6 text-xs font-bold uppercase tracking-[2px]">
            Version 2.4.0 Stable
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}