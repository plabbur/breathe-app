import { View, Text, SafeAreaView, Pressable } from "react-native";
import React, { useRef } from "react";
import ChartAverage from "@/components/ChartAverage";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

const MoodActivity = () => {
  const { fromSummary } = useLocalSearchParams();
  const { id } = useLocalSearchParams();

  const renderBackButton = () => {
    return (
      <Pressable
        className="p-2"
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 0,
          zIndex: 10, // Ensure the button is above overlapping elements
        }}
        onPress={() => {
          router.dismiss();
          router.push({
            pathname: "/meditation-summary",
            params: { id: id },
            // Pass the id as a query parameter
          }); // Navigate to the previous screen
        }}
      >
        <Feather name="chevron-left" size={38} color={colors.gray[900]} />
        <Text
          style={{
            marginLeft: 0,
            fontSize: 18,
            color: colors.gray[900],
          }}
        >
          Back
        </Text>
      </Pressable>
    );
  };
  return (
    <View className="flex-1 bg-gray-200">
      <SafeAreaView className="flex-1">
        <View style={{ marginTop: -20 }}>{renderBackButton()}</View>

        <View className=" mx-5">
          <Text className="text-gray-900 text-3xl font-semibold my-5 mx-5">
            Mood
          </Text>
          <ChartAverage />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default MoodActivity;
