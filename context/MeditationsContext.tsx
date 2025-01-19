import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Meditation } from "@/storage";
import { EventEmitter } from "eventemitter3";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MeditationType {
  id: any;
  moodBefore: number;
  entryBefore: string;
  moodAfter: number;
  entryAfter: string;
  duration: number;
  date: Date;
  breathCount: number;
  moodFigure: number;
}

// Create the event emitter
const eventEmitter = new EventEmitter();

// Create the context
const MeditationsContext = createContext<{
  meditations: MeditationType[] | null;
  loading: boolean;
  fetchMeditations: () => Promise<void>;
  fetchMeditationById: (id: any) => Promise<MeditationType>;
  deleteMeditation: (id: any) => Promise<void>;
  saveMeditations: (meditations: Meditation[] | null) => Promise<void>;
}>({
  meditations: null,
  loading: false,
  fetchMeditations: async () => {},
  fetchMeditationById: async (id: any) => {
    throw new Error("fetchMeditationById is not implemented");
  },
  deleteMeditation: async (id: any) => {},
  saveMeditations: async (meditations: MeditationType[] | null) => {},
});

const MEDITATIONS_KEY = "meditations";

// Provider component
export const MeditationsProvider = ({ children }: { children: ReactNode }) => {
  const [meditations, setMeditations] = useState<MeditationType[]>([]);
  const [loading, setLoading] = useState(true);

  // Retrieve all meditations
  const fetchMeditations = async () => {
    try {
      const data = await AsyncStorage.getItem(MEDITATIONS_KEY);
      const meditations = data ? JSON.parse(data) : [];
      const fetchedMeditations: MeditationType[] = meditations.map(
        (med: any) => ({
          id: med.id,
          moodBefore: med.moodBefore,
          entryBefore: med.entryBefore,
          moodAfter: med.moodAfter,
          entryAfter: med.entryAfter,
          duration: med.duration,
          date: new Date(med.date), // Ensure the date is a Date object
          breathCount: med.breathCount,
          moodFigure: med.moodFigure,
        })
      );
      setMeditations(fetchedMeditations);
    } catch (e) {
      console.error("Error retrieving meditations:", e);
      throw e;
    }
  };

  const fetchMeditationById = async (id: string): Promise<MeditationType> => {
    const meditation = meditations.find((item: Meditation) => item.id === id);
    if (!meditation) {
      throw new Error(`Meditation with ID ${id} not found`);
    }
    return meditation;
  };

  const deleteMeditation = async (id: string): Promise<void> => {
    const updatedMeditations = meditations.filter((med) => med.id !== id);
    await saveMeditations(updatedMeditations);
    setMeditations(updatedMeditations);
    eventEmitter.emit("meditationDeleted");
  };

  const saveMeditations = async (
    meditations: MeditationType[]
  ): Promise<void> => {
    try {
      await AsyncStorage.setItem(MEDITATIONS_KEY, JSON.stringify(meditations));
    } catch (e) {
      console.error("Error saving meditations:", e);
      throw e;
    }
  };

  useEffect(() => {
    fetchMeditations();
  }, []);

  return (
    <MeditationsContext.Provider
      value={{
        meditations,
        loading,
        fetchMeditations,
        fetchMeditationById,
        deleteMeditation,
        saveMeditations,
      }}
    >
      {children}
    </MeditationsContext.Provider>
  );
};

export const useMeditations = () => useContext(MeditationsContext);
