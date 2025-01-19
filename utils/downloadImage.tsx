import { View, Text } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import colors from "tailwindcss/colors";
import { Feather } from "@expo/vector-icons";
import {
  formatDurationString,
  getMoodIconColor,
  getMoodIcon,
  getDateWeekday,
  getDateMonth,
  getDateDay,
} from "@/storage";

import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

const downloadImage = (
  date: Date,
  duration: number,
  moodFigure: any,
  breathCount: number
) => {
  const viewRef = useRef();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function saveImage(uri: string) {
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }
    const savedImage = await MediaLibrary.saveToLibraryAsync(uri);
  }

  const saveAsImage = async () => {
    try {
      const uri = await captureRef(viewRef.current, {
        format: "png",
        quality: 1.0,
      });
      await saveImage(uri);
    } catch (error) {
      console.error("Failed to capture image:", error);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      saveAsImage();
    };

    fetchImage();
  });

  const renderStatsCard = (margin?: number) => {
    return (
      <View className="flex-1 bg-white/50 rounded-2xl shadow-xl w-full absolute mt-24">
        <View className="mx-3 mt-5 mb-8">
          <Text className="text-gray-400 text-md font-semibold">
            {getDateWeekday(date)}
          </Text>
          <Text className="text-green-700 text-lg font-semibold mb-5 mt-3 absolute left-0">
            {getDateMonth(date)} {getDateDay(date)}
          </Text>
        </View>

        <View className="flex-row items-center mt-4 mx-3">
          <Feather name="clock" size={15} color={colors.orange[400]} />
          <Text className="px-2 first-letter:text-sm font-medium">
            {formatDurationString(duration)}
          </Text>
        </View>
        {moodFigure !== null && (
          <View className="flex-row items-center mx-3">
            <Feather
              name={getMoodIcon(moodFigure)}
              size={15}
              color={getMoodIconColor(moodFigure)}
            />
            <Text className="px-2 first-letter:text-sm font-medium">
              {moodFigure}
            </Text>
          </View>
        )}

        <View className="flex-row items-center mx-3">
          <Feather name="wind" size={15} color={colors.blue[300]} />
          <Text className="px-2 first-letter:text-sm font-medium">
            {breathCount !== null ? `${breathCount?.toFixed(1)}` : "--"}{" "}
            {`${breathCount === 1 ? `breath` : `breaths`}`}
          </Text>
        </View>

        <View className="my-5">
          <View className="flex-row relative items-center mt-5">
            <View className="w-3 h-3 rounded-full overflow-hidden absolute left-0 mx-3">
              <LinearGradient
                colors={Colors.greenGradient}
                className="flex-1"
              />
            </View>
            <Text className="absolute right-0 mx-3 text-sm font-playfair text-green-500">
              Breathe
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View ref={viewRef}>
      <LinearGradient colors={["#FFFFFF", "#B0FFE2"]} className="rounded-3xl">
        <View className="h-full w-full p-5 relative items-center mt-10">
          <View className="relative items-center">
            <View className="w-32 h-32 rounded-full overflow-hidden opacity-50 absolute right-0 mr-32 mt-52">
              <LinearGradient
                colors={Colors.greenGradient}
                className="flex-1"
              />
            </View>

            <View className="w-52 h-52 rounded-full overflow-hidden opacity-50 absolute left-0 ml-16">
              <LinearGradient
                colors={Colors.greenGradient}
                className="flex-1"
              />
            </View>
          </View>

          <View className="mx-5 items-center">{renderStatsCard()}</View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default downloadImage;
