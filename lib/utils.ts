import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Serialize a Mongoose lean document (converts ObjectId / Date to strings) */
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
