import { View, Text, SafeAreaView, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import { LinearGradient } from "expo-linear-gradient";
import MeditationActivityWidget from "@/components/MeditationActivityWidget";
import CustomButton from "@/components/CustomButton";
import ActivityFrame from "@/components/ActivityFrame";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  getLastMeditation,
  formatDuration,
  formatDate,
  getMeditation,
  getMoodIcon,
  getMoodIconColor,
} from "@/storage";
import Swiper from "react-native-swiper";
import EntryCard from "@/components/EntryCard";
import MeditationSummaryLoading from "../../(loading)/meditation-summary-loading";

const MeditationSummary = () => {
  const { id } = useLocalSearchParams(); // Extract the id from the route parameters
  const [loading, setLoading] = useState(true);

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
    setLoading(true); // Start loading
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
      }
    } catch (e) {
      console.error("Error fetching meditation data:", e);
    }
    setLoading(false); // End loading
  };

  if (loading) {
    return <MeditationSummaryLoading />; // Show a loader or placeholder
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="items-center">
        <View style={styles.ellipse}>
          <LinearGradient colors={["#ACE7B8", "#90E2AF"]} className="flex-1" />
        </View>
      </View>

      <SafeAreaView className="flex-1">
        <Text className="text-gray-900 text-3xl font-semibold mb-5 mx-7">
          Done!
        </Text>
        <Pressable
          onPress={() => {
            router.push({
              pathname: `/activity/${id}`,
              params: { fromSummary: true },
            });
          }}
          className="mx-2"
        >
          <MeditationActivityWidget
            id={id}
            date={date}
            duration={duration}
            mood={moodFigure !== null ? `${moodFigure.toFixed(0)}%` : "--"}
            moodFigure={moodFigure}
          />
        </Pressable>

        <View className="flex-row pt-5 pb-2 relative justify-between">
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

        <View className="flex-row justify-center pb-5 mx-5">
          <ActivityFrame
            title="Mood"
            icon={
              <Feather
                name={getMoodIcon(moodFigure)}
                size={28}
                color={getMoodIconColor(moodFigure)}
              />
            }
            amount={moodFigure !== null ? `${moodFigure.toFixed(0)}%` : "--"}
            active={true}
            fromSummary={true}
            id={id}
          />
          <ActivityFrame
            title="Breaths"
            icon={<Feather name="wind" size={28} color={colors.blue[300]} />}
            amount={breathCount !== null ? `${breathCount.toFixed(1)}` : "--"}
            active={false}
          />
        </View>

        <View className="h-[250] mb-10">
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
                <EntryCard
                  key={index}
                  title={item.title}
                  mood={item.mood}
                  entry={item.entry}
                />
              </View>
            ))}
          </Swiper>
        </View>

        <CustomButton
          onPress={() => {
            router.push("/home");
          }}
          title="Done"
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  ellipse: {
    width: 2000,
    height: 2000,
    borderRadius: 2000,
    position: "absolute",
    marginVertical: -1800,
    overflow: "hidden",
  },
});

export default MeditationSummary;
