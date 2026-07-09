import { format } from "date-fns/format";
import { isToday } from "date-fns/isToday";
import { isYesterday } from "date-fns/isYesterday";

/** "07:00 am" (12-hour, lowercase meridiem — matches the design mocks). */
export const formatClock12 = (date: Date): string => format(date, "hh:mm aaa");

/** "07:30" (24-hour, used on chart axes and tooltips). */
export const formatClock24 = (date: Date): string => format(date, "HH:mm");

/** "Jul 3" (chart axis label for multi-day ranges). */
export const formatShortDate = (date: Date): string => format(date, "MMM d");

/** "Today 07:00 am" / "Yesterday 09:00 pm" / "Jul 3 09:00 am". */
export const formatReadingTimestamp = (iso: string): string => {
  const date = new Date(iso);
  const day = isToday(date)
    ? "Today"
    : isYesterday(date)
      ? "Yesterday"
      : formatShortDate(date);
  return `${day} ${formatClock12(date)}`;
};
