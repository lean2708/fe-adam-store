'use client';

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { countries } from '@/types/countries';
import { Globe } from 'lucide-react';

// Import trực tiếp hai cờ cần dùng
import VN from 'country-flag-icons/react/3x2/VN';
import GB from 'country-flag-icons/react/3x2/GB';

const flagMap: Record<string, any> = {
  vi: VN,
  en: GB,
};

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

  const FlagIcon = flagMap[locale];

  return (
    <button
      onClick={switchLocale}
      aria-label='Switch language'
      title='Switch to another language'
      className='inline-flex items-center p-2 rounded-md hover:bg-muted/60 transition'
    >
      {FlagIcon ? (
        <FlagIcon className='w-6 h-4 rounded-sm' />
      ) : (
        <Globe className='w-5 h-5 text-gray-500' />
      )}
    </button>
  );
};

export default NavigationLocaleSwitcherPublic;
