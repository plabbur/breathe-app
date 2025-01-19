import { createContext, ReactNode, useContext, useState } from "react";
import colors from "tailwindcss/colors";
import { DefaultColors } from "tailwindcss/types/generated/colors";

export interface MoodType {
  moodBefore: number | null;
  moodAfter: number | null;
  moodFigure: number | null;
}

const MoodContext = createContext<{
  mood: MoodType | null;
  getMoodIcon: () => Promise<string>;
  getMoodColor: () => Promise<any>;
}>({
  mood: { moodBefore: null, moodAfter: null, moodFigure: null },
  getMoodIcon: () => {
    throw new Error("No Mood to extract icon from");
  },
  getMoodColor: () => {
    throw new Error("No Mood to extract color from");
  },
});

const MoodProvider = ({ children }: { children: ReactNode }) => {
  const [mood, setMood] = useState<MoodType>();

  const getMoodIcon = () => {
    if (mood?.moodFigure === null || mood?.moodFigure === 0) {
      return "minus-circle";
    } else if (mood?.moodFigure < 0) {
      return "arrow-down-circle";
    } else {
      return "arrow-up-circle";
    }
  };

  const getMoodColor = () => {
    if (mood?.moodFigure === null || mood?.moodFigure === 0) {
      return colors.gray[300];
    } else if (mood?.moodFigure < 0) {
      return colors.red[500];
    } else {
      return colors.green[500];
    }
  };

  return (
    <MoodContext.Provider value={{ mood, getMoodColor, getMoodIcon }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = useContext(MoodContext);
