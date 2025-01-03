import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useState } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { router } from "expo-router";
import { useAlarm } from "@/context/AlarmContext";

const ControlBar = ({
  isVisible = true,
  currentTime,
  containerStyles = "",
  isPaused,
  onPauseToggle,
  onAlarmToggle,
  onAlarmSet,
}: {
  isPaused: boolean; // Receive state as a prop
  onPauseToggle?: (state: boolean) => void;
  onAlarmToggle?: (state: boolean) => void;
  onAlarmSet?: () => void;
}) => {
  const handlePauseToggle = () => {
    onPauseToggle?.(!isPaused); // Notify parent component of toggle
  };

  const handleAlarmToggle = () => {
    onAlarmToggle?.(true);
    router.push({
      pathname: isAlarmActive() ? "(modal)/edit-alarm" : "/(modal)/set-alarm",
      params: { onAlarmSet: true },
    });
  };

  const [alarmOn, setAlarmOn] = useState(false);
  const { alarmDate } = useAlarm();

  const isAlarmActive = () => {
    const now = new Date();
    return alarmDate > now;
  };

  return (
    <View className="items-center">
      <View
        className={`flex-row bg-white rounded-full min-h-[62px] min-w-[300px] justify-center items-center ${containerStyles}`}
      >
        <Pressable onPress={handlePauseToggle} className="p-5 absolute left-0">
          <Ionicons
            name={isPaused ? "play" : "pause-outline"}
            size={28}
            color={colors.gray[400]}
          />
        </Pressable>

        <Text className={`text-gray-900 font-semibold text-lg`}>
          {currentTime}
        </Text>
        <Pressable onPress={handleAlarmToggle} className="p-5 absolute right-0">
          <Feather
            name="clock"
            size={24}
            color={isAlarmActive() ? colors.orange[400] : colors.gray[400]}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default ControlBar;
