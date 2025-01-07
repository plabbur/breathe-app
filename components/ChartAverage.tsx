import {
  View,
  Text,
  Pressable,
  FlatList,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  getMeditations,
  getThisMonthAverages,
  getThisWeekAverages,
  getThisYearAverages,
  getMoodFigureTimeRange,
  getMoodIcon,
  getMoodIconColor,
  Meditation,
  getAllTimeAverages,
  getFirstMeditationDate,
} from "@/storage";
import colors from "tailwindcss/colors";
import { Feather } from "@expo/vector-icons";

const ChartAverage = () => {
  const [allTimeAverages, setAllTimeAverages] = useState<any>([]);
  const [thisWeekAverages, setThisWeekAverages] = useState<any>([]);
  const [thisMonthAverages, setThisMonthAverages] = useState<any>([]);
  const [thisYearAverages, setThisYearAverages] = useState<any>([]);

  const [moodFigure, setMoodFigure] = useState(0);

  const [filterRange, setFilterRange] = useState("This week");
  const filters = ["All time", "This year", "This month", "This week"];
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const DAYS_IN_MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const [firstMeditationDate, setFirstMeditationDate] = useState(null);

  const { width } = useWindowDimensions();
  const [barMargin, setBarMargin] = useState(10);
  const [numBars, setNumBars] = useState(7); // Week, to start
  const availableSpace = width - (numBars - 1) * barMargin - 80;
  const INCREMENT_HEIGHT = 30;
  const INCREMENT_WIDTH = availableSpace / numBars;

  const handleFilterChange = async (item: string) => {
    try {
      const dateRange = await getDateRange(item);
      const moodFig = await getMoodFigureTimeRange(dateRange[0], dateRange[1]);

      setMoodFigure(moodFig ? moodFig.toFixed(0) : 0);

      if (item === "This week") {
        setNumBars(7);
        setBarMargin(10);
      } else if (item === "This month") {
        const today = new Date();
        setNumBars(DAYS_IN_MONTHS[today.getMonth()]);
        setBarMargin(2);
      } else if (item === "This year") {
        setNumBars(52);
        setBarMargin(2);
      } else if (item === "All time") {
        setNumBars(52);
        setBarMargin(2);
      }

      setFilterRange(item);
    } catch (error) {
      console.error("Error changing filter:", error);
    }
  };

  const getDateRange = async (toFilter: string) => {
    const today = new Date();

    switch (toFilter) {
      case "This week": {
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        const endOfWeek = new Date(today);

        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
        endOfWeek.setHours(23, 59, 59, 999);

        return [startOfWeek, endOfWeek];
      }
      case "This month": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        return [startOfMonth, endOfMonth];
      }
      case "This year": {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);
        return [startOfYear, endOfYear];
      }
      case "All time": {
        return [firstMeditationDate, new Date()];
      }
      default: {
        return [new Date(0, 0, 0), new Date()];
      }
    }
  };

  useEffect(() => {
    const fetchFirstMeditationDate = async () => {
      const date = await getFirstMeditationDate();
      setFirstMeditationDate(date);
    };

    fetchFirstMeditationDate();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meditations = await getMeditations();

        const formattedData = meditations.map((item: Meditation) => ({
          date: new Date(item.date) || new Date(),
          moodBefore: item.moodBefore || 0,
          moodAfter: item.moodAfter || 0,
        }));

        setThisWeekAverages(getThisWeekAverages(formattedData));
        setThisMonthAverages(getThisMonthAverages(formattedData));
        setThisYearAverages(getThisYearAverages(formattedData));
        setAllTimeAverages(
          getAllTimeAverages(firstMeditationDate, formattedData)
        );

        const dateRange = await getDateRange(filterRange);
        const moodFig = await getMoodFigureTimeRange(
          dateRange[0],
          dateRange[1]
        );

        setMoodFigure(moodFig ? moodFig.toFixed(0) : 0);
      } catch (e) {
        console.error("Error fetching meditation data:", e);
      }
    };

    fetchData();
  }, [filterRange]);

  const renderFilterButton = ({ item }: { item: string }) => {
    return (
      <Pressable
        onPress={() => {
          handleFilterChange(item);
        }}
        className={`mx-1 px-2 py-1 rounded-full ${
          filterRange === item ? "bg-teal-500" : "bg-gray-200"
        }`}
      >
        <Text
          className={`text-xs ${
            filterRange === item ? "text-white" : "text-gray-900"
          }`}
        >
          {item}
        </Text>
      </Pressable>
    );
  };

  const renderChartLines = (marginBottom: number) => (
    <View>
      {[300, 400, 300, 400, 300].map((color, index) => (
        <View
          key={index}
          style={{
            backgroundColor: colors.gray[color],
            height: 0.5,
            marginBottom: index < 4 ? marginBottom : 0,
          }}
        />
      ))}
    </View>
  );

  const renderBar = ({ item }: { item: any }) => (
    <View
      style={{
        width: INCREMENT_WIDTH,
        height: INCREMENT_HEIGHT * 5,
        flexDirection: "column",
        justifyContent: "flex-end",
        marginRight: barMargin,
      }}
    >
      <View
        style={{
          height: INCREMENT_HEIGHT * item.avgMoodAfter,
          width: INCREMENT_WIDTH,
          backgroundColor: colors.green[300],
          borderRadius: filterRange === "This week" ? 10 : 3,
          marginBottom: 2,
          position: "absolute",
          zIndex: item.avgMoodAfter < item.avgMoodBefore ? 10 : 0,
        }}
      />
      <View
        style={{
          height: INCREMENT_HEIGHT * item.avgMoodBefore,
          width: INCREMENT_WIDTH,
          backgroundColor: colors.green[500],
          borderRadius: filterRange === "This week" ? 10 : 3,
          zIndex: item.avgMoodBefore < item.avgMoodAfter ? 10 : 0,
        }}
      />
    </View>
  );

  const renderTimeline = () => {
    if (filterRange === "This week") {
      return (
        <FlatList
          data={weekDays}
          renderItem={({ item }) => (
            <View
              style={{
                width: INCREMENT_WIDTH,
                marginRight: barMargin,
                alignItems: "center",
              }}
            >
              <Text className="text-gray-400">{item}</Text>
            </View>
          )}
          horizontal={true}
        />
      );
    } else if (filterRange === "This month") {
      return (
        <View className="flex-row">
          <Text className="left-0 text-gray-400">
            {new Date().toLocaleString("default", { month: "short" })}. 1
          </Text>
          <Text className="absolute right-0 text-gray-400">
            {new Date().toLocaleString("default", { month: "short" })}.{" "}
            {DAYS_IN_MONTHS[new Date().getMonth()]}
          </Text>
        </View>
      );
    } else if (filterRange === "This year") {
      return (
        <View className="flex-row relative">
          <Text className="left-0 text-gray-400">
            {new Date().toLocaleString("default", { month: "short" })}.{" "}
            {new Date().getFullYear() - 1}
          </Text>
          <Text className="absolute right-0 text-gray-400">
            {new Date().toLocaleString("default", { month: "short" })}.{" "}
            {new Date().getFullYear()}
          </Text>
        </View>
      );
    } else if (filterRange === "All time") {
      return (
        <View className="flex-row relative">
          <Text className="left-0 text-gray-400">
            {firstMeditationDate.toLocaleString("default", { month: "short" })}.{" "}
            {firstMeditationDate.getFullYear()}
          </Text>
          <Text className="absolute right-0 text-gray-400">Now</Text>
        </View>
      );
    }
  };

  const renderGraph = () => (
    <View>
      <View className="relative">
        <View>{renderChartLines(INCREMENT_HEIGHT)}</View>
        <View
          style={{ flexDirection: "row", justifyContent: "center" }}
          className="absolute"
        >
          <FlatList
            data={getCorrespondingData()}
            renderItem={renderBar}
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );

  const getCorrespondingData = () => {
    switch (filterRange) {
      case "This week":
        return thisWeekAverages;
      case "This month":
        return thisMonthAverages;
      case "This year":
        return thisYearAverages;
      case "All time":
        return allTimeAverages;
      default:
        return [];
    }
  };

  const getAverageText = () => {
    switch (filterRange) {
      case "This week":
      case "This month":
        return "Daily";
      case "This year":
      case "All time":
        return "Weekly";
      default:
        return "";
    }
  };

  return (
    <View className="bg-white shadow-2xl rounded-3xl p-5">
      <FlatList
        data={filters}
        renderItem={renderFilterButton}
        keyExtractor={(item) => item}
        horizontal
      />
      <View className="my-5">{renderGraph()}</View>
      <View className="mt-5 mb-3">{renderTimeline()}</View>
      <View>
        <View className="flex-row items-center pb-1">
          <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          <Text className="text-xs text-gray-400">
            {`${getAverageText()} average (Before meditation)`}
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-green-300 rounded-full mr-1" />
          <Text className="text-xs text-gray-400">
            {`${getAverageText()} average (After meditating)`}
          </Text>
        </View>
      </View>
      <View className="h-[0.5] bg-gray-400 my-4" />
      <View className="flex-row items-center">
        <Feather
          name={getMoodIcon(moodFigure)}
          size={30}
          color={getMoodIconColor(moodFigure)}
        />
        <Text className="text-gray-900 font-medium px-2 text-2xl">
          {moodFigure}%
        </Text>
      </View>
    </View>
  );
};

export default ChartAverage;
