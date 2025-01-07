import { useState, useEffect, useContext } from "react";
import { Audio } from "expo-av";
import { AlarmContext } from "@/context/AlarmContext";
import { ALARM_AUDIO_FILES, ALARM_DATA } from "@/constants/AlarmData";
import { useSettings } from "@/context/SettingsContext";

export function useAlarmHandler() {
    const {alarm} = useSettings();
  const {alarmDate, setAlarmDate } = useContext(AlarmContext);
  const [alarmSound, setAlarmSound] = useState<Audio.Sound | null>(null);
  const [playingAlarm, setPlayingAlarm] = useState(false);

  useEffect(() => {
    if (alarmDate) {
      initializeAlarmSound();
    }
  }, [alarmDate]);

  const initializeAlarmSound = async () => {
    try {
      if (alarmSound) {
        await alarmSound.stopAsync();
        await alarmSound.unloadAsync(); // Unload previous sound
      }
      const alarmAudioFileName = ALARM_DATA[alarm.value - 1].audio;
      const { sound } = await Audio.Sound.createAsync(
        ALARM_AUDIO_FILES[alarmAudioFileName]
      );
      setAlarmSound(sound);
    } catch (error) {
      console.error("Error initializing alarm sound:", error);
    }
  };

  const playAlarm = async () => {
    try {
      if (alarmSound) {
        await alarmSound.setIsLoopingAsync(true); // Enable looping
        await alarmSound.playAsync();
        setPlayingAlarm(true);
      }
    } catch (error) {
      console.error("Error playing alarm:", error);
    }
  };

  const stopAlarm = async () => {
    try {
      if (alarmSound) {
        await alarmSound.stopAsync();
        await alarmSound.unloadAsync(); // Unload the sound
      }
      setPlayingAlarm(false);
      setAlarmDate(null); // Clear the alarm date
    } catch (error) {
      console.error("Error stopping alarm:", error);
    }
  };

  useEffect(() => {
    if (alarmDate && alarmDate <= new Date() && !playingAlarm) {
      playAlarm();
    }
  }, [alarmDate, playingAlarm]);

  return {
    playingAlarm,
    stopAlarm,
  };
}
