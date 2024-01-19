//Stringify an object to avoid Next.js client component warning with decimals
export function stringify<T>(obj: T): T {
  if (typeof obj !== "object") {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}
