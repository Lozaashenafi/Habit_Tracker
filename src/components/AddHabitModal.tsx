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
} from 'react-native';
import { X, Dumbbell, User, Droplet, EyeOff, Coffee, Moon } from 'lucide-react-native';

const icons = [
  { name: 'dumbbell', icon: Dumbbell, label: 'Workout' },
  { name: 'user', icon: User, label: 'Walking' },
  { name: 'droplet', icon: Droplet, label: 'Hydration' },
  { name: 'eye-off', icon: EyeOff, label: 'Focus' },
  { name: 'coffee', icon: Coffee, label: 'Coffee' },
  { name: 'moon', icon: Moon, label: 'Sleep' },
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

  const handleAdd = () => {
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        desc: desc.trim() || 'Daily habit tracking',
        icon: selectedIcon,
      });
      setTitle('');
      setDesc('');
      setSelectedIcon('dumbbell');
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
          <View className="bg-[#0B0F14] rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-2xl font-bold">Add New Habit</Text>
              <TouchableOpacity onPress={onClose}>
                <X color="#475569" size={24} />
              </TouchableOpacity>
            </View>

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
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

            <TouchableOpacity
              onPress={handleAdd}
              className="bg-[#4ADE80] h-14 rounded-xl items-center justify-center"
            >
              <Text className="text-[#0B0F14] font-bold text-lg">Create Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}