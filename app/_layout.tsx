import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import TimerProvider from "@/context/TimerContext";
import { CalendarProvider } from "@/context/CalendarContext"; // Adjust the path
import { MeditationsProvider } from "@/context/MeditationsContext";
import AlarmProvider from "@/context/AlarmContext";

const RootLayout = () => {
  // const [fontsLoaded, error] = useFonts({
  //   Inter: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
  //   PlayfairDisplay: require("../assets/fonts/PlayfairDisplay-VariableFont_wght.ttf"),
  // });

  //   useEffect(() => {
  //     if (error) throw error;
  //     if (fontsLoaded) SplashScreen.hideAsync();
  //   }, [fontsLoaded, error]);

  //   if (!fontsLoaded) return null;
  //   if (!fontsLoaded && !error) return null;

  return (
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
                name="meditation-summary"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                  animation: "slide_from_left",
                }}
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
                name="(modal)/set-timer"
                options={{
                  headerShown: false,
                  presentation: "containedTransparentModal",
                }}
              />
            </Stack>
          </TimerProvider>
        </AlarmProvider>
      </CalendarProvider>
    </MeditationsProvider>
  );
};

export default RootLayout;
