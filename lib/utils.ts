import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Serialize a Mongoose lean document (converts ObjectId / Date to strings) */
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

const TRAILING_YEAR = /\s*\(\d{4}\)\s*$/;

/** Strip a trailing "(YYYY)" from a title so the year is never shown twice. */
export function cleanTitle(title: string): string {
  return title.replace(TRAILING_YEAR, '').trim();
}

/**
 * Produce a canonical "Title (Year)" string. If the title already ends with a
 * year in parentheses, it is returned untouched (no duplicate year appended).
 */
export function titleWithYear(title: string, year?: string | number | null): string {
  const base = title.trim();
  if (TRAILING_YEAR.test(base)) return base;
  return year ? `${base} (${year})` : base;
}
