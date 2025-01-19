import AsyncStorage from '@react-native-async-storage/async-storage';
// import { v4 as uuidv4 } from "uuid";
import uuid from 'react-native-uuid';

// Key for storing meditations
const MEDITATIONS_KEY = 'meditations';

import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

export class Meditation {
    constructor(id, moodBefore, entryBefore, date, moodAfter = null, entryAfter = null, duration = null, breathCount = null, moodFigure = 0) {
        this.id = id;
        this.moodBefore = moodBefore;
        this.entryBefore = entryBefore;
        this.moodAfter = moodAfter;
        this.entryAfter = entryAfter;
        this.duration = duration;
        this.date = date;
        this.breathCount = breathCount;
        this.moodFigure = moodFigure;
    }
}

// Utility to get the next ID
export const createID = async () => {
    const id = uuid.v4();
    console.log("ID ", id);
    return id; // Generate a secure unique ID
};

// Save all meditations to AsyncStorage
export const saveMeditations = async (meditations) => {
    try {
        await AsyncStorage.setItem(MEDITATIONS_KEY, JSON.stringify(meditations));
    } catch (e) {
        console.error('Error saving meditations:', e);
        throw e;
    }
};

// Retrieve all meditations
export const getMeditations = async () => {
    try {
        const data = await AsyncStorage.getItem(MEDITATIONS_KEY);
        const meditations = data ? JSON.parse(data) : [];
        return meditations.map(
            (med) =>
                new Meditation(
                    med.id,
                    med.moodBefore,
                    med.entryBefore,
                    med.date,
                    med.moodAfter,
                    med.entryAfter,
                    med.duration,
                    med.breathCount,
                    med.moodFigure,
                )
        );
    } catch (e) {
        console.error('Error retrieving meditations:', e);
        throw e;
    }
};

export const getMeditationsWithinDateRange = async () => {
    try {
        const data = await AsyncStorage.getItem(MEDITATIONS_KEY);
        const meditations = data ? JSON.parse(data) : [];
        return meditations.map(
            (med) =>
                new Meditation(
                    med.id,
                    med.moodBefore,
                    med.entryBefore,
                    med.date,
                    med.moodAfter,
                    med.entryAfter,
                    med.duration,
                    med.breathCount,
                    med.moodFigure,
                )
        );
    } catch (e) {
        console.error('Error retrieving meditations:', e);
        throw e;
    }
}

// Add a new meditation
export const newMeditation = async (id, moodBefore, entryBefore) => {
    const meditations = await getMeditations();
    const date = new Date();
    const newMeditation = new Meditation(id, moodBefore, entryBefore, date);
    meditations.push(newMeditation);
    await saveMeditations(meditations);
    console.log("pushed meditation: ", meditations);
};

export const updateMeditationEntry = async (id, moodAfter, entryAfter) => {
    const meditations = await getMeditations();
    const meditation = meditations.find(med => med.id === id); // Find by UUID

    if (meditation) {
        // Update values
        meditation.moodAfter = moodAfter;
        meditation.entryAfter = entryAfter;

        if (meditation.moodBefore && meditation.moodAfter) {
            if (meditation.moodBefore > meditation.moodAfter) {
                 meditation.moodFigure = (-100 * (meditation.moodBefore / meditation.moodAfter));
            } else {
                meditation.moodFigure = (100 * (meditation.moodAfter / meditation.moodBefore));
            }
        } else {
            meditation.moodFigure = null
        }

        // Persist the updated data
        await saveMeditations(meditations);
    } else {
        console.log("error in updateMeditationEntry");
        throw new Error(`Meditation with id ${id} not found.`);
    }
};
  
// Update a meditation's duration
export const updateMeditationDuration = async (id, duration) => {
    const meditations = await getMeditations();
    const meditation = meditations.find(med => med.id === id); // Find by UUID

    if (meditation) {
        meditation.duration = duration;
        meditation.breathCount = duration / 19; // Update breath count
        await saveMeditations(meditations);
    } else {
        throw new Error(`Meditation with id ${id} not found.`);
    }
};

// Calculate total breaths across all meditations
export const getAllBreaths = async () => {
    const meditations = await getMeditations();

    return meditations.reduce((total, med) => total + (med.breathCount || 0), 0);
};

// Get the total count of meditations
export const getMeditationCount = async () => {
    const meditations = await getMeditations();
    return meditations.length;
};

// Clear all meditations
export const clearMeditations = async () => {
    try {
        await AsyncStorage.removeItem(MEDITATIONS_KEY);
    } catch (e) {
        console.error('Error clearing meditations:', e);
        throw e;
    }
};

export const formatDuration = (duration) => {
    const formattedTimeHours = String(Math.floor((duration / (60 * 60)) % 60));
    const formattedTimeMinutes = String(
    Math.floor((duration / 60) % 60)).padStart(duration < 60 * 10 ? 1 : 2, "0");
    const formattedTimeSeconds = String(duration % 60).padStart(2, "0");
    return duration < 60 * 60
                ? `${formattedTimeMinutes}:${formattedTimeSeconds}`
                : `${formattedTimeHours}:${formattedTimeMinutes}:${formattedTimeSeconds}`;
}

export const formatDurationString = (duration) =>{
    const numHours = Math.floor((duration / (60 * 60)) % 60);
    const numMinutes = Math.floor((duration / 60) % 60);
    const numSeconds = duration % 60;

    const formattedTimeHours = `${String(numHours)} ${numHours > 1 ? `hours` : `hour` }`;
    const formattedTimeMinutes = `${String(numMinutes)} ${numMinutes > 1 ? `minutes` : `minute` }`;
    const formattedTimeSeconds = `${String(numSeconds)} ${numSeconds > 1 ? `seconds` : `second` }`;

    if (duration < 60) {
        return formattedTimeSeconds
    } else if (duration < 60*60) {
        return `${formattedTimeMinutes}, ${formattedTimeSeconds}`
    } else {
        return `${formattedTimeHours}, ${formattedTimeMinutes}, ${formattedTimeSeconds}`
    }
}

export const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

export const formatDateToYMD = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDateDay = (date) => {
    const options = { day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
}

export const getDateWeekday = (date) => {
    const options = { weekday: "long" };
    return new Date(date).toLocaleDateString("en-US", options);
}

export const getDateMonth = (date) => {
    const options = {month: "long"};
    return new Date(date).toLocaleDateString("en-US", options);
}

export const getDateMonthNumeric = (date) => {
    const options = {month: "numeric"};
    return new Date(date).toLocaleDateString("en-US", options)
}

export const getDateYear = (date) => {
    const options = {year: "numeric"};
    return new Date(date).toLocaleDateString("en-US", options)
}

export const getAllTimeAverages = (firstDate, meditations) => {
    const today = new Date();
      
    // Filter meditations that fall within this year
    const allTimeMeditations = meditations.filter((item) => {
      const medDate = new Date(item.date); // Ensure med.date is a Date object
      return medDate >= firstDate && medDate <= today;
    });
  
    // Initialize arrays for weekly data
    const weeksInYear = 52;
    let weeklyMoodsBefore = Array.from({ length: weeksInYear }, () => []);
    let weeklyMoodsAfter = Array.from({ length: weeksInYear }, () => []);
    let weeklyAveragesBefore = Array(weeksInYear).fill(0);
    let weeklyAveragesAfter = Array(weeksInYear).fill(0);
  
    // Calculate the week number for each meditation and group them
    for (let item of allTimeMeditations) {
      const medDate = new Date(item.date);
      const weekIndex = Math.floor(
        (medDate - today) / (7 * 24 * 60 * 60 * 1000)
      ); // Calculate week index (0-based)
  
      if (weekIndex >= 0 && weekIndex < weeksInYear) {
        weeklyMoodsBefore[weekIndex].push(item.moodBefore);
        weeklyMoodsAfter[weekIndex].push(item.moodAfter);
      }
    }
  
    // Calculate weekly averages
    for (let i = 0; i < weeksInYear; i++) {
      if (weeklyMoodsBefore[i].length > 0) {
        weeklyAveragesBefore[i] =
          weeklyMoodsBefore[i].reduce((sum, mood) => sum + mood, 0) /
          weeklyMoodsBefore[i].length;
      }
  
      if (weeklyMoodsAfter[i].length > 0) {
        weeklyAveragesAfter[i] =
          weeklyMoodsAfter[i].reduce((sum, mood) => sum + mood, 0) /
          weeklyMoodsAfter[i].length;
      }
    }
  
    // Format the results
    const formattedAverages = weeklyAveragesBefore.map((avgBefore, i) => ({
      week: i + 1, // Week number (1-based)
      avgMoodBefore: avgBefore,
      avgMoodAfter: weeklyAveragesAfter[i],
    }));
  
    return formattedAverages;
}

export const getFirstMeditationDate = async () => {
    try {
        const meditations = await getMeditations();
        const formattedData = meditations.map((item) => ({
              id: String(item.id),
              date: item.date || "",
              duration: item.duration || 0,
              moodFigure: item.moodFigure || null,
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    

            return new Date(formattedData[0].date);
    } catch (e) {
        console.error("Error getting date of first meditation", e);
    }
}

export const getThisYearAverages = (meditations) => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()); // January 1st
    const endOfYear = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // December 31st
  
    // Filter meditations that fall within this year
    const thisYearMeditations = meditations.filter((item) => {
      const medDate = new Date(item.date); // Ensure med.date is a Date object
      return medDate >= startOfYear && medDate <= endOfYear;
    });
  
    // Initialize arrays for weekly data
    const weeksInYear = 52;
    let weeklyMoodsBefore = Array.from({ length: weeksInYear }, () => []);
    let weeklyMoodsAfter = Array.from({ length: weeksInYear }, () => []);
    let weeklyAveragesBefore = Array(weeksInYear).fill(0);
    let weeklyAveragesAfter = Array(weeksInYear).fill(0);
  
    // Calculate the week number for each meditation and group them
    for (let item of thisYearMeditations) {
      const medDate = new Date(item.date);
      const weekIndex = Math.floor(
        (medDate - startOfYear) / (7 * 24 * 60 * 60 * 1000)
      ); // Calculate week index (0-based)
  
      if (weekIndex >= 0 && weekIndex < weeksInYear) {
        weeklyMoodsBefore[weekIndex].push(item.moodBefore);
        weeklyMoodsAfter[weekIndex].push(item.moodAfter);
      }
    }
  
    // Calculate weekly averages
    for (let i = 0; i < weeksInYear; i++) {
      if (weeklyMoodsBefore[i].length > 0) {
        weeklyAveragesBefore[i] =
          weeklyMoodsBefore[i].reduce((sum, mood) => sum + mood, 0) /
          weeklyMoodsBefore[i].length;
      }
  
      if (weeklyMoodsAfter[i].length > 0) {
        weeklyAveragesAfter[i] =
          weeklyMoodsAfter[i].reduce((sum, mood) => sum + mood, 0) /
          weeklyMoodsAfter[i].length;
      }
    }
  
    // Format the results
    const formattedAverages = weeklyAveragesBefore.map((avgBefore, i) => ({
      week: i + 1, // Week number (1-based)
      avgMoodBefore: avgBefore,
      avgMoodAfter: weeklyAveragesAfter[i],
    }));
  
    return formattedAverages;
  };

export const getThisMonthAverages = (meditations) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
    // Filter meditations that fall within this month
    const thisMonthMeditations = meditations.filter((item) => {
      const medDate = new Date(item.date); // Ensure med.date is a Date object
      return medDate >= startOfMonth && medDate <= endOfMonth;
    });
  
    const daysInMonth = endOfMonth.getDate();
    let thisMonthMoodsBefore = Array.from({ length: daysInMonth }, () => []);
    let thisMonthMoodsAfter = Array.from({ length: daysInMonth }, () => []);
    let thisMonthAveragesBefore = Array(daysInMonth).fill(0);
    let thisMonthAveragesAfter = Array(daysInMonth).fill(0);
  
    // Populate mood data for each day
    for (let item of thisMonthMeditations) {
      const medDate = new Date(item.date);
      const dayIndex = medDate.getDate() - 1; // Day of month (1-based) to 0-based index
  
      thisMonthMoodsBefore[dayIndex].push(item.moodBefore);
      thisMonthMoodsAfter[dayIndex].push(item.moodAfter);
    }
  
    // Calculate daily averages
    for (let i = 0; i < daysInMonth; i++) {
      if (thisMonthMoodsBefore[i].length > 0) {
        thisMonthAveragesBefore[i] =
          thisMonthMoodsBefore[i].reduce((sum, mood) => sum + mood, 0) /
          thisMonthMoodsBefore[i].length;
      }
  
      if (thisMonthMoodsAfter[i].length > 0) {
        thisMonthAveragesAfter[i] =
          thisMonthMoodsAfter[i].reduce((sum, mood) => sum + mood, 0) /
          thisMonthMoodsAfter[i].length;
      }
    }
  
    // Format the results
    const formattedAverages = thisMonthAveragesBefore.map((avgBefore, i) => ({
      avgMoodBefore: avgBefore,
      avgMoodAfter: thisMonthAveragesAfter[i],
    }));
  
    return formattedAverages;
  };

export const getThisWeekAverages = (meditations) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);

    // Set start to Sunday (subtract the dayOfWeek)
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // Set end to Saturday (add remaining days of the week)
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
    endOfWeek.setHours(23, 59, 59, 999);

    // Filter meditations that fall within this week
    const thisWeekMeditations = meditations.filter((item) => {
      const medDate = item.date; // Assuming med.date is a valid date string
      return medDate >= startOfWeek && medDate <= endOfWeek;
    });

    let thisWeekMoodsBefore = [[], [], [], [], [], [], []];
    let thisWeekMoodsAfter = [[], [], [], [], [], [], []];
    let thisWeekAveragesBefore = [];
    let thisWeekAveragesAfter = [];

    for (let i = 0; i <= today.getDay(); i++) {
      for (let item of thisWeekMeditations) {
        if (i === item.date.getDay()) {
          thisWeekMoodsBefore[i].push(item.moodBefore);
          thisWeekMoodsAfter[i].push(item.moodAfter);
        }
      }

      if (
        thisWeekMoodsBefore[i].length > 0 &&
        thisWeekMoodsAfter[i].length > 0
      ) {
        let averageBefore = 0;
        for (let mood of thisWeekMoodsBefore[i]) {
          averageBefore += mood / thisWeekMoodsBefore[i].length;
        }
        thisWeekAveragesBefore[i] = (averageBefore);

        let averageAfter = 0;
        for (let mood of thisWeekMoodsAfter[i]) {
          averageAfter += mood / thisWeekMoodsAfter[i].length;
        }
        thisWeekAveragesAfter[i] = (averageAfter);
      }
    }

    const formattedAverages = [];

    for (let i = 0; i < 7; i++) {
      formattedAverages.push({
        avgMoodBefore: thisWeekAveragesBefore[i] || 0,
        avgMoodAfter: thisWeekAveragesAfter[i] || 0,
      });
    }
    
    return formattedAverages;
  };

  export const getMoodFigureTimeRange = async (startDate, endDate) => {
    const meditations = await getMeditations();
    
    const formattedData = meditations.map((item, index) => ({
        date: new Date(item.date) || "",
        moodBefore: item.moodBefore || null,
        moodAfter: item.moodAfter || null,
    }));

    const meditationsWithinRange = formattedData.filter((item) => {
        return item.date >= startDate && item.date <= endDate;
    })

    const moodBeforeTotal = meditationsWithinRange.reduce((total, med) => total + (med.moodBefore || null), 0);
    const moodAfterTotal = meditationsWithinRange.reduce((total, med) => total + (med.moodAfter || null), 0);

    console.log("moodBeforeTotal: ", moodBeforeTotal);
    console.log("moodAfterTotal: ", moodAfterTotal);

    if (moodBeforeTotal && moodAfterTotal) {
        if (moodBeforeTotal > moodAfterTotal) {
            return (-100 * (moodBeforeTotal / moodAfterTotal));
        } else {
            return (100 * (moodAfterTotal / moodBeforeTotal));
        }
    } else {
        return null
    }
  }

  export const getMoodIcon = (mood) => {
    if (mood === null || mood === 0) {
        return "minus-circle"
    } else if (mood < 0) {
        return "arrow-down-circle"
    } else {
        return "arrow-up-circle"
    }
  }

  export const getMoodIconColor = (mood) => {
    if (mood === null || mood === 0) {
        return colors.gray[300];
    } else if (mood < 0) {
        return colors.red[500];
    } else {
        return colors.green[500];
    }
  }

  export function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }