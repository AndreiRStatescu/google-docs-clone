import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(timestamp: number): string {
  return format(new Date(timestamp), "MMM dd, yyyy HH:mm");
}

export function generateColorFromName(name: string): string {
  const nameToNumber = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `hsl(${Math.abs(nameToNumber) % 360}, 80%, 60%)`;
}
