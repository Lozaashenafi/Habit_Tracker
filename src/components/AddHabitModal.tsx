import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { X, Dumbbell, User, Droplet, EyeOff, Coffee, Moon, BookOpen, Zap, XCircle } from 'lucide-react-native';

const icons = [
  { name: 'dumbbell', icon: Dumbbell, label: 'Workout' },
  { name: 'user', icon: User, label: 'Walk' },
  { name: 'droplet', icon: Droplet, label: 'Hydrate' },
  { name: 'eye-off', icon: EyeOff, label: 'Focus' },
  { name: 'coffee', icon: Coffee, label: 'Coffee' },
  { name: 'moon', icon: Moon, label: 'Sleep' },
  { name: 'book-open', icon: BookOpen, label: 'Read' },
  { name: 'zap', icon: Zap, label: 'Energy' },
];

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (habit: any) => void;
}

export function AddHabitModal({ visible, onClose, onAdd }: AddHabitModalProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('dumbbell');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState('09');
  const [reminderMinute, setReminderMinute] = useState('00');
  const [reminderPeriod, setReminderPeriod] = useState('AM');

  const handleAdd = () => {
    if (title.trim()) {
      // Calculate 24-hour hour for reminder
      let hour24 = parseInt(reminderHour);
      if (reminderPeriod === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (reminderPeriod === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      
      onAdd({
        title: title.trim(),
        desc: desc.trim() || 'Daily habit tracking',
        icon: selectedIcon,
        time: `${reminderHour}:${reminderMinute} ${reminderPeriod}`,
        recurrence: 'DAILY',
        reminderEnabled,
        reminderHour: reminderEnabled ? hour24 : undefined,
        reminderMinute: reminderEnabled ? parseInt(reminderMinute) : undefined,
      });
      setTitle('');
      setDesc('');
      setSelectedIcon('dumbbell');
      setReminderEnabled(false);
      setReminderHour('09');
      setReminderMinute('00');
      setReminderPeriod('AM');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-[#0B0F14] rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-2xl font-bold">Add New Habit</Text>
              <TouchableOpacity onPress={onClose}>
                <X color="#475569" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-[#4ADE80] text-xs font-bold uppercase tracking-wider mb-2">
                Habit Name
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Morning Meditation"
                placeholderTextColor="#2D3748"
                className="bg-[#14191F] text-white p-4 rounded-xl border border-[#1C2229] mb-6"
              />

              <Text className="text-[#4ADE80] text-xs font-bold uppercase tracking-wider mb-2">
                Description (Optional)
              </Text>
              <TextInput
                value={desc}
                onChangeText={setDesc}
                placeholder="Describe your habit..."
                placeholderTextColor="#2D3748"
                multiline
                numberOfLines={3}
                className="bg-[#14191F] text-white p-4 rounded-xl border border-[#1C2229] mb-6"
              />

              <Text className="text-[#4ADE80] text-xs font-bold uppercase tracking-wider mb-3">
                Choose Icon
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                <View className="flex-row gap-3">
                  {icons.map((icon) => (
                    <TouchableOpacity
                      key={icon.name}
                      onPress={() => setSelectedIcon(icon.name)}
                      className={`w-16 h-16 rounded-xl items-center justify-center ${
                        selectedIcon === icon.name
                          ? 'bg-[#4ADE80]'
                          : 'bg-[#14191F] border border-[#1C2229]'
                      }`}
                    >
                      <icon.icon
                        color={selectedIcon === icon.name ? '#0B0F14' : '#4ADE80'}
                        size={28}
                      />
                      <Text
                        className={`text-[10px] mt-1 ${
                          selectedIcon === icon.name ? 'text-[#0B0F14]' : 'text-[#475569]'
                        }`}
                      >
                        {icon.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Reminder Settings */}
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <XCircle color="#4ADE80" size={18} />
                    <Text className="text-[#4ADE80] text-xs font-bold uppercase tracking-wider ml-2">
                      Daily Reminder
                    </Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#1C2229', true: '#4ADE80' }}
                    thumbColor="white"
                    value={reminderEnabled}
                    onValueChange={setReminderEnabled}
                  />
                </View>

                {reminderEnabled && (
                  <View className="bg-[#14191F] p-4 rounded-xl border border-[#1C2229]">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <XCircle color="#475569" size={16} />
                        <Text className="text-white text-sm ml-2">Reminder Time</Text>
                      </View>
                      <View className="flex-row items-center">
                        <View className="flex-row bg-[#1C2229] rounded-lg">
                          <TextInput
                            value={reminderHour}
                            onChangeText={setReminderHour}
                            keyboardType="numeric"
                            maxLength={2}
                            className="text-white text-lg font-bold px-3 py-2 w-14 text-center"
                          />
                          <Text className="text-white text-lg font-bold self-center">:</Text>
                          <TextInput
                            value={reminderMinute}
                            onChangeText={setReminderMinute}
                            keyboardType="numeric"
                            maxLength={2}
                            className="text-white text-lg font-bold px-3 py-2 w-14 text-center"
                          />
                        </View>
                        <View className="flex-row ml-2">
                          <TouchableOpacity
                            onPress={() => setReminderPeriod('AM')}
                            className={`px-3 py-2 rounded-l-lg ${
                              reminderPeriod === 'AM' ? 'bg-[#4ADE80]' : 'bg-[#1C2229]'
                            }`}
                          >
                            <Text className={reminderPeriod === 'AM' ? 'text-[#0B0F14] font-bold' : 'text-[#475569]'}>
                              AM
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setReminderPeriod('PM')}
                            className={`px-3 py-2 rounded-r-lg ${
                              reminderPeriod === 'PM' ? 'bg-[#4ADE80]' : 'bg-[#1C2229]'
                            }`}
                          >
                            <Text className={reminderPeriod === 'PM' ? 'text-[#0B0F14] font-bold' : 'text-[#475569]'}>
                              PM
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={handleAdd}
                className="bg-[#4ADE80] h-14 rounded-xl items-center justify-center mb-4"
              >
                <Text className="text-[#0B0F14] font-bold text-lg">Create Habit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}