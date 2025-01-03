import React, { createContext, useContext, useState } from "react";

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
});

// Provide Context
export const SettingsProvider = ({ children }: { children: any }) => {
  const [instructorValue, setInstructorValue] = useState(1);
  const [instructorEnabled, setInstructorEnabled] = useState(true);

  const [alarmValue, setAlarmValue] = useState(1);

  const updateInstructorValue = (value: number) => {
    setInstructorValue(value);
  };

  const toggleInstructorEnabled = (isEnabled: boolean) => {
    setInstructorEnabled(isEnabled);
  };

  const updateAlarmValue = (value: number) => {
    setAlarmValue(value);
  };

  const instructor: InstructorSettings = {
    value: instructorValue,
    isEnabled: instructorEnabled,
    updateValue: updateInstructorValue,
    toggleEnabled: toggleInstructorEnabled,
  };

  const alarm: AlarmSettings = {
    value: alarmValue,
    updateValue: updateAlarmValue,
  };

  return (
    <SettingsContext.Provider
      value={{
        instructor,
        alarm,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
