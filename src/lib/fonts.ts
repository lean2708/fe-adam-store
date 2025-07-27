import { Geist, Geist_Mono } from 'next/font/google';

// Configure Geist Sans font with optimized settings
export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

// Configure Geist Mono font with optimized settings
export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

// Combined font variables for easy usage
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`;

// Font utility classes for consistent usage
export const fontClasses = {
  sans: 'font-sans',
  mono: 'font-mono',
  // Weight utilities
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
} as const;

// Type for font weight keys
export type FontWeight = keyof typeof fontClasses;
