//Stringify an object to avoid Next.js client component warning with decimals
export function stringify<T>(obj: T): T {
  if (typeof obj !== "object") {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

//Add an ellipsis to the end of a string if it's longer than 19 characters
export const formatLabelWithEllipsis = (label: string | undefined) =>
  label && label.length > 19 ? `${label.slice(0, 19)}...` : label;
