//Stringify an object to avoid Next.js client component warning with decimals
export function stringify<T>(obj: T): T {
  if (typeof obj !== "object") {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

//Check if the two registraion numbers are equal, ignoring whitespace and casing
export function areStringsEqual(value1: string, value2: string | null) {
  if (value1 && value2) {
    const sanitizedValue1 = value1.replace(/\s/g, "").toUpperCase();
    const sanitizedValue2 = value2.replace(/\s/g, "").toUpperCase();
    return sanitizedValue1 === sanitizedValue2;
  }
  return false;
}
