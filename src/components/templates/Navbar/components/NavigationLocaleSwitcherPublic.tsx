'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { countries } from '@/types/countries';
import { Globe } from 'lucide-react';

// Type cho một component cờ (SVG React component)
type FlagComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const NavigationLocaleSwitcherPublic = () => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // State để lưu trữ component cờ đã được tải động
  const [FlagIcon, setFlagIcon] = useState<FlagComponent | null>(null);

  const switchLocale = useCallback(() => {
    const currentIndex = countries.findIndex(([loc]) => loc === locale);
    const nextIndex = (currentIndex + 1) % countries.length;
    const nextLocale = countries[nextIndex][0];
    router.push(pathname, { locale: nextLocale });
  }, [locale, pathname, router]);

  // Tìm cấu hình của quốc gia hiện tại
  const currentCountry = useMemo(
    () => countries.find(([loc]) => loc === locale)?.[1],
    [locale]
  );

  // Sử dụng useEffect để tải động component cờ khi locale thay đổi
  useEffect(() => {
    const code = currentCountry?.flag?.toUpperCase();

    // Nếu không có mã cờ, reset state và không làm gì cả
    if (!code) {
      setFlagIcon(null);
      return;
    }

    let isMounted = true; // Cờ để tránh cập nhật state trên component đã unmount

    // Bắt đầu quá trình import động
    import('country-flag-icons/react/3x2')
      .then((flagsModule) => {
        if (isMounted) {
          // Ép kiểu module thành một Record các component cờ
          const FlagsMap = flagsModule as unknown as Record<
            string,
            FlagComponent
          >;
          // Tìm component cờ tương ứng với mã
          const LoadedFlag = FlagsMap[code] ?? null;
          // Cập nhật state với component đã tìm thấy
          setFlagIcon(() => LoadedFlag);
        }
      })
      .catch(console.error); // Xử lý lỗi nếu có

    return () => {
      isMounted = false;
    };
  }, [currentCountry]);

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
