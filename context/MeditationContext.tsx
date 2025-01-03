import { Meditation } from "@/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, ReactNode } from "react";

const MeditationContext = createContext({
  getMeditationById: async (id: string) => null,
});

export const MeditationProvider = ({ children }: { children: ReactNode }) => {
  const getMeditationById = async (id: string) => {
    try {
      const data = await AsyncStorage.getItem("meditations");
      const meditations = data ? JSON.parse(data) : [];
      const meditation = meditations.find((item: Meditation) => item.id === id);
      console.log("Meditation with ID:", id, meditation);
      return meditation;
    } catch (error) {
      console.error("Error retrieving meditation by ID:", error);
    }
  };

  return (
    <MeditationContext.Provider value={{ getMeditationById }}>
      {children}
    </MeditationContext.Provider>
  );
};

export const useMeditation = () => useContext(MeditationContext);
