import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

export function BreathingCircle({
  isActive = false,
  timeInhale = 0,
  timeHold = 0,
  timeExhale = 0,
  toValueInhale = 0,
  toValueExhale = 0,
  initialSize = 1,
  onBreatheStateChange = () => {},
}: {
  isActive: boolean;
  timeInhale: number;
  timeHold: number;
  timeExhale: number;
  toValueInhale: number;
  toValueExhale: number;
  initialSize: number;
  onBreatheStateChange?: (state: string) => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      // Start the animation loop
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: toValueInhale,
            duration: timeInhale * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: toValueInhale,
            duration: timeHold * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: toValueExhale,
            duration: timeExhale * 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      // Synchronize breathe state updates with the animation
      const startBreatheLoop = () => {
        const phases = ["Inhale", "Hold", "Exhale"];
        const durations = [
          timeInhale * 1000,
          timeHold * 1000,
          timeExhale * 1000,
        ];
        let step = 0;

        const loop = () => {
          onBreatheStateChange?.(phases[step]);
          timeoutRef.current = setTimeout(() => {
            step = (step + 1) % phases.length; // Cycle through phases
            loop(); // Trigger the next phase
          }, durations[step]);
        };

        loop(); // Start the first phase
      };

      startBreatheLoop();

      // Cleanup on unmount or when isActive changes
      return () => {
        animation.stop();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [
    isActive,
    timeInhale,
    timeHold,
    timeExhale,
    toValueInhale,
    toValueExhale,
    onBreatheStateChange,
  ]);

  return (
    <View style={styles.circleContainer}>
      <Animated.View
        style={[
          styles.circle,
          { width: initialSize, height: initialSize },
          {
            transform: [{ scale: scaleAnim }], // Apply scale animation
          },
        ]}
      >
        <LinearGradient colors={Colors.greenGradient} style={styles.gradient} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 3,
    shadowRadius: 10,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    borderRadius: 100,
  },
});
