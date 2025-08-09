import {
  Noto_Sans,
  Roboto,
  Geist,
  Geist_Mono,
  Manrope,
} from 'next/font/google';

export const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

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
