import { View, Text, SafeAreaView, Pressable } from "react-native";
import React from "react";
import { BreathingCircle } from "@/components/BreathingCircle";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

const HomeScreen = () => {
  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 my-10 mx-5 justify-between">
        <View className="flex-row items-center mt-12 mx-5">
          <View className="flex-1 items-center">
            <Text className="text-green-500 text-3xl font-playfair font-extrabold">
              Breathe
            </Text>
          </View>

          <Pressable
            onPress={() => {
              router.push("/home/options");
            }}
          >
            <Feather name="settings" size={26} color={colors.gray[500]} />
          </Pressable>
        </View>

        <BreathingCircle
          timeInhale={3}
          timeHold={0}
          timeExhale={3}
          toValueInhale={1.2}
          toValueExhale={1}
          initialSize={100}
          onBreatheStateChange={() => {}}
          isActive={true}
          showHoldAnimation={false}
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
