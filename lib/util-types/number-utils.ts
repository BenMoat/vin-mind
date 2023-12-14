//RegEx for thousands separator
export const addThousandsSeparators = (input: string): string =>
  input.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Compare two numbers and return the difference with thousands separators
export const compareMileage = (x: number, y: number): string => {
  const difference = x - y;

  return addThousandsSeparators(difference.toString());
};

// Format mileage with thousands separators
export const formatMileage = (x: string | number): string => {
  // First, convert the input to a string if it's a number
  const str = typeof x === "number" ? x.toString() : x;

  // Remove any characters that aren't digits
  const numericOnly = str.replace(/[^\d]/g, "");

  return addThousandsSeparators(numericOnly);
};
