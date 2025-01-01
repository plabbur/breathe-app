import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import Feather from "@expo/vector-icons/Feather";
import colors from "tailwindcss/colors";

import { formatDuration, formatDate } from "@/storage";
import { router } from "expo-router";

export default function MeditationActivityWidget({ id, date, duration, mood }) {
  return (
    <View className="bg-white rounded-3xl shadow-md p-4 min-w-[200px] m-2 mx-7">
      <Text className="text-gray-400 text-sm">{formatDate(date)}</Text>
      <View className="bg-white h-[0.5] my-2" />

      <View className="flex-row pb-2 items-center">
        <Feather name="clock" size={26} color={colors.orange[400]} />
        <Text className="text-gray-900 font-medium px-2 text-lg">
          {formatDuration(duration)}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Feather name="arrow-up-circle" size={26} color={colors.green[500]} />
        <Text className="text-gray-900 font-medium px-2 text-lg">{mood}</Text>
      </View>
    </View>
  );
}
