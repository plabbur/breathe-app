import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import TimerProvider from "@/context/TimerContext";
import { CalendarProvider } from "@/context/CalendarContext"; // Adjust the path
import { MeditationsProvider } from "@/context/MeditationsContext";
import AlarmProvider from "@/context/AlarmContext";
import colors from "tailwindcss/colors";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, gestureEnabled: false, title: "Home" }}
      />
      <Stack.Screen
        name="options"
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTitle: "Settings",
          headerTitleStyle: { color: colors.transparent },
          headerTintColor: colors.gray[900],
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
