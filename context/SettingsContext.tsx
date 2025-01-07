import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "eventemitter3";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create Context
// const SettingsContext = createContext();

interface InstructorSettings {
  value: number;
  isEnabled: boolean;
  updateValue: (value: number) => void;
  toggleEnabled: (isEnabled: boolean) => void;
}

interface AlarmSettings {
  value: number;
  updateValue: (value: number) => void;
}

interface SettingsContextType {
  instructor: InstructorSettings;
  alarm: AlarmSettings;
  eventEmitter: EventEmitter<string | symbol, any>; // Add the eventEmitter property
}

export const SettingsContext = createContext<SettingsContextType>({
  instructor: {
    value: 1,
    isEnabled: true,
    updateValue: () => {},
    toggleEnabled: () => {},
  },
  alarm: {
    value: 1,
    updateValue: () => {},
  },
  eventEmitter: new EventEmitter<string | symbol, any>(), // Add a default event emitter instance
});

// Provide Context
export const SettingsProvider = ({ children }: { children: any }) => {
  const [instructorValue, setInstructorValue] = useState(1);
  const [instructorEnabled, setInstructorEnabled] = useState(true);
  const [alarmValue, setAlarmValue] = useState(1);

  const SETTINGS_KEY = "appSettings";

  const eventEmitter = new EventEmitter<string | symbol, any>(); // Ensure correct typing

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
        if (jsonValue) {
          const storedSettings = JSON.parse(jsonValue);
          setInstructorValue(storedSettings.instructorValue ?? 0);
          setInstructorEnabled(storedSettings.instructorEnabled ?? true);
          setAlarmValue(storedSettings.alarmValue ?? 1);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const settings = {
        instructorValue,
        instructorEnabled,
        alarmValue,
      };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const updateAlarmValue = (value: number) => {
    console.log("Updating alarm value to:", value);
    setAlarmValue(value);
    saveSettings();
    console.log("Emitting alarmUpdated event...");
    eventEmitter.emit("alarmUpdated");
  };

  return (
    <SettingsContext.Provider
      value={{
        instructor: {
          value: instructorValue,
          isEnabled: instructorEnabled,
          updateValue: setInstructorValue,
          toggleEnabled: setInstructorEnabled,
        },
        alarm: {
          value: alarmValue,
          updateValue: updateAlarmValue,
        },
        eventEmitter, // Provide the shared EventEmitter instance
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
