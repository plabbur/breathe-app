import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import MeditationActivityWidget from "@/components/MeditationActivityWidget";
import ActivityFrame from "@/components/ActivityFrame";
import CustomButton from "@/components/CustomButton";
import {
  formatDuration,
  getMeditation,
  getMoodIcon,
  getMoodIconColor,
  removeMeditation,
} from "@/storage";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { LinearGradient } from "expo-linear-gradient";
import EntryCard from "@/components/EntryCard";
import Swiper from "react-native-swiper";
import { useMeditations } from "@/context/MeditationsContext";

import {
  formatDate,
  getDateDay,
  getDateWeekday,
  getDateMonth,
  formatDurationString,
} from "@/storage";

const MeditationDetails = () => {
  const { id } = useLocalSearchParams(); // Extract the id from the route parameters
  const { summary } = useLocalSearchParams();
  const { deleteMeditation } = useMeditations();

  const [loading, setLoading] = useState(true);
  const [confirmingDeletion, setConfirmingDeletion] = useState(false);

  const [duration, setDuration] = useState(null);
  const [breathCount, setBreathCount] = useState(null);
  const [moodFigure, setMoodFigure] = useState(null);
  const [date, setDate] = useState(null);
  const [moodBefore, setMoodBefore] = useState(null);
  const [moodAfter, setMoodAfter] = useState(null);
  const [entryBefore, setEntryBefore] = useState(null);
  const [entryAfter, setEntryAfter] = useState(null);

  const ENTRY_DATA = [
    { title: "Before", mood: moodBefore, entry: entryBefore },
    { title: "After", mood: moodAfter, entry: entryAfter },
  ];

  useEffect(() => {
    fetchMeditationData();
  }, [id]);

  useEffect(() => {
    const unsubscribe = router.events?.on("focus", () => {
      fetchMeditationData(); // Refresh the data when the screen gains focus
    });
    return () => unsubscribe?.(); // Cleanup listener
  }, [id]);

  const fetchMeditationData = async () => {
    try {
      const meditation = await getMeditation(id);
      if (meditation) {
        setDuration(meditation.duration || 0);
        setBreathCount(meditation.breathCount || 0);
        setMoodFigure(meditation.moodFigure || null);
        setDate(meditation.date || 0);
        setEntryBefore(meditation.entryBefore || "");
        setEntryAfter(meditation.entryAfter || "");
        setMoodBefore(meditation.moodBefore || null);
        setMoodAfter(meditation.moodAfter || null);
      } else {
        console.warn(`Meditation with ID ${id} not found`);
      }
    } catch (e) {
      console.error("Error fetching meditation data:", e);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this meditation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              deleteMeditation(id);
              router.back();
            } catch (error) {
              console.error("Error deleting meditation:", error);
            }
          },
        },
      ]
    );
  };

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

  const renderShareButton = () => {
    return (
      <Pressable
        onPress={() => {
          // console.log("hi");
          onShare();
        }}
      >
        <Feather name="share" size={28} color={colors.black[900]} />
      </Pressable>
    );
  };

  const renderBackButton = () => {
    return (
      <Pressable
        className="p-2"
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 0,
          zIndex: 10, // Ensure the button is above overlapping elements
        }}
        onPress={() => {
          router.dismiss();
          router.push({
            pathname: "/meditation-summary",
            params: { id: id },
            // Pass the id as a query parameter
          }); // Navigate to the previous screen
        }}
      >
        <Feather name="chevron-left" size={38} color={colors.gray[900]} />
        <Text
          style={{
            marginLeft: 0,
            fontSize: 18,
            color: colors.gray[900],
          }}
        >
          Back
        </Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="items-center">
        <View className="w-full h-screen overflow-hidden absolute">
          <LinearGradient colors={["#ACE7B8", "#90E2AF"]} className="flex-1" />
        </View>
      </View>

      {summary && (<View style={{marginTop: -30}}/>)}

      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mx-5 mt-5 mb-14">
            <Text className="text-gray-900/50 text-xl font-semibold mx-2">
              {getDateWeekday(date)}
            </Text>
            <View className="flex-row relative">
              <Text className="text-gray-900 text-3xl font-semibold mb-5 mx-2 absolute left-0">
                {getDateMonth(date)} {getDateDay(date)}
              </Text>
              <View className="absolute right-0 mx-2">
                {renderShareButton()}
              </View>
            </View>
          </View>

          <View className="bg-gray-100 rounded-t-3xl h-full">
            <View className="mx-5">
              <View className="flex-row items-center mt-4 mb-2">
                <Feather name="clock" size={26} color={colors.orange[400]} />
                <Text className="px-2 first-letter:text-xl font-semibold">
                  {formatDurationString(duration)}
                </Text>
              </View>
              <View className="flex-row pt-5 pb-2 relative justify-between mx-2">
                <Text className="font-semibold text-2xl left-0">Stats</Text>
                <Pressable
                  className="right-0 py-1"
                  onPress={() => {
                    router.push("/activity");
                  }}
                >
                  <Text className="font-semibold text-base text-blue-500">
                    View all
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row justify-center mb-5">
                <ActivityFrame
                  title="Mood"
                  icon={
                    <Feather
                      name={getMoodIcon(moodFigure)}
                      size={28}
                      color={getMoodIconColor(moodFigure)}
                    />
                  }
                  amount={
                    moodFigure !== null ? `${moodFigure.toFixed(0)}%` : "--"
                  }
                  active={true}
                  fromSummary={false}
                  id={id}
                />
                <ActivityFrame
                  title="Breaths"
                  icon={
                    <Feather name="wind" size={28} color={colors.blue[300]} />
                  }
                  amount={
                    breathCount !== null ? `${breathCount.toFixed(1)}` : "--"
                  }
                  active={false}
                  fromSummary={false}
                  id={id}
                />
              </View>
            </View>
            <View className="h-[250]">
              <Swiper
                showsButtons={false}
                horizontal={true}
                showsPagination={true}
                renderPagination={(index, total) => (
                  <View
                    style={{
                      // position: "absolute",
                      // bottom: 10,
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      zIndex: 0,
                    }}
                  >
                    {Array.from({ length: total }).map((_, i) => (
                      <View
                        key={i}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          margin: 4,
                          zIndex: 0,
                        }}
                        className={i === index ? `bg-green-500` : `bg-gray-300`}
                      />
                    ))}
                  </View>
                )}
              >
                {ENTRY_DATA.map((item, index) => (
                  <View className="z-10 shadow-lg">
                    <Pressable
                      onPress={() => {
                        router.push({
                          pathname: `/(tabs)/activity/read-entry`,
                          params: {
                            title: item.title,
                            mood: item.mood,
                            entry: item.entry,
                          }, // Pass the id as a query parameter
                        });
                      }}
                    >
                      <EntryCard
                        key={index}
                        title={item.title}
                        mood={item.mood}
                        entry={item.entry}
                      />
                    </Pressable>
                  </View>
                ))}
              </Swiper>
            </View>

            {summary && (
              <Pressable
                className="my-3 rounded-full bg-green-400 items-center py-2.5 mx-32"
                onPress={() => {
                  router.dismiss();
                  router.push("/(tabs)/activity");
                }}
              >
                <Text className="text-white font-medium text-base">Done</Text>
              </Pressable>
            )}

            {!summary && (
              <Pressable className="items-center my-16" onPress={handleDelete}>
                <Text className="font-semibold text-red-600">
                  Delete meditation
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  ellipse: {
    width: 2500,
    height: 2100,
    borderRadius: 2000,
    position: "absolute",
    marginVertical: -1800,
    overflow: "hidden",
  },
});

export default MeditationDetails;
