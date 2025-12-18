export const getDayRangeUtc = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const isToday =
    start.toDateString() === new Date().toDateString();

  const end = isToday
    ? new Date() // now
    : new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1); // 23:59:59.999

  return {
    fromUtc: start.getTime(),
    toUtc: end.getTime()
  };
};
