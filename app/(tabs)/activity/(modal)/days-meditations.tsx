import {
  View,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";

import { getMeditations, getDateWeekday } from "@/storage";
import { router, useLocalSearchParams } from "expo-router";
import MeditationActivityWidget from "@/components/MeditationActivityWidget";

const DaysMeditation = () => {
  const [meditations, setMeditations] = useState([]);

  const { date } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meditations = await getMeditations();
        const day = new Date(date);

        const formattedData = meditations.map((item) => ({
          id: item.id,
          duration: item.duration || 0,
          date: new Date(item.date) || "",
          moodFigure: item.moodFigure || 0,
        }));

        const todaysMeditations = formattedData.filter((item) => {
          return (
            item.date.getDate() === day.getDate() &&
            item.date.getMonth() === day.getMonth() &&
            item.date.getFullYear() === day.getFullYear()
          );
        });

        setMeditations(todaysMeditations);
      } catch (e) {
        console.error("Error fetching meditation data:", e);
      }
    };

    fetchData();
  }, []);

  const renderMeditationActivityWidget = ({ item }) => (
    <Pressable
      onPress={() => {
        router.dismiss();
        router.push(`/activity/${item.id}`);
      }}
    >
      <MeditationActivityWidget
        id={item.id}
        date={item.date}
        duration={item.duration}
        mood={item.moodFigure}
      />
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-200">
      {/* <SafeAreaView className="flex-1"> */}
      <Text className="text-gray-900/50 text-xl font-semibold mx-10 mt-10">
        {getDateWeekday(new Date(date))}
      </Text>
      <Text className="text-gray-900 text-3xl font-semibold mb-5 mx-10">
        {new Date(date).toLocaleString("default", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </Text>

      <ScrollView>
        <FlatList
          data={meditations}
          keyExtractor={(item) => item.id} // Unique key for each item
          renderItem={renderMeditationActivityWidget} // Function to render each item
          ListEmptyComponent={<Text>No data available</Text>} // Fallback if list is empty
          scrollEnabled={false}
          contentContainerStyle={{ marginBottom: 50, marginTop: 10 }}
        />
      </ScrollView>
      {/* </SafeAreaView> */}
    </View>
  );
};

export default DaysMeditation;
