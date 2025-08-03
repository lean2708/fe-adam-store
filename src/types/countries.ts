import { Locale } from "@/i18n/config";

interface Country {
  title: string;
  flag: string;
  word: string;
}

const recordCountries: Record<Locale, Country> = {
  en: {
    title: "English",
    flag: "en",
    word: "Hello",
  },
  vi: {
    title: "Vietnamese",
    flag: "vn",
    word: "Xin chào",
  }
};

export const countries: [Locale, Country][] = Object.entries(
  recordCountries
) as [Locale, Country][];
