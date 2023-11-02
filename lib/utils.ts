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
