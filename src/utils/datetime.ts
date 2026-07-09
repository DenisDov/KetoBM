const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "07:00 am" (12-hour, lowercase meridiem — matches the design mocks). */
export const formatClock12 = (date: Date): string => {
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const meridiem = date.getHours() < 12 ? "am" : "pm";
  return `${String(hours).padStart(2, "0")}:${minutes} ${meridiem}`;
};

/** "07:30" (24-hour, used on chart axes and tooltips). */
export const formatClock24 = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "Today 07:00 am" / "Yesterday 09:00 pm" / "Jul 3 09:00 am". */
export const formatReadingTimestamp = (iso: string): string => {
  const date = new Date(iso);
  const dayDiff = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000,
  );

  const day =
    dayDiff === 0
      ? "Today"
      : dayDiff === 1
        ? "Yesterday"
        : `${MONTHS[date.getMonth()]} ${date.getDate()}`;
  return `${day} ${formatClock12(date)}`;
};

/** "Jul 3" (chart axis label for multi-day ranges). */
export const formatShortDate = (date: Date): string =>
  `${MONTHS[date.getMonth()]} ${date.getDate()}`;
