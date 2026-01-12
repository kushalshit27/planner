/**
 * Date utility functions using dayjs
 */

import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// Extend dayjs with plugins
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * Get start of week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
	return dayjs(date).startOf('isoWeek').toDate();
}

/**
 * Get end of week (Sunday) for a given date
 */
export function getWeekEnd(date: Date): Date {
	return dayjs(date).endOf('isoWeek').toDate();
}

/**
 * Get array of dates for the timeline view (2 weeks starting from Monday)
 */
export function getTimelineDates(date: Date): Date[] {
	const start = dayjs(date).startOf('isoWeek');
	return Array.from({ length: 14 }, (_, i) => start.add(i, 'day').toDate());
}

/**
 * Format date for display
 */
export function formatDate(
	date: Date,
	format: string = 'MMM DD, YYYY'
): string {
	return dayjs(date).format(format);
}

/**
 * Get day name (short)
 */
export function getDayName(date: Date, short: boolean = true): string {
	return dayjs(date).format(short ? 'ddd' : 'dddd');
}

/**
 * Get day of month
 */
export function getDayOfMonth(date: Date): number {
	return dayjs(date).date();
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
	return dayjs(date).isSame(dayjs(), 'day');
}

/**
 * Check if date is weekend
 */
export function isWeekend(date: Date): boolean {
	const day = dayjs(date).day();
	return day === 0 || day === 6;
}

/**
 * Get number of days between two dates
 */
export function getDaysDiff(start: Date, end: Date): number {
	return dayjs(end).diff(dayjs(start), 'day');
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
	return dayjs(date).add(days, 'day').toDate();
}

/**
 * Subtract days from a date
 */
export function subtractDays(date: Date, days: number): Date {
	return dayjs(date).subtract(days, 'day').toDate();
}

/**
 * Check if date is between two dates (inclusive)
 */
export function isBetween(date: Date, start: Date, end: Date): boolean {
	const d = dayjs(date);
	return (
		d.isSameOrAfter(dayjs(start), 'day') && d.isSameOrBefore(dayjs(end), 'day')
	);
}

/**
 * Get start of month
 */
export function getMonthStart(date: Date): Date {
	return dayjs(date).startOf('month').toDate();
}

/**
 * Get end of month
 */
export function getMonthEnd(date: Date): Date {
	return dayjs(date).endOf('month').toDate();
}

/**
 * Get dates for a month view (including padding)
 */
export function getMonthDates(date: Date): Date[] {
	const start = dayjs(date).startOf('month').startOf('isoWeek');
	const end = dayjs(date).endOf('month').endOf('isoWeek');
	const days = end.diff(start, 'day') + 1;

	return Array.from({ length: days }, (_, i) => start.add(i, 'day').toDate());
}
