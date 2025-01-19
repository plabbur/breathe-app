import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import colors from "tailwindcss/colors";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

// var emojiSelected = 1;
const emojis = ["😔", "😕", "😐", "🙂", "😁"];

export function EmojiButton({
  index,
  text,
  selectedIndex,
  onPress,
  props,
}: {
  index: number;
  text: string;
  selectedIndex: number;
}) {
  return (
    <Pressable
      style={[
        styles.button,
        selectedIndex == index
          ? styles.buttonSelected
          : styles.buttonUnselected,
      ]}
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // props.onPressIn?.(ev);
      }}
      onPress={() => onPress(index)}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

export function EmojiRating({ setSelectedCallback }) {
  const [emojiSelected, setEmojiSelected] = useState();

  const handlePress = (index) => {
    setEmojiSelected(index);
    setSelectedCallback?.(index); // Notify parent about the selection
    console.log(index);
  };

  return (
    <View style={styles.fullContainer}>
      {emojis.map((emoji, index) => (
        <EmojiButton
          key={index}
          index={index}
          text={emoji}
          selectedIndex={emojiSelected}
          onPress={handlePress}
          props={undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: windowWidth / 5 - 23,
    height: windowWidth / 5 - 23,
    backgroundColor: colors.white,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginHorizontal: 7.5,
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    borderColor: colors.blue[700],
    borderWidth: 2,
  },
  buttonSelected: {
    borderColor: colors.blue[700],
    borderWidth: 2,
  },
  buttonUnselected: {
    borderColor: colors.white,
    borderWidth: 2,
  },
  text: {
    fontSize: 26,
    alignContent: "center",
  },
});
