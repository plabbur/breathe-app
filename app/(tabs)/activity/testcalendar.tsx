import React, { useRef } from "react";
import { SafeAreaView, Button } from "react-native";
import { CalendarList } from "react-native-calendars";

const TestCalendar = () => {
  const calendarRef = useRef(null);

  const handleScrollToMonth = () => {
    if (calendarRef.current) {
      calendarRef.current.scrollToMonth("2024-05-01");
    } else {
      console.log("Ref is null!");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarList
        ref={calendarRef} // Pass the ref
        pastScrollRange={50}
        futureScrollRange={50}
        onDayPress={(day) => console.log("Day pressed:", day.dateString)}
      />
      <Button title="Scroll to May 2024" onPress={handleScrollToMonth} />
    </SafeAreaView>
  );
};

export default TestCalendar;
