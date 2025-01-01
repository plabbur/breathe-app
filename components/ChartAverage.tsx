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
} from "@/storage";
import colors from "tailwindcss/colors";
import { Feather } from "@expo/vector-icons";
// import { FlatList } from "react-native-reanimated/lib/typescript/Animated";

const ChartAverage = () => {
  const [averages, setAverages] = useState([]);

  const [allTimeAverages, setAllTimeAverages] = useState([]);
  const [thisWeekAverages, setThisWeekAverages] = useState([]);
  const [thisMonthAverages, setThisMonthAverages] = useState([]);
  const [thisYearAverages, setThisYearAverages] = useState([]);

  const [moodFigure, setMoodFigure] = useState(0);

  const [filterRange, setFilterRange] = useState("This week");
  const filters = ["All time", "This year", "This month", "This week"];
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const DAYS_IN_MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const { width } = useWindowDimensions();
  const [barMargin, setBarMargin] = useState(10);
  const [numBars, setNumBars] = useState(7); // Week, to start
  const availableSpace = width - (numBars - 1) * barMargin - 80;
  const INCREMENT_HEIGHT = 30;
  const INCREMENT_WIDTH = availableSpace / numBars;

  const EXAMPLE_DATA = [
    { avgMoodBefore: 1, avgMoodAfter: 5 },
    { avgMoodBefore: 1, avgMoodAfter: 2 },
    { avgMoodBefore: 3, avgMoodAfter: 5 },
    { avgMoodBefore: 2, avgMoodAfter: 4 },
    { avgMoodBefore: 2, avgMoodAfter: 5 },
    { avgMoodBefore: 3, avgMoodAfter: 5 },
    { avgMoodBefore: 1, avgMoodAfter: 4 },
  ];

  const handleFilterChange = async (item: string) => {
    const getMoodFig = async (range: string) => {
      const moodFig = await getMoodFigureTimeRange(
        getDateRange(range)[0],
        getDateRange(range)[1]
      );

      return moodFig !== null ? moodFig : null;
    };

    const moodFigureThisWeek = await getMoodFig("This week");
    const moodFigureThisMonth = await getMoodFig("This month");
    const moodFigureThisYear = await getMoodFig("This year");
    const moodFigureAllTime = await getMoodFig("All time");

    if (item === "This week") {
      setNumBars(7);
      setBarMargin(10);
      setMoodFigure(moodFigureThisWeek?.toFixed(0));
    } else if (item === "This month") {
      const today = new Date();
      setNumBars(DAYS_IN_MONTHS[today.getMonth()]);
      setBarMargin(2);
      setMoodFigure(moodFigureThisMonth.toFixed(0));
    } else if (item === "This year") {
      setNumBars(52);
      setBarMargin(2); // Adjust margin as needed
      setMoodFigure(moodFigureThisYear.toFixed(0));
    } else if (item === "All time") {
      setNumBars(52);
      setBarMargin(2);
      setMoodFigure(moodFigureAllTime.toFixed(0));
    }

    setFilterRange(item);
  };

  const getDateRange = (toFilter) => {
    const today = new Date();

    switch (toFilter) {
      case "This week": {
        const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
        const startOfWeek = new Date(today);
        const endOfWeek = new Date(today);

        // Set start to Sunday (subtract the dayOfWeek)
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        // Set end to Saturday (add remaining days of the week)
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
        return [new Date(0, 0, 0), new Date()];
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meditations = await getMeditations();

        // Transform the array into the required object structure
        const formattedData = meditations.map((item, index) => ({
          //   id: String(index), // Use a string id for FlatList
          date: new Date(item.date) || "",
          moodBefore: item.moodBefore || 0,
          moodAfter: item.moodAfter || 0,
        }));

        setThisWeekAverages(getThisWeekAverages(formattedData));
        setThisMonthAverages(getThisMonthAverages(formattedData));
        setThisYearAverages(getThisYearAverages(formattedData));

        // setMoodFigure(
        //   getMoodFigureTimeRange(getDateRange()[0], getDateRange()[1])
        // );
      } catch (e) {
        console.error("Error fetching meditation data:", e);
      }
    };

    fetchData();
  }, []);

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

  const renderChartLines = (marginBottom: number) => {
    return (
      <View>
        <View
          style={{
            backgroundColor: colors.gray[300],
            height: 0.5,
            marginBottom: marginBottom,
          }}
        />
        <View
          style={{
            backgroundColor: colors.gray[400],
            height: 0.5,
            marginBottom: marginBottom,
          }}
        />
        <View
          style={{
            backgroundColor: colors.gray[300],
            height: 0.5,
            marginBottom: marginBottom,
          }}
        />
        <View
          style={{
            backgroundColor: colors.gray[400],
            height: 0.5,
            marginBottom: marginBottom,
          }}
        />
        <View
          style={{
            backgroundColor: colors.gray[300],
            height: 0.5,
            marginBottom: 0,
          }}
        />
      </View>
    );
  };

  const renderBar = ({ item }) => {
    return (
      <View
        style={{
          width: INCREMENT_WIDTH,
          height: INCREMENT_HEIGHT * 5, // Adjust this for maximum height
          flexDirection: "column",
          justifyContent: "flex-end",
          marginRight: barMargin,
        }}
      >
        <View
          style={{
            height: INCREMENT_HEIGHT * item.avgMoodAfter,
            width: INCREMENT_WIDTH, // Add spacing between bars
            backgroundColor: colors.green[300],
            borderRadius: 10,
            marginBottom: 2,
            position: "absolute",
          }}
        />

        <View
          style={{
            height: INCREMENT_HEIGHT * item.avgMoodBefore,
            width: INCREMENT_WIDTH,
            backgroundColor: colors.green[500],
            borderRadius: 10,
          }}
        />
      </View>
    );
  };

  const renderTimeline = () => {
    const commonStyles = {
      paddingTop: 10,
      paddingBottom: 10,
    };

    if (filterRange === "This week") {
      return (
        <FlatList
          data={weekDays}
          renderItem={({ item }) => (
            <View
              style={{
                ...commonStyles,
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
        <View className="flex-row relative" style={commonStyles}>
          <Text className="absolute left-0 text-gray-400">
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
        <View className="flex-row relative" style={commonStyles}>
          <Text className="absolute left-0 text-gray-400">Jan.</Text>
          <Text className="absolute right-0 text-gray-400">Dec.</Text>
        </View>
      );
    }
  };

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
    }
  };

  const renderGraph = () => {
    return (
      <View>
        <View class="relative">
          <View>{renderChartLines(INCREMENT_HEIGHT)}</View>
          <View
            style={{ flexDirection: "row", justifyContent: "center" }}
            className="absolute"
          >
            <FlatList
              data={getCorrespondingData()}
              renderItem={renderBar}
              horizontal={true}
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View className="mt-10">{renderTimeline()}</View>
      </View>
    );
  };

  const getAverageText = () => {
    switch (filterRange) {
      case "This week":
        return "Daily";
      case "This month":
        return "Daily";
      case "This year":
        return "Weekly";
      case "All time":
        return "Weekly";
    }
  };

  return (
    <ScrollView>
      <View className="bg-white shadow-2xl rounded-3xl p-5">
        <FlatList
          data={filters}
          renderItem={renderFilterButton}
          horizontal={true}
        />
        <View className="my-5">{renderGraph()}</View>
        <View>
          <View className="flex-row items-center pb-1">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            <Text className="text-xs text-gray-400">{`${getAverageText()} average (Before meditation)`}</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-300 rounded-full mr-1" />
            <Text className="text-xs text-gray-400">{`${getAverageText()} average (After meditating)`}</Text>
          </View>
        </View>
        <View className="h-[0.5] bg-gray-400 my-4" />
        <View className="flex-row items-center">
          <Feather name="arrow-up-circle" size={30} color={colors.green[500]} />
          <Text className="text-gray-900 font-medium px-2 text-2xl">
            {moodFigure}%
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ChartAverage;
