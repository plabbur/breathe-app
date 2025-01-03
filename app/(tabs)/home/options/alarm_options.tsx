import { View, Text, Pressable, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Audio } from "expo-av";
import { ALARM_DATA, AUDIO_FILES } from "@/constants/AlarmData";
import colors from "tailwindcss/colors";
import { Feather } from "@expo/vector-icons";
import { toTitleCase } from "@/storage";

const ChooseAlarm = () => {
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const { alarm } = useSettings();

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          interruptionModeIOS: 1,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
          interruptionModeAndroid: 1,
        });

        console.log("Audio mode configured.");
      } catch (error) {
        console.error("Error setting audio mode:", error);
      }
    };

    configureAudio();

    // Cleanup current sound on component unmount
    return () => {
      currentSound?.unloadAsync();
    };
  }, [currentSound]);

  const playAlarm = async (alarmID: number) => {
    try {
      // Stop and unload the current sound if it exists
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }

      // Initialize a new sound instance
      const audioFileName = ALARM_DATA[alarmID - 1].audio;
      const { sound } = await Audio.Sound.createAsync(
        AUDIO_FILES[audioFileName]
      );

      // Play the new sound and store it in state
      await sound.playAsync();
      setCurrentSound(sound);
    } catch (e) {
      console.error("Error playing sound", e);
    }
  };

  const AlarmOption = ({
    alarmID,
    bottom,
  }: {
    alarmID: number;
    bottom: boolean;
  }) => {
    return (
      <Pressable
        onPress={() => {
          alarm.updateValue(alarmID);
          playAlarm(alarmID);
        }}
      >
        <View className="mx-5 py-8">
          <View className="flex-1 justify-center">
            <View className="absolute left-0 items-center">
              <Text className="text-base text-gray-900">
                {toTitleCase(ALARM_DATA[alarmID - 1].name)}
              </Text>
            </View>

            <View className="absolute right-0">
              {alarmID === alarm.value && (
                <Feather name="check" size={26} color={colors.green[500]} />
              )}
            </View>
          </View>
        </View>

        {!bottom && <View className="h-[1] mx-5 bg-gray-100" />}
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView>
        <View className="rounded-2xl bg-white mx-5 shadow-2xl mt-5">
          {ALARM_DATA.map((_, index) => (
            <AlarmOption
              key={index}
              alarmID={index + 1}
              bottom={index === ALARM_DATA.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChooseAlarm;
