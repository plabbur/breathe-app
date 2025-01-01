import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Keyboard,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { EmojiRating } from "@/components/EmojiRating";
import colors from "tailwindcss/colors";
import CustomButton from "@/components/CustomButton";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import uuid from "react-native-uuid";

import { createID, newMeditation } from "@/storage";

const Checkup = () => {
  const [text, onChangeText] = useState("");
  const [isEmojiSelected, setIsEmojiSelected] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(0);

  return (
    <View className="flex-1 bg-gray[100]">
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-5 py-5">
          <View className="relative">
            <Pressable
              className="absolute left-0 px-5 py-2 z-10"
              onPress={() => {
                console.log("close");
                router.back();
              }}
            >
              <Feather name="x" size={24} color="black" />
            </Pressable>

            <Text className="text-base text-gray-900 font-semibold text-center py-2">
              Before we start
            </Text>

            <Pressable
              className="absolute right-0 px-5 py-2"
              onPress={() => {
                const meditationId = uuid.v4();
                newMeditation(meditationId, null, null);

                router.dismiss();
                router.push({
                  pathname: "/meditation",
                  params: { id: meditationId }, // Pass the id as a query parameter
                });
                console.log("skip");
              }}
            >
              <View className="bg-gray-300/50 w-auto h-6 rounded-full justify-center">
                <Text className="text-sm text-gray-400 px-3 text-center">
                  Skip
                </Text>
              </View>
            </Pressable>
          </View>

          <View className="flex-grow">
            <Text className="text-2xl font-semibold py-5 px-5">
              How are you feeling?
            </Text>
            <EmojiRating
              setSelectedCallback={(index) => {
                setIsEmojiSelected(index !== null);
                setSelectedEmoji(index + 1);
              }}
            />
            <TextInput
              className="bg-white shadow-md text-base shadow-gray-300/60 rounded-xl h-32 mx-5 my-5 p-3"
              onChangeText={onChangeText}
              value={text}
              placeholder="Say a few words about how you’re feeling at the moment"
              multiline={true}
              blurOnSubmit={true}
              onSubmitEditing={() => Keyboard.dismiss()}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Ensure the button is fixed at the bottom */}
        <View className="p-5">
          <CustomButton
            onPress={() => {
              if (isEmojiSelected) {
                const meditationId = uuid.v4();
                console.log("meditationId = ", meditationId);
                console.log("String(meditationId) = ", String(meditationId));
                newMeditation(meditationId, selectedEmoji, text);

                router.dismiss();
                router.push({
                  pathname: "/meditation",
                  params: { id: meditationId }, // Pass the id as a query parameter
                });
                console.log("begin");
              }
            }}
            title="Continue"
            containerStyles={`${
              isEmojiSelected ? "bg-green-400" : "bg-gray-300/40"
            }`}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Checkup;
