import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

const ActivityFrame = ({ title, icon, amount, active, fromSummary, id }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!fromSummary) {
          if (active) {
            router.push(`activity/${title.toLowerCase()}-activity`);
          }
        } else {
          router.push({
            pathname: `/activity/mood-activity`,
            params: { fromSummary: true, id: String(id) },
          });
        }
      }}
    >
      <View className="bg-white rounded-3xl shadow-md p-4 min-w-[170px] items-start m-2">
        <Text className="text-gray-400 font-semibold text-sm">{title}</Text>
        <View className="mt-4 space-x-1">
          <View>{icon}</View>
          <Text className="text-black text-2xl font-semibold">{amount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ActivityFrame;
