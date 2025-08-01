import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { ApiErrorResponse } from "@/api-client/models/api-error-response";
import { TProduct } from "@/types";


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

  // return 'false' if color wasn't assigned
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
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
}
