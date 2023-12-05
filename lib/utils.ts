import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-UK", {
  style: "currency",
  currency: "GBP",
});

export const formatLabelWithEllipsis = (label: string | undefined) =>
  label && label.length > 19 ? `${label.slice(0, 19)}...` : label;

export function formatMileage(x: string | number): string {
  // First, convert the input to a string if it's a number
  const str = typeof x === "number" ? x.toString() : x;

  // Remove any characters that aren't digits
  const numericOnly = str.replace(/[^\d]/g, "");

  // Format the string with commas
  return numericOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
