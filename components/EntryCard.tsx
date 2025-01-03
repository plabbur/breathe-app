import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

const EntryCard = ({ title, mood, entry }) => {
  const emojis = ["😔", "😕", "😐", "🙂", "😁"];

  return (
    <View className="bg-white h-auto min-h-[200] rounded-3xl mx-5 py-5 px-5">
      <View className="relative mb-10">
        <Text className="text-xl text-gray-900 font-semibold absolute left-0">
          {title}
        </Text>
        <Text className="text-2xl text-gray-900 absolute right-0">
          {emojis[mood - 1]}
        </Text>
      </View>
      <View className="bg-gray-300 h-[0.5] mb-2" />
      <View>
        <Text className="text-base text-gray-900">{entry}</Text>
      </View>
    </View>
  );
};

export default EntryCard;
