export default function generateSlug(name: string): string {
  return name
    .toLowerCase() // Convert to lower case
    .trim() // Remove leading and trailing whitespace
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}
