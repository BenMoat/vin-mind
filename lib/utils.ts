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
export const formatCurrency = new Intl.NumberFormat("en-UK", {
  style: "currency",
  currency: "GBP",
});

// Calculate the difference between two dates and return it as a string
export function calculateAndFormatTimeDifference(
  date1: Date,
  date2: Date
): string {
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
export function formatFormCurrency(value: string): string {
  // Strip out any characters that aren't digits or a fullstop
  let cleanValue = value.replace(/[^\d.]/g, "");

  // Check if there's a fullstop in the input
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
