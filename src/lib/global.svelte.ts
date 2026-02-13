export const bgGradient = `
  bg-gradient-to-b from-[#E0EAFC] to-white text-foreground dark:bg-gradient-to-br dark:from-gray-800 dark:to-black`;
export const selectItem = `hover:bg-gray-100 hover:shadow-md hover:scale-101 duration-300 transition-all ease-in-out dark:hover:bg-gray-900`;
export const toastmsg = `fixed right-4 bottom-20 lg:bottom-4 z-50
             flex items-center gap-3
             bg-green-600 text-white font-medium
             px-5 py-3 rounded-xl shadow-lg
             animate-slide-in`;
export const errormsg = `${toastmsg} !bg-red-600`;
export const searchableFields = [
	'name',
	'description',
	'permissions',
	'value',
	'firstName',
	'lastName',
	'phone',
	'date',
	'time',
	'bookedBy',
	'notes',
	'bookedAt',
	'customerName',
	'date',
	'time'
];

export type Item = {
	value: string | number;
	name: string;
};

export const dropdownClass = `flex capitalize flex-row gap-2 ${selectItem}`;

export const gender = [
	{ value: 'male', name: 'Male' },
	{ value: 'female', name: 'Female' }
];

export function minutesToHoursString(minutes: number) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${h}h ${m}m`;
}

import { encodeBase32LowerCase } from '@oslojs/encoding';
import { sql } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';
import { SvelteDate } from 'svelte/reactivity';

export function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

export function extractUsername(email: string) {
	if (typeof email !== 'string') {
		throw new Error('Input must be a string');
	}

	// Find the part before the '@'
	const atIndex = email.indexOf('@');

	if (atIndex === -1) {
		throw new Error("Invalid email address: missing '@'");
	}

	return email.substring(0, atIndex);
}

export function getCurrentMonthRange(): string {
	const today = new SvelteDate();

	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');

	const firstOfMonth = `${year}-${month}-01`;
	const todayStr = `${year}-${month}-${day}`;

	return `${firstOfMonth}-${todayStr}`;
}

export const currentMonthFilter = (dateField: MySqlColumn, start?: string, end?: string) => {
	// If start/end are passed, return BETWEEN condition
	if (start && end) {
		const endOfDay = new SvelteDate(end);
		endOfDay.setHours(23, 59, 59, 999);

		return sql`${dateField} BETWEEN ${start} AND ${endOfDay}`;
	}

	// Otherwise fallback to current-month logic
	const currentYear = new SvelteDate().getFullYear();
	const currentMonth = new SvelteDate().getMonth() + 1;

	return sql`
    EXTRACT(YEAR FROM ${dateField}) = ${currentYear}
    AND EXTRACT(MONTH FROM ${dateField}) = ${currentMonth}
  `;
};

export function isMobile() {
	if (typeof window === 'undefined') return false; // SSR guard
	return window.innerWidth <= 768;
}

import crypto from 'crypto';

export function generatePassword(
	length: number = 8,
	options = {
		lowercase: true,
		uppercase: true,
		numbers: true,
		symbols: true
	}
): string {
	const lowers = 'abcdefghijklmnopqrstuvwxyz';
	const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const nums = '0123456789';
	const syms = '!@#$%^&*()-_=+[]{};:,.<>/?';

	let chars = '';
	if (options.lowercase) chars += lowers;
	if (options.uppercase) chars += uppers;
	if (options.numbers) chars += nums;
	if (options.symbols) chars += syms;

	if (!chars) throw new Error('No character sets selected!');

	let password = '';
	const charArray = chars.split('');

	for (let i = 0; i < length; i++) {
		const randomIndex = crypto.randomInt(0, charArray.length);
		password += charArray[randomIndex];
	}

	return password;
}

export const formatEthiopianDate = (date: Date | null | undefined): string => {
	// 1. Handle null, undefined, or empty values immediately
	if (!date) return '';

	try {
		// 2. Check if the date is actually valid (prevents "Invalid Date" errors)
		if (isNaN(date.getTime())) {
			return 'No Date Provided';
		}

		const formatter = new Intl.DateTimeFormat('am-ET', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			calendar: 'ethiopic'
		});

		return formatter.format(date);
	} catch (error) {
		// 3. Catch-all for browser compatibility issues or unexpected inputs
		return 'Error Formatting Date';
	}
};
export const formatEthiopianYearMonth = (
	year: number | null | undefined,
	month: number | null | undefined // 1–13 (Ethiopia has 13 months!)
): string => {
	// 1. Basic validation: Ensure we have numbers
	if (year === null || year === undefined || month === null || month === undefined) {
		return '';
	}

	try {
		// Note: month - 1 because JS Date months are 0-indexed
		const date = new Date(year, month - 1, 1);

		if (isNaN(date.getTime())) return 'Invalid Date';

		const formatter = new Intl.DateTimeFormat('am-ET', {
			year: 'numeric',
			month: 'long',
			calendar: 'ethiopic'
		});

		return formatter.format(date);
	} catch (e) {
		return 'Formatting Error';
	}
};

export const formatEthiopianYear = (date: Date | null | undefined): string => {
	if (!date || isNaN(date.getTime())) return '';

	try {
		const formatter = new Intl.DateTimeFormat('am-ET', {
			year: 'numeric',
			calendar: 'ethiopic'
		});

		return formatter.format(date);
	} catch (e) {
		return '';
	}
};

export const getEthiopianYearInt = (date: Date | null | undefined): number | null => {
	if (!date || isNaN(date.getTime())) return null;

	try {
		const formatter = new Intl.DateTimeFormat('en-u-ca-ethiopic', {
			year: 'numeric'
		});

		// Formats to something like "2018 ERA1" or "2018"
		const formatted = formatter.format(date);

		// Extract only the digits
		const yearMatch = formatted.match(/\d+/);
		return yearMatch ? parseInt(yearMatch[0], 10) : null;
	} catch (e) {
		return null;
	}
};
export function formatETB(amount: number | null | undefined, useAmharic: boolean = false): string {
	// Handle null/undefined/NaN amount
	if (amount === null || amount === undefined || isNaN(amount)) {
		return useAmharic ? 'ብር 0.00' : 'ETB 0.00';
	}

	try {
		const locale = useAmharic ? 'am-ET' : 'en-ET';

		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: 'ETB',
			currencyDisplay: 'symbol',
			minimumFractionDigits: 2
		}).format(amount);
	} catch (e) {
		// Fallback if Intl fails
		return `${amount.toFixed(2)} ETB`;
	}
}
