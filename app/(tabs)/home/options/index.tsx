import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { ExternalPathString, RelativePathString, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

interface MenuItem {
  icon: any;
  label: any;
  path: string;
  bottom: boolean;
}

const MenuItem: React.FC<MenuItem> = ({ icon, label, path, bottom }) => {
  return (
    <Pressable
      onPress={() => {
        router.push(`/home/options/${path}` || null);
      }}
    >
      <View className="mx-5 py-8 bg-white">
        <View className="flex-1 justify-center">
          <View className="flex-row absolute left-0 items-center">
            <Feather name={icon} size={28} color={colors.gray[400]} />
            <Text className="px-4 text-base text-gray-900">{label}</Text>
          </View>

          <View className="absolute right-0">
            <Feather name="chevron-right" size={28} color={colors.gray[400]} />
          </View>
        </View>
      </View>

      {!bottom && <View className="h-[1] mx-5 bg-gray-100" />}
    </Pressable>
  );
};

const Options = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView>
        <View className="flex-1 mt-28">
          <Text className="font-semibold text-gray-400 mx-8 mb-3">
            Preferences
          </Text>
          <View className="rounded-2xl bg-white mx-5 shadow-2xl">
            <MenuItem
              icon="user"
              label="Instructor"
              path="instructor_options"
              bottom={false}
            />
            <MenuItem
              icon="clock"
              label="Alarm"
              path="alarm_options"
              bottom={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Options;
