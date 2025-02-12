/**
 * File: /src/lib/utils.ts
 * Description: Utility functions for the application
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-10
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
