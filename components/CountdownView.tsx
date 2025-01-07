import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { BreathingCircle } from "./BreathingCircle";
import { LinearGradient } from "expo-linear-gradient";

const CountdownView = ({ countdown }: { countdown: number }) => {
  return (
    <LinearGradient className="flex-1" colors={["#FFFFFF", "#B0FFE2"]}>
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          <SafeAreaView className="flex-1 items-center justify-between">
            <Text className="text-2xl text-gray-500 my-10">{countdown}</Text>
            <BreathingCircle
              isActive={false}
              initialSize={50}
              timeInhale={0}
              timeHold={0}
              timeExhale={0}
              toValueInhale={0}
              toValueExhale={0}
            />
            <View className="min-h-[62px] mb-5" />
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CountdownView;
