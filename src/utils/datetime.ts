import { format } from "date-fns/format";
import { isToday } from "date-fns/isToday";
import { isYesterday } from "date-fns/isYesterday";

/** "07:00 am" (12-hour, lowercase meridiem — matches the design mocks). */
export const formatClock12 = (date: Date): string => format(date, "hh:mm aaa");

/** "07:30" (24-hour, used on chart axes and tooltips). */
export const formatClock24 = (date: Date): string => format(date, "HH:mm");

/** "Jul 3" (chart axis label for multi-day ranges). */
export const formatShortDate = (date: Date): string => format(date, "MMM d");

/** "17/07" (readings table Date column). */
export const formatTableDate = (date: Date): string => format(date, "dd/MM");

/** "17 July 2025, 11:00 am" (note editor title). */
export const formatNoteTitle = (iso: string): string => {
  const date = new Date(iso);
  return `${format(date, "d MMMM yyyy")}, ${formatClock12(date)}`;
};

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
