import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getDateDay,
  getDateMonth,
  getMeditations,
  getDateMonthNumeric,
  getDateYear,
} from "@/storage";
import { Calendar, DateData } from "react-native-calendars";
import colors from "tailwindcss/colors";
import { router } from "expo-router";

const CalendarDay = ({ date, hasMeditation }) => {
  return (
    <View
      className={`w-8 h-8 rounded-full ${
        hasMeditation ? "bg-green-400" : "bg-transparent"
      } items-center justify-center`}
    >
      <Text
        className={`font-semibold ${
          hasMeditation ? "text-white" : "text-gray-900"
        }`}
      >
        {getDateDay(date)}
      </Text>
    </View>
  );
};

const CalendarWidget = () => {
  const date = Date();

  const [markedDays, setMarkedDays] = useState("");

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

  const fixDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date;
  };

  return (
    <View className="bg-white shadow-lg rounded-3xl mx-5">
      <View className="p-5">
        <Calendar
          disableMonthChange={true}
          markedDates={markedDays}
          onDayPress={(day) => {
            if (markedDays[day.dateString]) {
              router.push({
                pathname: "/activity/days-meditations",
                params: { date: fixDate(day.dateString) },
              });
              console.log("day is marked", day.dateString);
            } else {
              router.push("/activity/meditations-calendar");
              console.log("day is not marked", day.dateString);
            }
            // console.log("Day pressed:", day.dateString);
          }}
          theme={{
            selectedDayBackgroundColor: colors.green[400],
            selectedDayTextColor: colors.white,
            todayTextColor: colors.green[500],
            textDayFontWeight: 500,
            selectedDayFontWeight: 700,
            dayTextColor: colors.gray[700],
            textDisabledColor: colors.gray[300],
          }}
          customHeader={() => (
            <>
              <Text className="text-lg text-gray-400 font-semibold">
                {getDateMonth(date)}
              </Text>
              
              <View className="bg-gray-300 h-[0.5] my-2 " />
            </>
          )}
        />
      </View>
    </View>
  );
};

export default CalendarWidget;
