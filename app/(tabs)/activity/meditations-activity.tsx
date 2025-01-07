import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { getMeditations } from "@/storage";
import MeditationActivityWidget from "@/components/MeditationActivityWidget";
import CalendarWidget from "@/components/calendar/CalendarWidget";
import { router } from "expo-router";
import { useMeditations } from "@/context/MeditationsContext";

const MeditationsActivity = () => {
  const [meditationData, setMeditationData] = useState([]);
  const [filter, setFilter] = useState("None");
  const [sort, setSort] = useState("recent");

  const { meditations, eventEmitter, fetchMeditations } = useMeditations();

  // Refresh on deletion
  useEffect(() => {
    const handleMeditationDeleted = () => {
      fetchMeditations(); // Refresh data when a meditation is deleted
    };

    eventEmitter.on("meditationDeleted", handleMeditationDeleted);

    return () => {
      eventEmitter.off("meditationDeleted", handleMeditationDeleted);
    };
  }, [eventEmitter, fetchMeditations]);

  // Fetch data on mount
  useEffect(() => {
    const fetchMeditationData = async () => {
      try {
        const meditations = await getMeditations();
        setMeditationData(meditations);
      } catch (e) {
        console.error("Error fetching meditation data:", e);
      }
    };

    fetchMeditationData();
  }, []);

  // Filter and sort meditations
  const filteredAndSortedData = useMemo(() => {
    let data = [...meditationData];

    if (filter !== "None") {
      // data = data.filter((item) => item.someFilterCondition === filter); // Update as needed
    }

    if (sort === "recent") {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return data;
  }, [meditationData, filter, sort]);

  // Render item
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

  

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView>
        <View className="flex-1 mt-2">
          <CalendarWidget />


          <View className="flex-row pt-5 pb-2 relative justify-between mx-7 mt-5">
            <Text className="font-semibold text-2xl left-0">Recent</Text>

            <Pressable
              className="right-0 py-1"
              onPress={() => {
                console.log("filter meditations");
              }}
            >
              <Text className="font-semibold text-base text-blue-500">
                Filter
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={filteredAndSortedData}
            keyExtractor={(item) => item.id.toString()} // Ensure unique keys
            renderItem={renderMeditationActivityWidget}
            ListEmptyComponent={
              <View className="items-center mt-10">
                <Text className="text-gray-600">No meditations found</Text>
              </View>
            }
            contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
            nestedScrollEnabled // Allow the FlatList to scroll within the ScrollView
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MeditationsActivity;
