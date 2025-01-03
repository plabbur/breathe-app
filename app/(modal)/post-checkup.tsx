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
import { router, useLocalSearchParams } from "expo-router";
import { updateMeditationEntry } from "@/storage";

const Checkup = () => {
  const [text, onChangeText] = useState("");
  const [isEmojiSelected, setIsEmojiSelected] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(0);
  const { id } = useLocalSearchParams(); // Extract the id from the route parameters

  return (
    <View className="flex-1 bg-gray[100]">
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-5 py-5">
          <View className="relative">
            {/* <Pressable
              className="absolute left-0 px-5 py-2 z-10"
              onPress={() => {
                console.log("close");
                router.back();
              }}
            >
              <Feather name="x" size={24} color="black" />
            </Pressable> */}

            <Text className="text-base text-gray-900 font-semibold text-center py-2">
              Before we end
            </Text>

            <Pressable
              className="absolute right-0 px-5 py-2"
              onPress={() => {
                updateMeditationEntry(id, null, null);

                router.dismiss();
                router.push({
                  pathname: `/activity/${id}`,
                  params: { id: id }, // Pass the id as a query parameter
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
                setSelectedEmoji(index);
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

        <View className="p-5">
          <CustomButton
            onPress={async () => {
              if (isEmojiSelected) {
                await updateMeditationEntry(id, selectedEmoji + 1, text); // Wait for update
                router.dismiss();
                router.push({
                  pathname: `/activity/${id}`,
                  params: { id: id },
                });
              }
            }}
            title="Finish"
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
