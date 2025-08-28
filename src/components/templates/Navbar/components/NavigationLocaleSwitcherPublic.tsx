"use client";

import { useCallback, useMemo } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { countries } from "@/types/countries";
import { Globe } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";

// Type for a flag component (SVG React component)
type FlagComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
// Cast the imported module to a record of flag components
const FlagsMap = Flags as unknown as Record<string, FlagComponent>;

const NavigationLocaleSwitcherPublic = () => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const switchLocale = useCallback(() => {
    const currentIndex = countries.findIndex(([loc]) => loc === locale);
    const nextIndex = (currentIndex + 1) % countries.length;
    const nextLocale = countries[nextIndex][0];
    router.push(pathname, { locale: nextLocale });
  }, [locale, pathname, router]);

  // Find current country config
  const currentCountry = useMemo(
    () => countries.find(([loc]) => loc === locale)?.[1],
    [locale]
  );

  // Pick correct flag component
  const FlagIcon = useMemo<FlagComponent | null>(() => {
    const code = currentCountry?.flag?.toUpperCase();
    if (!code) return null;
    return FlagsMap[code] ?? null;
  }, [currentCountry]);

  return (
    <button
      onClick={switchLocale}
      aria-label="Switch language"
      title="Switch to another language"
      className="inline-flex items-center p-2 rounded-md hover:bg-muted/60 transition"
    >
      {FlagIcon ? (
        <FlagIcon className="w-6 h-4 rounded-sm" />
      ) : (
        <Globe className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );
};

export default NavigationLocaleSwitcherPublic;
