import { View, Text, Pressable } from "react-native";
import React from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import colors from "tailwindcss/colors";
import { useCalendar } from "@/context/CalendarContext"; // Adjust the path
import { MeditationsProvider } from "@/context/MeditationsContext";

const ActivityLayout = () => {
  const { handleScrollToDay } = useCalendar();

  return (
    <MeditationsProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Activity",
            headerTitleStyle: { color: colors.transparent },
            headerTintColor: colors.gray[900],
          }}
        />

        <Stack.Screen
          name="[id]"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Meditation",
            headerTitleStyle: { color: colors.transparent },
            headerTintColor: colors.gray[900],
          }}
        />

        <Stack.Screen
          name="meditations-calendar"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Calendar",
            headerTitleStyle: { color: colors.transparent },
            headerTintColor: colors.gray[900],
            headerRight: () => (
              <Pressable
                style={{
                  marginRight: 2,
                  backgroundColor: colors.gray[200],
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 9999,
                }}
                onPress={() => {
                  console.log("pressed");
                  handleScrollToDay();
                }}
              >
                <Text style={{ color: colors.gray[800] }}>Today</Text>
              </Pressable>
            ),
          }}
        />

        <Stack.Screen
          name="mood-activity"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Mood",
            headerTitleStyle: { color: colors.transparent },
            headerTintColor: colors.gray[900],
          }}
        />
        <Stack.Screen
          name="breaths-activity"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Breaths",
            headerTitleStyle: { color: colors.transparent },
            headerTintColor: colors.gray[900],
          }}
        />
        <Stack.Screen
          name="streak-activity"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Streak",
            headerTitleStyle: { color: colors.transparent },
            headerTintColor: colors.gray[900],
          }}
        />
        <Stack.Screen
          name="meditations-activity"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Meditations",
            headerTitleStyle: { color: colors.transparent },
            headerTintColor: colors.gray[900],
          }}
        />

        <Stack.Screen
          name="(modal)/days-meditations"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack>
    </MeditationsProvider>
  );
};

export default ActivityLayout;
