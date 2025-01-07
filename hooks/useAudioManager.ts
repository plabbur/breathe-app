import { useState, useContext } from "react";
import { Audio } from "expo-av";
import { INSTRUCTOR_AUDIO_FILES, INSTRUCTOR_DATA } from "@/constants/InstructorData";
import { useSettings } from "@/context/SettingsContext";

export function useAudioManager() {
  const { instructor } = useSettings();
  const [inhaleSound, setInhaleSound] = useState<Audio.Sound | null>(null);
  const [holdSound, setHoldSound] = useState<Audio.Sound | null>(null);
  const [exhaleSound, setExhaleSound] = useState<Audio.Sound | null>(null);

  const initializeInstructorSounds = async () => {
    try {
      const inhaleAudioFileName = INSTRUCTOR_DATA[instructor.value - 1].inhale;
      const holdAudioFileName = INSTRUCTOR_DATA[instructor.value - 1].hold;
      const exhaleAudioFileName = INSTRUCTOR_DATA[instructor.value - 1].exhale;

      const { sound: inhale } = await Audio.Sound.createAsync(
        INSTRUCTOR_AUDIO_FILES[inhaleAudioFileName]
      );
      const { sound: hold } = await Audio.Sound.createAsync(
        INSTRUCTOR_AUDIO_FILES[holdAudioFileName]
      );
      const { sound: exhale } = await Audio.Sound.createAsync(
        INSTRUCTOR_AUDIO_FILES[exhaleAudioFileName]
      );

      setInhaleSound(inhale);
      setHoldSound(hold);
      setExhaleSound(exhale);
    } catch (error) {
      console.error("Failed to initialize instructor sounds:", error);
    }
  };

  const playInstructorSound = async (state: string) => {
    try {
      if (state === "Inhale" && inhaleSound) {
        await holdSound?.stopAsync();
        await exhaleSound?.stopAsync();
        await inhaleSound.playAsync();
      } else if (state === "Hold" && holdSound) {
        await inhaleSound?.stopAsync();
        await exhaleSound?.stopAsync();
        await holdSound.playAsync();
      } else if (state === "Exhale" && exhaleSound) {
        await inhaleSound?.stopAsync();
        await holdSound?.stopAsync();
        await exhaleSound.playAsync();
      }
    } catch (error) {
      console.error(`Error playing ${state} sound:`, error);
    }
  };

  const unloadSounds = async () => {
    try {
      await inhaleSound?.unloadAsync();
      await holdSound?.unloadAsync();
      await exhaleSound?.unloadAsync();
    } catch (error) {
      console.error("Error unloading sounds:", error);
    }
  };

  return {
    initializeInstructorSounds,
    playInstructorSound,
    unloadSounds,
  };
}
