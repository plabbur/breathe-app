import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import TestCalendar from "./testcalendar";

const BreathsActivity = () => {
  return (
    <View className="flex-1 bg-gray-200">
      <TestCalendar />
      {/* <SafeAreaView className="flex-1 mx-5">
        <Text className="text-gray-900 text-3xl font-semibold my-5 mx-5">Breaths</Text>
      </SafeAreaView> */}
    </View>
  );
};

export default BreathsActivity;
