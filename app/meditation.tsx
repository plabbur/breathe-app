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
import { AlarmContext } from "@/context/AlarmContext";

const Meditation = () => {
  const { id } = useLocalSearchParams(); // Extract the id from the route parameters

  const TIME_INHALE = 4;
  const TIME_HOLD = 7;
  const TIME_EXHALE = 8;

  const [countdown, setCountdown] = useState(3);
  const { duration: duration, setDuration } = useContext(TimerContext);
  const { alarmDate: alarmDate, setAlarmDate } = useContext(AlarmContext);

  const [alarmSound, setAlarmSound] = useState<Audio.Sound>();
  const [currentDate, setCurrentDate] = useState<Date>();

  const [playingAlarm, setPlayingAlarm] = useState(false);

  const [isMeditating, setMeditating] = useState(false);
  const [breatheState, setBreatheState] = useState("Inhale");

  let timerId: NodeJS.Timeout;

  const { resumeMeditation } = useLocalSearchParams();

  const [isPaused, setIsPaused] = useState(false);

  const handlePauseToggle = (pauseState) => {
    setIsPaused(pauseState);
    setMeditating(!pauseState);
  };

  const handleAlarmToggle = () => {
    setIsPaused(true);
    setMeditating(false);
  };

  useEffect(() => {
    if (isMeditating === false && alarmDate) {
      // Check if meditation should resume
      setMeditating(true);
      setIsPaused(false);
    }
  }, [alarmDate]);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          interruptionModeIOS: 1, // Replace constant with string
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
          interruptionModeAndroid: 1, // Replace constant with string
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
    alarmSound?.stopAsync();

    setPlayingAlarm(false); // Reset alarm state

    setDuration(0);

    router.push({
      pathname: "/(modal)/post-checkup",
      params: { id: id }, // Pass the id as a query parameter
    });
  };

  useEffect(() => {
    const setupAlarmSound = async () => {
      const sound = await initializeSound();
      setAlarmSound(sound);
    };

    setupAlarmSound();
  }, []);

  const playAlarm = async () => {
    try {
      if (!alarmSound) {
        console.log("Alarm sound not initialized. Initializing now...");
        const sound = await initializeSound();
        await sound.playAsync();
      } else {
        const status = await alarmSound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await alarmSound.playAsync();
        } else if (!status.isLoaded) {
          console.log("Sound not loaded. Reloading...");
          const sound = await initializeSound();
          await sound.playAsync();
        }
      }
      setPlayingAlarm(true); // Optional: Track if the alarm is playing
    } catch (error) {
      console.error("Error playing alarm sound:", error);
    }
  };

  const initializeSound = async () => {
    try {
      console.log("Initializing sound...");
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/audio/alarm.mp3") // Ensure this path is correct
      );
      console.log("Sound initialized.");
      return sound;
    } catch (error) {
      console.error("Failed to load sound:", error);
    }
  };

  useEffect(() => {
    setAlarmDate(null);
    initializeSound();
    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      // Cleanup the timer when the component unmounts or countdown changes
      return () => clearTimeout(timerId);
    }

    if (countdown === 0) {
      setDuration(0);
      setMeditating(true);
    }
  }, [countdown]);

  useEffect(() => {
    // Update the currentDate every second
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, []); // Run only once to set up the interval

  useEffect(() => {
    if (currentDate && alarmDate && alarmDate <= currentDate && !playingAlarm) {
      console.log("ALARM TRIGGERED!");
      playAlarm();
      setPlayingAlarm(true);
    }
  }, [currentDate, alarmDate]); // Trigger this effect whenever currentDate or alarmDate changes

  useEffect(() => {
    if (isMeditating) {
      const intervalId = setInterval(() => {
        setDuration((prevDuration) => {
          return prevDuration + 1;
        });
      }, 1000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(intervalId);
      };
    }
  }, [isMeditating]);

  // Format the time left to ensure two digits are displayed
  const formattedTimeHours = String(Math.floor((duration / (60 * 60)) % 60));
  const formattedTimeMinutes = String(
    Math.floor((duration / 60) % 60)
  ).padStart(duration < 60 * 10 ? 1 : 2, "0");
  const formattedTimeSeconds = String(duration % 60).padStart(2, "0");

  if (countdown === 0) {
    return (
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
            timeInhale={TIME_INHALE}
            timeHold={TIME_HOLD}
            timeExhale={TIME_HOLD}
            toValueInhale={3}
            toValueExhale={1}
            initialSize={50}
            onBreatheStateChange={setBreatheState}
          />
          <ControlBar
            currentTime={
              duration < 60 * 60
                ? `${formattedTimeMinutes}:${formattedTimeSeconds}`
                : `${formattedTimeHours}:${formattedTimeMinutes}:${formattedTimeSeconds}`
            }
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
