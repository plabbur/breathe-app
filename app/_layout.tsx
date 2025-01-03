import React from "react";
import { Stack } from "expo-router";
import TimerProvider from "@/context/TimerContext";
import { CalendarProvider } from "@/context/CalendarContext";
import { MeditationsProvider } from "@/context/MeditationsContext";
import AlarmProvider from "@/context/AlarmContext";
import { SettingsProvider } from "@/context/SettingsContext";

const RootLayout = () => {
  return (
    <SettingsProvider>
      <MeditationsProvider>
        <CalendarProvider>
          <AlarmProvider>
            <TimerProvider>
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                  name="index"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                  name="meditation"
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="(modal)/pre-checkup"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                  }}
                />
                <Stack.Screen
                  name="(modal)/post-checkup"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                  }}
                />
                <Stack.Screen
                  name="(modal)/set-alarm"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                  }}
                />
                <Stack.Screen
                  name="(modal)/edit-alarm"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                  }}
                />
              </Stack>
            </TimerProvider>
          </AlarmProvider>
        </CalendarProvider>
      </MeditationsProvider>
    </SettingsProvider>
  );
};

export default RootLayout;
