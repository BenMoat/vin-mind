import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export * from "./util-types/currency-utils";
export * from "./util-types/date-utils";
export * from "./util-types/number-utils";
export * from "./util-types/string-utils";
