import { View, Text, Pressable } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { router } from "expo-router";

interface MenuItem {
  icon: any;
  hideIcon?: boolean;
  label: any;
  value?: string;
  path: string;
  bottom: boolean;
}

export const MenuItemNav: React.FC<MenuItem> = ({
  icon,
  hideIcon,
  label,
  value,
  path,
  bottom,
}) => {
  return (
    <Pressable
      onPress={() => {
        router.push(path || null);
      }}
    >
      <View className="mx-5 py-8 bg-white">
        <View className="flex-1 justify-center">
          <View className="flex-row absolute left-0 items-center">
            {!hideIcon && (
              <View className="pr-4">
                <Feather name={icon} size={28} color={colors.gray[400]} />
              </View>
            )}
            <Text className="text-base text-gray-900 pr-4">{label}</Text>
            <Text className="text-base text-gray-400">{value}</Text>
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
