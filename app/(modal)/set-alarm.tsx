import { View, Text, SafeAreaView, Pressable, Platform } from "react-native";
import React, { useContext, useState } from "react";
import colors from "tailwindcss/colors";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AlarmContext } from "@/context/AlarmContext";
import { MenuItemNav } from "@/components/MenuItemNav";
import { useSettings } from "@/context/SettingsContext";
import { ALARM_DATA } from "@/constants/AlarmData";
import { toTitleCase } from "@/storage";

const SetAlarm = () => {
  const { onAlarmSet } = useLocalSearchParams();
  const { setAlarmDate } = useContext(AlarmContext);
  const { alarm } = useSettings();

  const handlePress = (alarmDate: Date) => {
    const date = alarmDate;
    const now = new Date();

    if (date <= now) {
      // MAKE SURE THIS WORKS ON LAST DAY OF MONTH !!
      date.setDate(date.getDate() + 1);
      console.log("new date: ", date);
    }

    date.setSeconds(0);
    date.setMilliseconds(0);
    setAlarmDate(date);
    console.log("selectedTime: ", date);

    router.back();
  };

  const nowPlusTenMinutes = new Date(new Date().setMinutes(new Date().getMinutes() + 10));
  const [time, setTime] = useState(nowPlusTenMinutes);
  const [show, setShow] = useState(false);

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShow(Platform.OS === "ios"); // Keep picker open on iOS
    setTime(currentTime);
  };

  return (
    <View className="flex-1">
      <SafeAreaView className="h-auto justify-center mt-5">
        <View className="relative items-center mb-10">
          <Pressable
            className="absolute left-0 px-5 z-10"
            onPress={() => {
              router.back();
            }}
          >
            <Text className="text-red-500 text-base font-semibold">Cancel</Text>
          </Pressable>

          <Text className="text-base text-gray-900 font-semibold">
            Add Alarm
          </Text>
          <Pressable
            className="absolute right-0 px-5 z-10"
            onPress={() => {
              handlePress(time);
            }}
          >
            <Text className="text-green-500 text-base font-semibold">Save</Text>
          </Pressable>
        </View>

        <View className="items-center">
          <DateTimePicker
            textColor={colors.gray[900]}
            value={time}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
          />
        </View>
        <View className="rounded-2xl bg-white mx-5 shadow-2xl">
          <MenuItemNav
            icon=""
            hideIcon={true}
            label="Sound"
            value={toTitleCase(ALARM_DATA[alarm.value - 1].name)}
            path="(modal)/edit-alarm-audio"
            bottom={true}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SetAlarm;
