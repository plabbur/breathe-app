import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { ExternalPathString, RelativePathString, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MenuItemNav } from "@/components/MenuItemNav";

const Options = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView>
        <View className="flex-1 mt-28">
          <Text className="font-semibold text-gray-400 mx-8 mb-3">
            Preferences
          </Text>
          <View className="rounded-2xl bg-white mx-5 shadow-2xl">
            <MenuItemNav
              icon="user"
              label="Instructor"
              path="/home/options/instructor_options"
              bottom={true}
            />
            {/* <MenuItemNav
              icon="clock"
              label="Alarm"
              path="/home/options/alarm_options"
              bottom={false}
            /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Options;
