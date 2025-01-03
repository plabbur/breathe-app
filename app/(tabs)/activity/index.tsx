import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import ActivityFrame from "@/components/ActivityFrame";
import { Feather, Octicons, FontAwesome } from "@expo/vector-icons";
import {
  getMeditationCount,
  getAllBreaths,
  getMeditations,
  getMoodFigureTimeRange,
  getMoodIcon,
  getMoodIconColor,
} from "@/storage";
import colors from "tailwindcss/colors";
import MeditationActivityWidget from "@/components/MeditationActivityWidget";
import { router } from "expo-router";
import { useMeditations } from "@/context/MeditationsContext";

const ActivityScreen = () => {
  const [meditationCount, setMeditationCount] = useState(0);
  const [totalBreaths, setTotalBreaths] = useState(0);
  const [moodFigure, setMoodFigure] = useState(0);
  const [meditationData, setMeditationData] = useState([]);

  const { meditations, eventEmitter, fetchMeditations } = useMeditations();

  // Update screen data when a meditation is deleted
  useEffect(() => {
    const handleMeditationDeleted = () => {
      fetchMeditations(); // Refresh global meditations
      updateScreenData(); // Recalculate stats for ActivityScreen
    };

    eventEmitter.on("meditationDeleted", handleMeditationDeleted);

    return () => {
      eventEmitter.off("meditationDeleted", handleMeditationDeleted);
    };
  }, [eventEmitter]);

  // Fetch and update screen data
  const updateScreenData = async () => {
    try {
      // Fetch stats
      const count = await getMeditationCount();
      const breaths = await getAllBreaths();
      const mood = await getMoodFigureTimeRange(new Date(0), new Date());

      // Fetch recent meditations
      const meditations = await getMeditations();
      const formattedData = meditations
        .map((item) => ({
          id: String(item.id),
          date: item.date || "",
          duration: item.duration || 0,
          moodFigure: item.moodFigure || null,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      // Update state
      setMeditationCount(count);
      setTotalBreaths(breaths);
      setMoodFigure(mood);
      setMeditationData(formattedData);
    } catch (e) {
      console.error("Error updating ActivityScreen data:", e);
    }
  };

  // Initial data fetch
  useEffect(() => {
    updateScreenData();
  }, []);

  // Render meditation activity widget
  const renderMeditationActivityWidget = ({ item }) => (
    <Pressable
      onPress={() => {
        router.push(`/activity/${item.id}`);
      }}
    >
      <MeditationActivityWidget
        id={item.id}
        date={item.date}
        duration={item.duration}
        mood={
          item.moodFigure !== null ? `${item.moodFigure.toFixed(0)}%` : "--"
        }
        moodFigure={item.moodFigure}
      />
    </Pressable>
  );

  // Memoize empty state to avoid unnecessary re-renders
  const emptyState = useMemo(
    () => (
      <View className="items-center mt-10">
        <Text className="text-gray-600">No meditations available</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView>
        <View className="mt-1">
          {/* <Text className="text-gray-900 text-3xl font-semibold my-5 mx-10">
            Activity
          </Text> */}
          {/* Activity Overview Section */}
          <View className="flex-row flex-wrap justify-center mb-5">
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
            />
            <ActivityFrame
              title="Breaths"
              icon={<Feather name="wind" size={28} color={colors.blue[300]} />}
              amount={`${totalBreaths.toFixed(0)}`}
              active={false}
            />
            <ActivityFrame
              title="Streak"
              icon={<Octicons name="flame" size={28} color={colors.red[500]} />}
              amount="0 days" // Placeholder until streak logic is implemented
              active={false}
            />
            <ActivityFrame
              title="Meditations"
              icon={
                <FontAwesome
                  name="circle"
                  size={28}
                  color={colors.green[300]}
                />
              }
              amount={`${meditationCount}`}
              active={true}
            />
          </View>

          {/* Recent Meditations Section */}
          <View>
            <View className="flex-row pt-5 pb-2 relative justify-between mx-7">
              <Text className="font-semibold text-2xl">Recent</Text>
              <Pressable
                onPress={() => {
                  router.push("/activity/meditations-activity");
                }}
              >
                <Text className="font-semibold text-base text-blue-500">
                  View all
                </Text>
              </Pressable>
            </View>

            <FlatList
              data={meditationData}
              keyExtractor={(item) => item.id}
              renderItem={renderMeditationActivityWidget}
              ListEmptyComponent={emptyState}
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 20,
              }}
              nestedScrollEnabled // Allow the FlatList to scroll within the ScrollView
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityScreen;
