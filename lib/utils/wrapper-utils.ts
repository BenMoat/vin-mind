import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export * from "./currency-utils";
export * from "./date-utils";
export * from "./number-utils";
export * from "./string-utils";
