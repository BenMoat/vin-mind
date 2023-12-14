import { addThousandsSeparators } from "./wrapper-utils";

// Format a number as a currency
export const formatCurrency = new Intl.NumberFormat("en-UK", {
  style: "currency",
  currency: "GBP",
});

// Format a price using commas and a decimal point and return it as a string
export const formatFormCurrency = (value: string): string => {
  // Strip out any characters that aren't digits or a decimal
  let cleanValue = value.replace(/[^\d.]/g, "");

  // Check if there's a decimal in the input
  const hasDecimal = cleanValue.includes(".");

  // Split the input into integer and decimal parts
  let [integerPart, decimalPart] = cleanValue.split(".");

  integerPart = addThousandsSeparators(integerPart);

  // Reassemble the formatted number
  let formattedNumber = integerPart;
  if (hasDecimal) {
    // If there's a decimal part, include it, limiting to two digits
    formattedNumber += `.${decimalPart ? decimalPart.substring(0, 2) : ""}`;
  }

  return `£${formattedNumber}`;
};
