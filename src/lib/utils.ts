import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { ApiErrorResponse } from "@/api-client/models/api-error-response";
import { TProduct } from "@/types";
import { enAU, es, Locale, vi } from "react-day-picker/locale";
import { ORDER_STATUS } from '@/enums';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidColor(strColor: string) {
  // Line 13: Error: Unexpected var, use let or const instead. no-var
  // Changed 'var' to 'const' as 's' is not reassigned.
  const s = new Option().style;
  s.color = strColor;

  // 'isValid' is reassigned, so 'let' is appropriate here.
  let isValid: boolean = true;

  isValid = /^#([0-9a-f]{3}){1,2}$/i.test(strColor);

  if (isValid) {
    return true;
  }

  // return 'whitespace-nowrapfalse' if color wasn't assigned
  return s.color == strColor.toLowerCase();
}

// Line 28: Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
// Changed 'any[]' to 'T[]' and added a generic type 'T' to make it type-safe.
export function shuffleArray<T>(array: T[]): T[] { // Added return type T[]
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    // Line 34: Error: 'randomIndex' is never reassigned. Use 'const' instead. prefer-const
    // Changed 'let' to 'const' as 'randomIndex' is not reassigned within the loop iteration.
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  // FIX: This line was incorrect. It was returning the function itself, not the shuffled array.
  // It should return the 'array' which has been shuffled in place.
  return array;
}

export function checkSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Line 55: Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
// Changed 'any' to 'unknown' which is safer when dealing with unknown error types.
// Added more specific type guards for the `error as ApiErrorResponse` case.
export function extractErrorMessage(error: unknown, defaultMessage: string = 'Something went wrong.'): ApiErrorResponse {
  if (axios.isAxiosError(error) && error.response && typeof error.response.data === 'object' && error.response.data !== null) {
    const apiError = error.response.data as ApiErrorResponse;
    if (apiError.message) {
      return apiError; // Return the full API error object
    }
  } else if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    // This refined check ensures 'error' actually has 'code' and 'message' properties
    // before asserting it as ApiErrorResponse parts.
    const potentialApiError = error as { code?: number; message?: string };
    if (potentialApiError.message) { // Only return if message exists
      return { code: potentialApiError.code || 500, message: potentialApiError.message };
    }
  }
  // Fallback for unknown error types or if specific properties are missing
  return { code: 500, message: defaultMessage };
}

export function getAllImagesFromProduct(product: TProduct): string[] {
  const imageUrls: string[] = [];

  // Add the main image if it exists
  if (product.mainImage) {
    imageUrls.push(product.mainImage);
  }

  // Iterate through colors
  product.colors?.forEach(color => {
    // Iterate through variants within each color
    color.variants?.forEach(variant => {
      if (variant.imageUrl) {
        imageUrls.push(variant.imageUrl);
      }
    });
  });

  // Remove duplicates
  return Array.from(new Set(imageUrls));
}
export function formatCurrency(value: number, locale: string = 'vi'): string {
  if (locale === 'vi') {
    return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
  } else {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
}

export function formatDate(dateString: string | undefined, locale: string = 'vi', options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return "N/A";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formatOptions = options || defaultOptions;

  if (locale === 'vi') {
    return new Date(dateString).toLocaleDateString('vi-VN', formatOptions);
  } else {
    return new Date(dateString).toLocaleDateString('en-US', formatOptions);
  }
}

export function getReactDayPickerLocale(locale: string = 'vi'): Locale {
  console.log(locale);

  if (locale === 'vi') {
    return vi;
  } else {
    return enAU;
  }
}

/**
 * Get status color classes for different status types
 * @param status - The status string
 * @param type - The type of status (general, order, payment)
 * @returns Tailwind CSS classes for the status
 */
export const getStatusColor = (status: string, type: 'general' | 'order' | 'payment' = 'general') => {
  console.log(status);

  switch (type) {
    case 'order':
      switch (status) {
        case ORDER_STATUS.DELIVERED:
          return 'whitespace-nowrap bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100';
        case ORDER_STATUS.PROCESSING:
          return 'whitespace-nowrap bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100';
        case ORDER_STATUS.SHIPPED:
          return 'whitespace-nowrap bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-100';
        case ORDER_STATUS.PENDING:
          return 'whitespace-nowrap bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-100';
        case ORDER_STATUS.CANCELED:
          return 'whitespace-nowrap bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-100';
        default:
          return 'whitespace-nowrap bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-100';
      }


    case 'payment':
      switch (status) {
        case 'PAID':
          return 'whitespace-nowrap bg-green-100 text-green-800 hover:bg-green-100';
        case 'PENDING':
          return 'whitespace-nowrap bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        case 'REFUNDED':
          return 'whitespace-nowrap bg-purple-100 text-purple-800 hover:bg-purple-100';
        case 'CANCELED':
          return 'whitespace-nowrap bg-red-100 text-red-800 hover:bg-red-100';
        case 'FAILED':
          return 'whitespace-nowrap bg-orange-100 text-orange-800 hover:bg-orange-100';
        default:
          return 'whitespace-nowrap bg-gray-100 text-gray-800 hover:bg-gray-100';
      }

    case 'general':
    default:
      switch (status) {
        case 'ACTIVE':
          return 'whitespace-nowrap bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'INACTIVE':
          return 'whitespace-nowrap bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
          return 'whitespace-nowrap bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      }
  }
};
