import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AlarmContextProps {
  alarmDate: Date | null; // Allow null for no alarm
  setAlarmDate: Dispatch<SetStateAction<Date | null>>;
  setOnAlarmDelete: (callback: () => void) => void; // Add this method
  handleAlarmDelete: () => void; // Add this method
}

export const AlarmContext = createContext<AlarmContextProps>({
  alarmDate: null,
  setAlarmDate: () => {},
  setOnAlarmDelete: () => {},
  handleAlarmDelete: () => {},
});

interface AlarmProviderProps {
  children: ReactNode;
}

const AlarmProvider = ({ children }: AlarmProviderProps) => {
  const [alarmDate, setAlarmDate] = useState<Date | null>(null); // Start as null
  const [onAlarmDelete, setOnAlarmDeleteCallback] = useState<
    (() => void) | null
  >(null);

  useEffect(() => {
    console.log("AlarmContext alarmDate updated:", alarmDate);
  }, [alarmDate]);

  const handleAlarmDelete = () => {
    setAlarmDate(null); // Clear the alarm
    if (onAlarmDelete) {
      onAlarmDelete(); // Trigger the registered callback
    }
    console.log("Alarm deleted.");
  };

  const setOnAlarmDelete = (callback: () => void) => {
    setOnAlarmDeleteCallback(() => callback); // Set the callback
  };

  return (
    <AlarmContext.Provider
      value={{
        alarmDate,
        setAlarmDate,
        setOnAlarmDelete,
        handleAlarmDelete,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};

// Custom hook to use the AlarmContext
export const useAlarm = () => {
  return useContext(AlarmContext);
};

export default AlarmProvider;
