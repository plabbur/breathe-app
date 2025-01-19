import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  INSTRUCTOR_AUDIO_FILES,
  INSTRUCTOR_DATA,
} from "@/constants/InstructorData";
import colors from "tailwindcss/colors";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import { useSettings } from "@/context/SettingsContext";
import { Audio } from "expo-av";
import Toggle from "@/components/Toggle";
import { toTitleCase } from "@/storage";

const ChooseVoice = () => {
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const { instructor } = useSettings();

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          interruptionModeIOS: 2,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
          interruptionModeAndroid: 2,
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

  const playVoice = async (instructorID: number) => {
    try {
      // Stop and unload the current sound if it exists
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }

      // Initialize a new sound instance
      const audioFileName = INSTRUCTOR_DATA[instructorID - 1].inhale;
      const { sound } = await Audio.Sound.createAsync(
        INSTRUCTOR_AUDIO_FILES[audioFileName]
      );

      // Play the new sound and store it in state
      await sound.playAsync();
      setCurrentSound(sound);
    } catch (e) {
      console.error("Error playing sound", e);
    }
  };

  const VoiceOption = ({
    instructorID,
    bottom,
  }: {
    instructorID: number;
    bottom: boolean;
  }) => {
    return (
      <Pressable
        onPress={() => {
          if (instructor.isEnabled) {
            instructor.updateValue(instructorID);
            playVoice(instructorID);
          }
        }}
      >
        <View className="mx-5 py-8">
          <View className="flex-1 justify-center">
            <View className="absolute left-0 items-center">
              <Text className="text-base text-gray-900">
                {toTitleCase(INSTRUCTOR_DATA[instructorID - 1].name)}
              </Text>
            </View>

            <View className="absolute right-0">
              {instructorID === instructor.value && (
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
        <View className="rounded-2xl bg-white mx-5 shadow-2xl">
          <Toggle
            icon=""
            label="Instructor"
            state={instructor.isEnabled}
            onChange={() => {
              instructor.toggleEnabled(!instructor.isEnabled);
            }}
            bottom={false}
            hideIcon={true}
          />
        </View>
        <View
          className="rounded-2xl bg-white mx-5 shadow-2xl mt-5"
          style={{ opacity: instructor.isEnabled ? 1.0 : 0.6 }}
        >
          <VoiceOption instructorID={1} bottom={false} />
          <VoiceOption instructorID={2} bottom={false} />
          <VoiceOption instructorID={3} bottom={false} />
          <VoiceOption instructorID={4} bottom={true} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChooseVoice;
