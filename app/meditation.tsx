import { View, Text, SafeAreaView, Animated, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BreathingCircle } from "@/components/BreathingCircle";
import { router, useLocalSearchParams } from "expo-router";
import { TimerContext } from "@/context/TimerContext";
import ControlBar from "@/components/ControlBar";
import { LinearGradient } from "expo-linear-gradient";
import TimerProvider from "@/context/TimerContext";
import { Audio } from "expo-av";
import { updateMeditationDuration } from "@/storage";
import { AlarmContext, useAlarm } from "@/context/AlarmContext";
import {
  INSTRUCTOR_AUDIO_FILES,
  INSTRUCTOR_DATA,
} from "@/constants/InstructorData";
import { SettingsContext, useSettings } from "@/context/SettingsContext";
import { ALARM_AUDIO_FILES, ALARM_DATA } from "@/constants/AlarmData";
import EventEmitter from "eventemitter3";
import formatDuration from "@/utils/formatting/formatDuration";
import MeditationConfiguration from "@/constants/MeditationConfiguration";
import AlarmPopup from "./(modal)/alarm-popup";

const Meditation = () => {
  const { id } = useLocalSearchParams(); // Extract the id from the route parameters
  const { instructor, alarm, eventEmitter } = useContext(SettingsContext);

  const [countdown, setCountdown] = useState(3);
  const { duration: duration, setDuration } = useContext(TimerContext);

  const { alarmDate: alarmDate, setAlarmDate } = useContext(AlarmContext);
  const [alarmSound, setAlarmSound] = useState<Audio.Sound>();
  const [playingAlarm, setPlayingAlarm] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>();
  const { setOnAlarmDelete } = useAlarm();

  const [inhaleSound, setInhaleSound] = useState<Audio.Sound>();
  const [holdSound, setHoldSound] = useState<Audio.Sound>();
  const [exhaleSound, setExhaleSound] = useState<Audio.Sound>();

  const [isMeditating, setMeditating] = useState(false);
  const [breatheState, setBreatheState] = useState("Inhale");

  let timerId: NodeJS.Timeout;

  const { resumeMeditation } = useLocalSearchParams();

  const [isPaused, setIsPaused] = useState(false);

  const [revealAlarm, setRevealAlarm] = useState(false);

  console.log("isMeditating: ", isMeditating);

  const handlePauseToggle = (pauseState: boolean) => {
    setIsPaused(pauseState);
    setMeditating(!pauseState);
  };

  const handleAlarmToggle = () => {
    setIsPaused(true);
    setMeditating(false);
  };

  const resetMeditation = () => {
    console.log("Alarm deleted, restarting meditation...");
    setMeditating(true); // Restart meditation
    setIsPaused(false);
  };

  useEffect(() => {
    setOnAlarmDelete(resetMeditation); // Register callback
    return () => setOnAlarmDelete(() => {}); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (alarmDate) {
      setPlayingAlarm(false); // Reset playingAlarm when a new alarm is set
      setupSound(); // Reinitialize sound with the updated settings
    }
  }, [alarmDate]);

  useEffect(() => {
    if (isMeditating === false && alarmDate) {
      setMeditating(true);
      setIsPaused(false);
    }
  }, [alarmDate]);

  useEffect(() => {
    if (isMeditating) {
      playVoice(breatheState);
    }
  });

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
  }, []);

  const handleEnd = () => {
    setMeditating(false);
    updateMeditationDuration(id, duration);
    setAlarmDate(null);
    setDuration(0);
    router.push({
      pathname: "/(modal)/post-checkup",
      params: { id: id }, // Pass the id as a query parameter
    });
  };

  const setupSound = async () => {
    if (alarmSound) {
      await alarmSound.stopAsync();
      await alarmSound.unloadAsync(); // Unload the old sound
    }
    const sound = await initializeSound();
    setAlarmSound(sound); // Save the new sound instance
  };

  useEffect(() => {
    setupSound();
  }, []);

  const playAlarm = async () => {
    try {
      if (!alarmSound) {
        console.log("Alarm sound not initialized. Initializing now...");
        const sound = await initializeSound();
        await sound?.setIsLoopingAsync(true); // Enable looping
        await sound?.playAsync();
        setAlarmSound(sound); // Save the sound instance for stopping later
      } else {
        const status = await alarmSound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await alarmSound.setIsLoopingAsync(true); // Enable looping
          await alarmSound.playAsync();
        } else if (!status.isLoaded) {
          console.log("Sound not loaded. Reloading...");
          const sound = await initializeSound();
          await sound?.setIsLoopingAsync(true); // Enable looping
          await sound?.playAsync();
          setAlarmSound(sound); // Save the sound instance
        }
      }
      setPlayingAlarm(true); // Track if the alarm is playing
    } catch (error) {
      console.error("Error playing alarm sound:", error);
    }
  };

  const initializeSound = async () => {
    try {
      console.log("Initializing alarm...");
      const alarmAudioFileName = ALARM_DATA[alarm.value - 1].audio;

      const { sound } = await Audio.Sound.createAsync(
        ALARM_AUDIO_FILES[alarmAudioFileName]
      );

      console.log("Alarm initialized with sound:", alarmAudioFileName);
      return sound;
    } catch (error) {
      console.error("Failed to load alarm:", error);
    }
  };

  useEffect(() => {
    const handleAlarmUpdated = async () => {
      console.log("Alarm updated, refreshing alarm sound...");
      if (alarmSound) {
        await alarmSound.stopAsync();
        await alarmSound.unloadAsync(); // Unload the previous sound
      }
      const sound = await initializeSound();
      setAlarmSound(sound); // Set the new alarm sound
    };

    eventEmitter.on("alarmUpdated", handleAlarmUpdated);

    return () => {
      eventEmitter.off("alarmUpdated", handleAlarmUpdated);
    };
  }, [alarmSound, eventEmitter]);

  const initializeInhaleSound = async () => {
    const inhaleAudioFileName = INSTRUCTOR_DATA[instructor.value - 1].inhale;

    const { sound } = await Audio.Sound.createAsync(
      INSTRUCTOR_AUDIO_FILES[inhaleAudioFileName]
    );

    setInhaleSound(sound);
  };

  const initializeHoldSound = async () => {
    const holdAudioFileName = INSTRUCTOR_DATA[instructor.value - 1].hold;

    const { sound } = await Audio.Sound.createAsync(
      INSTRUCTOR_AUDIO_FILES[holdAudioFileName]
    );

    setHoldSound(sound);
  };

  const initializeExhaleSound = async () => {
    const exhaleAudioFileName = INSTRUCTOR_DATA[instructor.value - 1].exhale;

    const { sound } = await Audio.Sound.createAsync(
      INSTRUCTOR_AUDIO_FILES[exhaleAudioFileName]
    );

    setExhaleSound(sound);
  };

  const initializeInstructor = async () => {
    try {
      console.log("initializing instructor");
      initializeInhaleSound();
      initializeHoldSound();
      initializeExhaleSound();
      console.log("instructor initialized");
    } catch (e) {
      console.error("failed to load voices", e);
    }

    return;
  };

  const playVoice = (state: string) => {
    if (state === "Inhale") {
      exhaleSound?.stopAsync();
      inhaleSound?.playAsync();
    } else if (state === "Hold") {
      inhaleSound?.stopAsync();
      holdSound?.playAsync();
    } else if (state === "Exhale") {
      holdSound?.stopAsync();
      exhaleSound?.playAsync();
    }
  };

  useEffect(() => {
    initializeSound();
    initializeInstructor();
  }, []);

  useEffect(() => {
    setAlarmDate(null);
    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }

    if (countdown === 0) {
      setDuration(0);
      setMeditating(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (currentDate && alarmDate) {
      console.log("Current Date:", currentDate);
      console.log("Alarm Date:", alarmDate);
    }

    if (currentDate && alarmDate && alarmDate <= currentDate && !playingAlarm) {
      console.log("ALARM TRIGGERED!");
      playAlarm();
      setPlayingAlarm(true);
      setMeditating(false);
    }
  }, [currentDate, alarmDate, playingAlarm]);

  useEffect(() => {
    if (isMeditating) {
      const intervalId = setInterval(() => {
        setDuration((prevDuration) => {
          return prevDuration + 1;
        });
        setCurrentDate(new Date());
      }, 1000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(intervalId);
      };
    }
  }, [isMeditating]);

  const renderAlarmPopup = () => {
    return (
      <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/60 flex-1 items-center justify-center">
        <Text className="text-white font-medium text-2xl my-5">Alarm</Text>

        <Pressable
          onPress={async () => {
            if (alarmSound) {
              await alarmSound.stopAsync(); // Stop the sound
              await alarmSound.unloadAsync(); // Unload the sound
            }
            setPlayingAlarm(false); // Reset alarm state
            setAlarmDate(null); // Clear the alarm date to prevent retriggering
            setMeditating(true);
          }}
        >
          <View className="bg-green-500 px-16 py-3 rounded-full mx-15 mb-10">
            <Text className="text-white text-xl justify-center">Stop</Text>
          </View>
        </Pressable>
      </View>
    );
  };

  if (countdown === 0) {
    return (
      <>
        {playingAlarm && renderAlarmPopup()}

        <LinearGradient className="flex-1" colors={["#FFFFFF", "#B0FFE2"]}>
          <SafeAreaView className="flex-1 items-center justify-between">
            <View className="relative w-full">
              <Text className="text-2xl text-gray-500 my-10 text-center">
                {breatheState}
              </Text>
              <Pressable
                className="absolute right-0 my-10 mx-10 bg-red-500 p-2 px-5 rounded-full z-10"
                onPress={handleEnd}
              >
                <Text className="text-white font-semibold">End</Text>
              </Pressable>
            </View>

            <BreathingCircle
              isActive={isMeditating}
              timeInhale={MeditationConfiguration.TIME_INHALE}
              timeHold={MeditationConfiguration.TIME_HOLD}
              timeExhale={MeditationConfiguration.TIME_EXHALE}
              toValueInhale={3}
              toValueExhale={1}
              initialSize={50}
              onBreatheStateChange={setBreatheState}
            />
            <ControlBar
              currentTime={formatDuration(duration)}
              containerStyles="mb-5 shadow-xl"
              isPaused={isPaused} // Pass state as prop
              onPauseToggle={handlePauseToggle}
              onAlarmToggle={handleAlarmToggle}
              onAlarmSet={() => {
                setMeditating(true); // Unpause meditation
              }}
            />
          </SafeAreaView>
        </LinearGradient>
      </>
    );
  } else {
    return (
      <LinearGradient className="flex-1" colors={["#FFFFFF", "#B0FFE2"]}>
        <SafeAreaView className="flex-1">
          <View className="flex-1">
            <SafeAreaView className="flex-1 items-center justify-between">
              <Text className="text-2xl text-gray-500 my-10">{countdown}</Text>
              <BreathingCircle isActive={false} initialSize={50} />
              <View className="min-h-[62px] mb-5" />
            </SafeAreaView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
};

export default Meditation;
