import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
} from "date-fns";

// Calculate the difference between two dates and return it as a string
export const calculateAndFormatTimeDifference = (
  date1: Date,
  date2: Date
): string => {
  const years = differenceInYears(date2, date1);
  const dateAfterYears = addYears(date1, years);

  const months = differenceInMonths(date2, dateAfterYears);
  const dateAfterMonths = addMonths(dateAfterYears, months);

  const days = differenceInDays(date2, dateAfterMonths);

  const yearsString =
    years === 1 ? `${years} year` : years > 1 ? `${years} years` : "";
  const monthsString =
    months === 1 ? `${months} month` : months > 1 ? `${months} months` : "";
  const daysString =
    days === 1 ? `${days} day` : days > 1 ? `${days} days` : "";

  return [yearsString, monthsString, daysString]
    .filter((part) => part)
    .join(" ");
};
