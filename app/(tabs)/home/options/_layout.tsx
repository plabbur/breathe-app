import React from "react";
import { Stack } from "expo-router";
import colors from "tailwindcss/colors";

const OptionsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyle: { backgroundColor: colors.gray[200] },
          headerTitle: "Settings",
          headerTitleStyle: { color: colors.gray[900] },
          headerTintColor: colors.gray[900],
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontFamily: "Inter",
            fontWeight: "600",
            color: colors.gray[900],
          },
        }}
      />

      <Stack.Screen
        name="instructor_options"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyle: { backgroundColor: colors.gray[200] },
          headerTitle: "Instructor",
          headerTitleStyle: { color: colors.gray[900] },
          headerTintColor: colors.gray[900],
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontFamily: "Inter",
            fontWeight: "600",
            color: colors.gray[900],
          },
        }}
      />

      <Stack.Screen
        name="alarm_options"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyle: { backgroundColor: colors.gray[200] },
          headerTitle: "Alarm",
          headerTitleStyle: { color: colors.gray[900] },
          headerTintColor: colors.gray[900],
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontFamily: "Inter",
            fontWeight: "600",
            color: colors.gray[900],
          },
        }}
      />
    </Stack>
  );
};

export default OptionsLayout;
