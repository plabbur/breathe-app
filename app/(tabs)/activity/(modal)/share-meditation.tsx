import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  Share,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState, useRef, Ref } from "react";
import { router, useLocalSearchParams } from "expo-router";
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

import { useMeditations } from "@/context/MeditationsContext";

import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import downloadImage from "@/utils/downloadImage";

const ShareMeditation = () => {
  const { id } = useLocalSearchParams();
  const { fetchMeditationById } = useMeditations();

  const [date, setDate] = useState();
  const [duration, setDuration] = useState();
  const [moodFigure, setMoodFigure] = useState();
  const [breathCount, setBreathCount] = useState();
  const fullScreen = false;
  const viewRef = useRef();

  const [imageUri, setImageUri] = useState<string>();

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height;

  async function saveImage(uri: string) {
    if (permissionResponse.status !== "granted") {
      await requestPermission();
    }
    const savedImage = await MediaLibrary.saveToLibraryAsync(uri);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meditation = await fetchMeditationById(id);
        if (meditation) {
          setDate(meditation.date);
          setDuration(meditation.duration || 0);
          setMoodFigure(meditation.moodFigure || null);
          setBreathCount(meditation.breathCount || 0);
        }
      } catch (e) {
        console.error("(share-meditation) Error fetching meditation: ", e);
      }
    };

    fetchData();
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "This is the message you want to share", // Add the content you want to share
        url: "https://example.com", // Add a URL if applicable
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared successfully with a specific activity
        } else {
          // Shared successfully
        }
      } else if (result.action === Share.dismissedAction) {
        // Share was dismissed
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const saveAsImage = async () => {
    downloadImage(date, duration, moodFigure, breathCount);
  };

  const renderShareOptions = () => {
    return (
      <View className="flex-row">
        <Pressable // Instagram Story
          onPress={() => {
            saveAsImage();
          }}
          className="items-center"
        >
          <Image
            style={{
              width: 50,
              height: 50,
              marginHorizontal: 20,
              marginBottom: 2,
            }}
            source={require("@/assets/images/social-icons/instagram-icon.png")}
          />
          <Text className="text-xs text-gray-400 font-semibold">Story</Text>
        </Pressable>

        <Pressable // Twitter
          onPress={() => {
            saveAsImage();
          }}
          className="items-center"
        >
          <Image
            style={{
              width: 50,
              height: 50,
              marginHorizontal: 20,
              marginBottom: 2,
            }}
            source={require("@/assets/images/social-icons/twitter-icon.png")}
          />
          <Text className="text-xs text-gray-400 font-semibold">Twitter</Text>
        </Pressable>

        <Pressable // Messages
          onPress={() => {
            saveAsImage();
          }}
          className="items-center"
        >
          <Image
            style={{
              width: 50,
              height: 50,
              marginHorizontal: 20,
              marginBottom: 2,
            }}
            source={require("@/assets/images/social-icons/messages-icon.png")}
          />
          <Text className="text-xs text-gray-400 font-semibold">Messages</Text>
        </Pressable>

        <Pressable // More
          onPress={() => {
            onShare();
          }}
          className="items-center"
        >
          <Image
            style={{
              width: 50,
              height: 50,
              marginHorizontal: 20,
              marginBottom: 2,
            }}
            source={require("@/assets/images/social-icons/more-icon.png")}
          />
          <Text className="text-xs text-gray-400 font-semibold">More</Text>
        </Pressable>
      </View>
    );
  };

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

  const renderPreview = () => {
    return (
      <View className="shadow-2xl" ref={viewRef}>
        <LinearGradient
          colors={["#FFFFFF", "#B0FFE2"]}
          className="rounded-3xl mx-12"
        >
          <View className="h-5/6 p-5 relative items-center">
            <View className="relative items-center">
              <View className="w-32 h-32 rounded-full overflow-hidden opacity-50 absolute right-0 mr-20 mt-52">
                <LinearGradient
                  colors={Colors.greenGradient}
                  className="flex-1"
                />
              </View>

              <View className="w-52 h-52 rounded-full overflow-hidden opacity-50 absolute left-0 ml-10">
                <LinearGradient
                  colors={Colors.greenGradient}
                  className="flex-1"
                />
              </View>
            </View>
            {renderStatsCard()}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const RenderImage = React.forwardRef((props, ref) => {
    console.log("RenderImage ref:", ref); // Debugging

    return (
      <View ref={ref}>
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
  });

  return (
    <>
      <SafeAreaView className="h-full mt-10 bg-gray-100">
        {/* <View className="">
          <RenderImage ref={viewRef} />
        </View> */}

        <View className="flex-1 bg-gray-100 h-full" style={{ marginTop: -20 }}>
          <View className="h-full relative">
            <View className="relative items-center mb-10 top-0">
              <Pressable
                className="absolute left-0 px-5 z-10"
                onPress={() => {
                  router.back();
                }}
              >
                <Text className="text-red-500 text-base font-semibold">
                  Cancel
                </Text>
              </Pressable>

              <Text className="text-base text-gray-900 font-semibold">
                Share
              </Text>
            </View>

            <View className="h-full" style={{}}>
              {renderPreview()}
            </View>

            <View className="absolute w-full bottom-0 bg-white py-5 shadow-2xl items-center">
              {renderShareOptions()}
            </View>
          </View>
        </View>
        <View className="bg-white h-5" />
      </SafeAreaView>
    </>
  );
};

export default ShareMeditation;
