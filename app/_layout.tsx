import React from "react";
import { Stack } from "expo-router";
import TimerProvider from "@/context/TimerContext";
import { CalendarProvider } from "@/context/CalendarContext";
import { MeditationsProvider } from "@/context/MeditationsContext";
import AlarmProvider from "@/context/AlarmContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import colors from "tailwindcss/colors";
import { HoldMenuProvider } from "react-native-hold-menu";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
// const insets = useSafeAreaInsets();

const RootLayout = () => {
  return (
    // <HoldMenuProvider safeAreaInsets={insets}>
      <GestureHandlerRootView>
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
                        title: "Set Alarm",
                      }}
                    />
                    <Stack.Screen
                      name="(modal)/edit-alarm"
                      options={{
                        headerShown: false,
                        presentation: "modal",
                        title: "Edit Alarm",
                      }}
                    />
                    <Stack.Screen
                      name="(modal)/edit-alarm-audio"
                      options={{
                        headerShown: false,
                        headerTransparent: true,
                        gestureEnabled: false,
                        title: "Sound",
                        headerTintColor: colors.gray[900],
                        headerBackButtonDisplayMode: "generic",
                        headerBackVisible: true,
                        presentation: "modal",
                      }}
                    />
                  </Stack>
                </TimerProvider>
              </AlarmProvider>
            </CalendarProvider>
          </MeditationsProvider>
        </SettingsProvider>
      </GestureHandlerRootView>
    // </HoldMenuProvider>
  );
};

export default RootLayout;
