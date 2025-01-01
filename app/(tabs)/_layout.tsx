import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import { FontAwesome6, Ionicons } from "@expo/vector-icons";

import colors from "tailwindcss/colors";
import Colors from "@/constants/Colors";
import { MeditationsProvider } from "@/context/MeditationsContext";

const TabsLayout = () => {
  return (
    <MeditationsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            tabBarLabel: "Activity",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="chart-simple" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </MeditationsProvider>
  );
};

export default TabsLayout;
