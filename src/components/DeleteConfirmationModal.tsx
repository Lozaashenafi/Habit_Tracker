import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Trash2, X } from 'lucide-react-native';

interface DeleteConfirmationModalProps {
  visible: boolean;
  habitTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({ 
  visible, 
  habitTitle, 
  onClose, 
  onConfirm 
}: DeleteConfirmationModalProps) {
  const scaleValue = React.useRef(new Animated.Value(0.8)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 8,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          }}
          className="bg-[#14191F] rounded-3xl w-full overflow-hidden border border-[#2D3748]"
        >
          {/* Header */}
          <View className="p-6 border-b border-[#1C2229]">
            <View className="flex-row items-center justify-between">
              <View className="bg-[#F87171]/20 w-12 h-12 rounded-full items-center justify-center">
                <Trash2 color="#F87171" size={24} />
              </View>
              <TouchableOpacity onPress={onClose} className="p-2">
                <X color="#475569" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View className="p-6">
            <Text className="text-white text-xl font-bold mb-2">
              Delete Habit
            </Text>
            <Text className="text-[#94A3B8] text-[15px] leading-6 mb-6">
              Are you sure you want to delete "{habitTitle}"? This action cannot be undone and will remove all associated data.
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-[#1C2229] py-4 rounded-xl border border-[#2D3748]"
                activeOpacity={0.7}
              >
                <Text className="text-[#94A3B8] font-bold text-center text-[15px]">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={onConfirm}
                className="flex-1 bg-[#F87171] py-4 rounded-xl"
                activeOpacity={0.7}
              >
                <Text className="text-white font-bold text-center text-[15px]">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}