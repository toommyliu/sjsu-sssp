import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to combine Tailwind CSS classes with proper precedence
 *
 * @param inputs - Array of class values to be merged
 * @returns Merged className string with proper Tailwind CSS specificity
 *
 * @example
 * ```ts
 * cn('px-2 py-1', 'bg-blue-500', conditional && 'text-white')
 * // Returns: "px-2 py-1 bg-blue-500 text-white"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
