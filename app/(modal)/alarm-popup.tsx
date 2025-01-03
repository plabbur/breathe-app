import { View, Text } from "react-native";
import React from "react";

const AlarmPopup = () => {
  return (
    <View className="bg-black/60">
      <Text className="text-white font-medium text-2xl">Alarm</Text>
      <View className="bg-green-500 px-10 rounded-full">
        <Text className="mx-10">Stop</Text>
      </View>
    </View>
  );
};

export default AlarmPopup;
