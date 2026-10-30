export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatReference(ref: string): string {
  return ref;
}

export function truncate(text: string, len: number): string {
  if (text.length <= len) return text;
  return text.slice(0, len).trim() + "…";
}
