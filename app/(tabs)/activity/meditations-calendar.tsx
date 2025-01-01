import { View, Text, SafeAreaView, TextStyle, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  getDateDay,
  getDateMonth,
  getMeditations,
  getDateMonthNumeric,
  getDateYear,
  getDateFromString,
} from "@/storage";
import { CalendarList } from "react-native-calendars";
import colors from "tailwindcss/colors";
import { router } from "expo-router";
import { useCalendar } from "@/context/CalendarContext";

const MeditationsCalendar = () => {
  const date = Date();

  const [markedDays, setMarkedDays] = useState("");
  const { calendarRef, handleScrollToDay } = useCalendar(); // Use the ref from the context

  useEffect(() => {
    const fetchMarkedDays = async () => {
      try {
        const meditations = await getMeditations();

        // Transform the array into the required object structure
        const formattedData = meditations.reduce((acc, item) => {
          const dateString = `${getDateYear(item.date)}-${getDateMonthNumeric(
            item.date
          )}-${getDateDay(item.date)}`;
          acc[dateString] = {
            selected: true, // Mark the date as selected
          };
          return acc;
        }, {});

        setMarkedDays(formattedData);
      } catch (e) {
        console.error("Error fetching meditation data:", e);
      }
    };

    fetchMarkedDays();
  }, []);

  function renderCustomHeader(date: any) {
    const header = date.toString("MMMM yyyy");
    const [month, year] = header.split(" ");

    return (
      <>
        <View>
          <View className="flex-row justify-between w-full my-2">
            <Text className="text-2xl text-gray-900 font-semibold">{`${month}`}</Text>
            <Text className="text-2xl text-gray-500">{year}</Text>
          </View>
        </View>
      </>
    );
  }

  const fixDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date;
  };

  return (
    <View className="flex-1">
      

      <SafeAreaView className="flex-1">
        <CalendarList
          ref={calendarRef}
          scrollEnabled={true}
          markedDates={markedDays}
          onDayPress={(day) => {
            if (markedDays[day.dateString]) {
              router.push({
                pathname: "/activity/days-meditations",
                params: { date: fixDate(day.dateString) },
              });
            }
          }}
          theme={{
            selectedDayBackgroundColor: colors.green[400],
            selectedDayTextColor: colors.white,
            todayTextColor: colors.green[500],
            textDayFontWeight: 500,
            dayTextColor: colors.gray[300],
            textDayHeaderFontWeight: 600,
            textMonthFontWeight: 600,
            textMonthFontSize: 24,
          }}
          renderHeader={renderCustomHeader}
        />
      </SafeAreaView>
    </View>
  );
};

export default MeditationsCalendar;
