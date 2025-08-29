'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function HeroBanner() {
  const t = useTranslations('Marketing');
  const route = useRouter();

  return (
    <div className='relative rounded-lg overflow-hidden mb-12'>
      <div className='relative h-[400px] bg-gradient-to-r from-gray-100 to-gray-200'>
        <div className='absolute inset-0 adam-store-bg-dark bg-opacity-20'></div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white max-w-2xl px-4'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4'>
              {t('heroBanner.title')}
            </h2>
            <p className='text-lg md:text-xl mb-6 opacity-90'>
              {t('heroBanner.description')}
            </p>
            <Button
              onClick={() => route.push('/news')}
              className='bg-[#FFFFFFB2] duration-400 outline-none border-1 border-[#EEEDED80] text-black rounded-3xl hover:bg-[#fffffff5] px-8 py-4 text-base font-medium cursor-pointer'
            >
              {t('heroBanner.buyNow')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
