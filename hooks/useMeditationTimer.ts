import { useState, useEffect, useContext } from "react";
import { TimerContext } from "@/context/TimerContext";
import { router } from "expo-router";
import { updateMeditationDuration } from "@/storage";

export function useMeditationTimer(id: any) {
  const { duration, setDuration } = useContext(TimerContext);
  const [countdown, setCountdown] = useState(3);
  const [isMeditating, setMeditating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breatheState, setBreatheState] = useState("Inhale");

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setMeditating(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (isMeditating) {
      const intervalId = setInterval(() => setDuration((prev) => prev + 1), 1000);
      return () => clearInterval(intervalId);
    }
  }, [isMeditating]);

  const handlePauseToggle = (paused: boolean) => {
    setIsPaused(paused);
    setMeditating(!paused);
  };

  const handleEnd = () => {
    setMeditating(false);
    setDuration(0);
    updateMeditationDuration(id, duration);
    router.push({
        pathname: "/(modal)/post-checkup",
        params: { id: id }, // Pass the id as a query parameter
    });
  };

  return {
    countdown,
    isMeditating,
    setMeditating,
    isPaused,
    setIsPaused,
    breatheState,
    setBreatheState,
    duration,
    handlePauseToggle,
    handleEnd,
    startMeditation: () => setMeditating(true),
  };
}
