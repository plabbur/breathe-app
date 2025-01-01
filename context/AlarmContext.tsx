import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

interface AlarmContextProps {
  alarmDate: Date;
  setAlarmDate: Dispatch<SetStateAction<Date>>;
}

export const AlarmContext = createContext<AlarmContextProps>({
  alarmDate: new Date(),
  setAlarmDate: () => {},
});

interface AlarmProviderProps {
  children: ReactNode;
}

const AlarmProvider = ({ children }: AlarmProviderProps) => {
  const [alarmDate, setAlarmDate] = useState(new Date());

  useEffect(() => {
    console.log("AlarmContext alarmDate updated:", alarmDate);
  }, [alarmDate]);

  return (
    <AlarmContext.Provider value={{ alarmDate, setAlarmDate }}>
      {children}
    </AlarmContext.Provider>
  );
};

export default AlarmProvider;
