import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";

const MeditationSummaryLoading = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <View className="items-center">
        <View style={styles.ellipse}>
          {/* <LinearGradient colors={[]} className="flex-1" /> */}
        </View>
      </View>

      <SafeAreaView className="flex-1">
        {/* <Text className="text-gray-900 text-3xl font-semibold my-5 mx-10">
          Done!
        </Text> */}
        <View className="my-5 mx-10 bg-gray-200 py-5 rounded-2xl w-32" />

        <View className="bg-gray-200 rounded-3xl p-4 min-w-[200px] m-2 mx-7">
          <Text className="text-gray-400 text-sm"></Text>
          <View className="h-[0.5] my-2" />

          <View className="flex-row pb-2 items-center">
            <Text className="text-gray-900 font-medium px-2 text-lg"></Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-900 font-medium px-2 text-lg"></Text>
          </View>
        </View>

        <View className="flex-row pt-5 pb-2 relative justify-between">
          <View className="mb-2 mx-10 bg-gray-200 py-5 rounded-2xl w-32" />
        </View>

        <View className="flex-row justify-center pb-10">
          <View className="bg-gray-200 rounded-3xl p-4 min-w-[170px] items-start m-2">
            <Text className="text-gray-400 font-semibold text-sm"></Text>
            <View className="mt-4 space-x-1">
              <View></View>
              <Text className="text-black text-2xl font-semibold"></Text>
            </View>
          </View>
          <View className="bg-gray-200 rounded-3xl p-4 min-w-[170px] items-start m-2">
            <Text className="text-gray-400 font-semibold text-sm"></Text>
            <View className="mt-4 space-x-1">
              <View className="my-3"></View>
              <Text className="text-black text-2xl font-semibold"></Text>
            </View>
          </View>
        </View>

        <View className="z-10">
          <View className="bg-gray-200 h-auto min-h-[200] rounded-3xl mx-10 py-5 px-5">
            <View className="relative mb-10">
              <Text className="text-xl text-gray-900 font-semibold absolute left-0"></Text>
              <Text className="text-2xl text-gray-900 absolute right-0"></Text>
            </View>
            <View className="bg-gray-300 h-[0.5] mb-2" />
            <View>
              <Text className="text-base text-gray-900"></Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  ellipse: {
    width: 2000,
    height: 2000,
    borderRadius: 2000,
    position: "absolute",
    marginVertical: -1800,
    overflow: "hidden",
  },
});

export default MeditationSummaryLoading;
