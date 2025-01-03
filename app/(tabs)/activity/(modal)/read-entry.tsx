import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const ReadEntry = () => {
  const emojis = ["😔", "😕", "😐", "🙂", "😁"];

  const { title } = useLocalSearchParams();
  const { mood } = useLocalSearchParams();
  const { entry } = useLocalSearchParams();

  return (
    <View className="px-5 py-5">
      <View className="flex-1 justify-center my-4">
        <Text className="text-xl text-gray-900 font-semibold absolute left-0">
          {title}
        </Text>
        <Text className="text-2xl text-gray-900 absolute right-0">
          {emojis[mood - 1]}
        </Text>
      </View>
      <View className="bg-gray-300 h-[0.5] my-2 mb-5" />
      <ScrollView>
        <View>
          <Text className="text-base text-gray-900">{entry}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReadEntry;
