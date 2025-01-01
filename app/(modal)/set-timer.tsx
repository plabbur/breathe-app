import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Keyboard,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import { EmojiRating } from "@/components/EmojiRating";
import colors from "tailwindcss/colors";
import CustomButton from "@/components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { AlarmContext } from "@/context/AlarmContext";

const SetTimer = () => {
  const [hours, onChangeHours] = React.useState("");
  const [minutes, onChangeMinutes] = React.useState("");
  const [seconds, onChangeSeconds] = React.useState("");

  const { onAlarmSet } = useLocalSearchParams();
  const { setAlarmDate } = useContext(AlarmContext);

  const handlePress = (alarmDate: Date) => {
    const date = alarmDate;
    date.setSeconds(0);
    date.setMilliseconds(0);

    setAlarmDate(date);
    console.log("selectedTime: ", date);

    if (onAlarmSet === "true") {
      // Invoke the callback (or trigger an action) to unpause meditation
      router.back();
    } else {
      router.back();
    }
  };

  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShow(Platform.OS === "ios"); // Keep picker open on iOS
    setTime(currentTime);
  };

  return (
    <View className="flex-1 bg-gray-400/50 justify-center">
      <SafeAreaView className="h-auto justify-center m-5">
        <View className="h-auto bg-gray-100 p-5 py-5 rounded-3xl">
          <View className="relative">
            <Pressable
              className="absolute left-0 px-5 py-2 z-10"
              onPress={() => {
                // console.log("back");
                router.back();
              }}
            >
              <Feather name="x" size={24} color="black" />
            </Pressable>

            <Text className="text-base text-gray-900 font-semibold text-center py-2">
              Alarm
            </Text>
          </View>

          <Text className="text-2xl font-semibold py-5 px-5">Set an alarm</Text>
          <DateTimePicker
            textColor={colors.gray[900]}
            value={time}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
          />

          <CustomButton
            onPress={() => {
              handlePress(time);
            }}
            title="Set alarm"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SetTimer;
