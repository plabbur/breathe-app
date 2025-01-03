import React, { createContext, useRef, useContext } from "react";

type CalendarContextType = {
  calendarRef: React.MutableRefObject<any> | null;
  handleScrollToDay: () => void;
};

const CalendarContext = createContext<CalendarContextType>({
  calendarRef: null,
  handleScrollToDay: () => {},
});

export const CalendarProvider = ({ children }: { children: any }) => {
  const calendarRef = useRef(null);

  const handleScrollToDay = () => {
    console.log("calendarRef in handleScrollToMonth:", calendarRef.current);
    if (calendarRef.current) {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const dateString = `${year}-${month}-1`;
      calendarRef.current.scrollToDay(dateString);
    } else {
      console.log("calendarRef is null");
    }
  };

  return (
    <CalendarContext.Provider
      value={{ calendarRef, handleScrollToDay: handleScrollToDay }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  return useContext(CalendarContext);
};
