import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const StreakActivity = () => {
  return (
    <View className="flex-1 bg-gray-200">
      <SafeAreaView className="flex-1 mx-5">
        <Text className="text-gray-900 text-3xl font-semibold my-5 mx-5">
          Streak
        </Text>
      </SafeAreaView>
    </View>
  );
};

export default StreakActivity;
