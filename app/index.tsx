import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, SplashScreen } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { MeditationProvider } from "@/context/MeditationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearMeditations } from "@/storage";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { CalendarProvider } from "@/context/CalendarContext";
import { MeditationsProvider } from "@/context/MeditationsContext";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [fontsLoaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    PlayfairDisplay: require("../assets/fonts/PlayfairDisplay-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;
  if (!fontsLoaded && !error) return null;

  return (
    <MeditationProvider>
      <LinearGradient className="flex-1" colors={["#FFFFFF", "#B0FFE2"]}>
        <View className="flex-1 mx-5 my-5">
          <SafeAreaView className="flex-1 justify-between">
            <View className="mt-5 mx-5">
              <Text className="text-green-500 text-3xl font-playfair font-extrabold">
                Breathe
              </Text>
              <Text className="text-xl text-gray-400">
                Meditation, made easy.
              </Text>
            </View>

            <View className="mb-[475]">
              <View className="relative items-center">
                <View className="w-72 h-72 rounded-full overflow-hidden opacity-20 absolute right-0 mr-60 mt-44">
                  <LinearGradient
                    colors={Colors.greenGradient}
                    className="flex-1"
                  />
                </View>

                <View className="w-52 h-52 rounded-full overflow-hidden opacity-50 absolute z-10 mt-32">
                  <LinearGradient
                    colors={Colors.greenGradient}
                    className="flex-1"
                  />
                </View>

                <View className="w-72 h-72 rounded-full overflow-hidden opacity-20 absolute left-0 ml-60">
                  <LinearGradient
                    colors={Colors.greenGradient}
                    className="flex-1"
                  />
                </View>
              </View>
            </View>

            <CustomButton
              onPress={() => {
                router.push("/home");
                // clearMeditations();
              }}
              title="Continue"
            />
          </SafeAreaView>
        </View>
      </LinearGradient>
    </MeditationProvider>
  );
}
