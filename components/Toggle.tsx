import { View, Text, Switch, Pressable } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useSettings } from "@/context/SettingsContext";
import colors from "tailwindcss/colors";

interface Toggle {
  icon: any;
  label: string;
  state: boolean;
  onChange: {};
  bottom: boolean;
  hideIcon: boolean;
}

const Toggle: React.FC<Toggle> = ({
  icon,
  label,
  state,
  onChange,
  bottom,
  hideIcon,
}) => {
  return (
    <View>
      <View className="mx-5 py-8">
        <View className="flex-1 justify-center">
          <View className="flex-row absolute left-0 items-center">
            {!hideIcon && (
              <View className="pr-4">
                <Feather name={icon} size={28} color={colors.gray[400]} />
              </View>
            )}
            <Text className="text-base text-gray-900">{label}</Text>
          </View>

          <View className="absolute right-0">
            <Switch
              value={state}
              trackColor={{ false: colors.gray[900], true: colors.green[400] }}
              onValueChange={onChange}
            />
          </View>
        </View>
      </View>

      {!bottom && <View className="h-[1] mx-5 bg-gray-100" />}
    </View>
  );
};

export default Toggle;
