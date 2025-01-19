import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import colors, { current } from "tailwindcss/colors";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

export function BreathingCircle({
  isActive = false,
  showHoldAnimation = true,
  timeInhale = 0,
  timeHold = 0,
  timeExhale = 0,
  toValueInhale = 0,
  toValueExhale = 0,
  initialSize = 1,
  onBreatheStateChange = () => {},
}: {
  isActive: boolean;
  showHoldAnimation?: boolean;
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
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [currentState, setCurrentState] = useState("Inhale");

  useEffect(() => {
    let animation;
    if (isActive) {
      // Start the animation loop
      animation = Animated.loop(
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
          setCurrentState(phases[step]);

          if (phases[step] === "Hold") {
            opacityAnim.setValue(0); // Reset the animation value
            Animated.loop(
              Animated.sequence([
                Animated.timing(opacityAnim, {
                  toValue: 1,
                  duration: (timeHold * 1000) / 6,
                  useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                  toValue: 0.5,
                  duration: (timeHold * 1000) / 6,
                  useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                  toValue: 1,
                  duration: (timeHold * 1000) / 6,
                  useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                  toValue: 0.5,
                  duration: (timeHold * 1000) / 6,
                  useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                  toValue: 1,
                  duration: (timeHold * 1000) / 6,
                  useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                  toValue: 0,
                  duration: (timeHold * 1000) / 6,
                  useNativeDriver: true,
                }),
              ])
            ).start();
          } else {
            opacityAnim.stopAnimation(); // Stop the animation when leaving "Hold"
          }

          timeoutRef.current = setTimeout(() => {
            step = (step + 1) % phases.length; // Cycle through phases
            loop(); // Trigger the next phase
          }, durations[step]);
        };

        loop(); // Start the first phase
      };
      startBreatheLoop();
    }

    return () => {
      // Stop animations and timers
      animation?.stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      opacityAnim.stopAnimation();
    };
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
      {currentState === "Hold" && showHoldAnimation && (
        <Animated.View
          style={[
            styles.outerCircle,
            { width: initialSize + 5, height: initialSize + 5 },
            {
              transform: [{ scale: scaleAnim }], // Apply scale animation
            },
            { opacity: opacityAnim },
          ]}
        />
      )}
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
    position: "relative",
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
    position: "absolute",
  },
  gradient: {
    flex: 1,
    borderRadius: 100,
  },
  outerCircle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.green[400],
    backgroundColor: colors.white,
    overflow: "hidden",
  },
});
