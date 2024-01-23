export default function generateSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}
