import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import ContextMenu from "react-native-context-menu-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
// import { HoldItem } from "react-native-hold-menu";

const ReadEntry = () => {
  const emojis = ["😔", "😕", "😐", "🙂", "😁"];

  const { title } = useLocalSearchParams();
  const { mood } = useLocalSearchParams();
  const { entry } = useLocalSearchParams();

  const [isEditing, setIsEditing] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);
  const circle = false;

  return (
    <View className="px-5 py-5">
      <View className="flex-1 justify-center my-4">
        <Text className="text-xl text-gray-900 font-semibold absolute left-0">
          {title}
        </Text>
        <Text className="text-2xl text-gray-900 absolute right-0">
          {emojis[mood - 1]}
        </Text>
      </View>
      <View className="bg-gray-300 h-[0.5] my-2 mb-5" />
      <View>
        {/* <HoldItem
          items={[
            {
              text: "Edit",
              onPress: () => {
                console.log("edit");
              },
            },
            {
              text: "Delete",
              onPress: () => {
                console.log("delete");
              },
            },
          ]}
        /> */}

        {/* <MaterialCommunityIcons
          name="dots-horizontal"
          size={24}
          color={colors.black}
        /> */}
        {/* <ContextMenu
          actions={[{ title: "Title 1" }, { title: "Title 2" }]}
          onPress={() => {
            console.log("hi");
          }}
        >
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={colors.black}
          />
        </ContextMenu> */}

        {/* <ContextMenu
          title={"Edit Entry"}
          actions={[
            {
              title: "Edit entry",
              inlineChildren: true,
              actions: [
                {
                  title: "Edit",
                },
                {
                  title: "Delete",
                },
              ],
            },
            {
              title: "Transparent",
              destructive: true,
            },
          ]}
          onPress={(event) => {
            const { index, indexPath, name } = event.nativeEvent;
            if (indexPath?.at(0) == 0) {
              // The first item is nested in a submenu
              setIsEditing(true);
            } else if (index == 1) {
              setHasDeleted(true);
            }
          }}
          onCancel={() => {
            console.warn("CANCELLED");
          }}
          previewBackgroundColor="transparent"
        >
          <View
            style={[
              styles.rectangle,
              {
                backgroundColor: colors.red[500],
                borderRadius: circle ? 999 : 0,
              },
            ]}
          />
        </ContextMenu> */}
      </View>

      <ScrollView>
        <View>
          <Text className="text-base text-gray-900">{entry}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReadEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  rectangle: {
    width: 200,
    height: 200,
  },
  spacer: {
    height: 16,
  },
});
