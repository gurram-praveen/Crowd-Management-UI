import { createContext, useContext, useState, useEffect } from 'react';

const DateRangeContext = createContext(null);

export const useDateRange = () => {
  const ctx = useContext(DateRangeContext);
  if (!ctx) {
    throw new Error('useDateRange must be used within DateRangeProvider');
  }
  return ctx;
};

export const DateRangeProvider = ({ children }) => {
  // const getTodayRange = () => {
  //   const start = new Date();
  //   start.setHours(0, 0, 0, 0);

  //   return {
  //     selectedDate: start,
  //     fromUtc: start.getTime(),
  //     toUtc: Date.now()
  //   };
  // };

const DUBAI_OFFSET_MINUTES = 4 * 60; // UTC+4
const DAY_MS = 24 * 60 * 60 * 1000;

const getDubaiDayRange = (date = new Date()) => {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  const fromUtc =
    Date.UTC(y, m, d, 0, 0, 0) - DUBAI_OFFSET_MINUTES * 60 * 1000;

  const endOfDayUtc = fromUtc + DAY_MS - 1;

  const now = Date.now();
  const toUtc = Math.min(endOfDayUtc, now); // today vs past day

  return {
    selectedDate: new Date(y, m, d),
    fromUtc,
    toUtc
  };
};



  const [state, setState] = useState( () => getDubaiDayRange());

const setDay = (dateInput) => {
  let date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    const [y, m, d] = dateInput.split('-').map(Number);
    date = new Date(y, m - 1, d);
  }

  setState(getDubaiDayRange(date));
};




  // 🔒 SAFETY NET: never allow epoch 0
  // useEffect(() => {
  //   if (!state.fromUtc || !state.toUtc) {
  //     setState(getTodayRange());
  //   }
  // }, [state.fromUtc, state.toUtc]);

  return (
    <DateRangeContext.Provider
      value={{
        selectedDate: state.selectedDate,
        fromUtc: state.fromUtc,
        toUtc: state.toUtc,
        setDay
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
};
