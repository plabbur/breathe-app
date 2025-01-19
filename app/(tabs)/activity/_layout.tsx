import { View, Text, Pressable, StyleSheet } from "react-native";
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
          name="meditation-summary"
          options={{
            headerShown: true,
            headerTransparent: true,
            gestureEnabled: false,
            headerTitle: "Summary",
            headerTitleStyle: { color: colors.transparent },
            headerTintColor: colors.gray[900],
            animation: "slide_from_left",
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
          name="(modal)/days-meditations"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />

        <Stack.Screen
          name="(modal)/read-entry"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />

        <Stack.Screen
          name="(modal)/share-meditation"
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

const headerStyles = StyleSheet.create({
  headerTitleLarge: {
    fontFamily: "Inter",
  },
});
