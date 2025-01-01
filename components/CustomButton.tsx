import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  textStyles?: string;
  containerStyles?: string;
}

const CustomButton = ({
  onPress,
  title,
  textStyles = "",
  containerStyles = "",
}: CustomButtonProps) => {
  return (
    <View className="items-center">
      <TouchableOpacity
        activeOpacity={0.7}
        className={`bg-green-400 rounded-full min-h-[62px] min-w-[300px] justify-center items-center ${containerStyles}`}
        onPress={onPress}
      >
        <Text className={`text-white font-semibold text-lg ${textStyles}`}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
