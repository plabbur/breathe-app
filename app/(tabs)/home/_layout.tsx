import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import TimerProvider from "@/context/TimerContext";
import { CalendarProvider } from "@/context/CalendarContext"; // Adjust the path
import { MeditationsProvider } from "@/context/MeditationsContext";
import AlarmProvider from "@/context/AlarmContext";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="options" options={{ headerShown: false}} />
    </Stack>
  );
};

export default HomeLayout;
