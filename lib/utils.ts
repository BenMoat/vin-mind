import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a number as a currency
export const formatter = new Intl.NumberFormat("en-UK", {
  style: "currency",
  currency: "GBP",
});

// Calculate the difference between two dates
export function calculateTimeDifference(date1: Date, date2: Date) {
  const years = differenceInYears(date2, date1);

  // Adjust date1 by the calculated years
  const dateAfterYears = addYears(date1, years);
  const months = differenceInMonths(date2, dateAfterYears);

  // Adjust date1 again by the calculated months
  const dateAfterMonths = addMonths(dateAfterYears, months);
  const days = differenceInDays(date2, dateAfterMonths);

  return { years, months, days };
}

interface TimeDifference {
  years: number;
  months: number;
  days: number;
}

//Format the time difference as a string
export function formatTimeDifference(
  timeDifference: TimeDifference | null
): string {
  if (!timeDifference) {
    return "";
  }

  const yearsString =
    timeDifference.years === 1
      ? `${timeDifference.years} year`
      : timeDifference.years > 1
      ? `${timeDifference.years} years`
      : "";

  const monthsString =
    timeDifference.months === 1
      ? `${timeDifference.months} month`
      : timeDifference.months > 1
      ? `${timeDifference.months} months`
      : "";

  const daysString =
    timeDifference.days === 1
      ? `${timeDifference.days} day`
      : timeDifference.days > 1
      ? `${timeDifference.days} days`
      : "";

  return [yearsString, monthsString, daysString]
    .filter((part) => part)
    .join(" ");
}

//Add an ellipsis to the end of a string if it's longer than 19 characters
export const formatLabelWithEllipsis = (label: string | undefined) =>
  label && label.length > 19 ? `${label.slice(0, 19)}...` : label;

// Format a number as a mileage
export function formatMileage(x: string | number): string {
  // First, convert the input to a string if it's a number
  const str = typeof x === "number" ? x.toString() : x;

  // Remove any characters that aren't digits
  const numericOnly = str.replace(/[^\d]/g, "");

  // Format the string with commas
  return numericOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format a price using commas and a decimal point
export function formatCost(value: string): string {
  // Strip out any characters that aren't digits or a period
  let cleanValue = value.replace(/[^\d.]/g, "");

  // Check if there's a period in the input
  const hasDecimal = cleanValue.includes(".");

  // Split the input into integer and decimal parts
  let [integerPart, decimalPart] = cleanValue.split(".");

  // Format the integer part with commas
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Reassemble the formatted number
  if (hasDecimal) {
    // If there's a decimal part, include it, limiting to two digits
    return `${integerPart}.${decimalPart ? decimalPart.substring(0, 2) : ""}`;
  }

  return integerPart;
}
