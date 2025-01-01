import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { BreathingCircle } from "@/components/BreathingCircle";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const HomeScreen = () => {
  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 my-10 mx-5 justify-between items-center">
        <Text className="text-green-500 text-3xl font-playfair font-extrabold my-5 mt-12 mx-5">
          Breathe
        </Text>
        <BreathingCircle
          timeInhale={3}
          timeHold={0}
          timeExhale={3}
          toValueInhale={1.2}
          toValueExhale={1}
          initialSize={100}
          onBreatheStateChange={() => {}}
          isActive={true}
        />
        <CustomButton
          onPress={() => {
            router.push("/(modal)/pre-checkup");
          }}
          title="Begin"
        />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
