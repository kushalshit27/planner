/**
 * Utility to merge Tailwind classes with clsx
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes, handling conflicts properly
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
