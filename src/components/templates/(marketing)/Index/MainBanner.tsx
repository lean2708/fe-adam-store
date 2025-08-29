'use client';

import { Button } from '@/components/ui/button';
import MainBannerSwiper from './MainBanner/MainBannerSwiper';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import { useChatWidgetStore } from '@/stores/chatWidgetStore';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle } from 'lucide-react';

// List of banner image filenames in public/imgs/banner
const bannerImages = [
  'banner1.jpg',
  'banner2.jpg',
  'banner3.jpg',
  // Add more filenames as needed
];

const heroSlides = bannerImages.map((filename, idx) => ({
  src: `/imgs/banner/${filename}`,
  alt: `Banner ${idx + 1}`,
}));

export default function MainBanner() {
  const t = useTranslations('Languages');
  const { isAuthenticated } = useAuth();
  const { openWidget } = useChatWidgetStore();

  const handleChatClick = () => {
    if (isAuthenticated) {
      openWidget();
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  };

  return (
    <section className=''>
      {/* Hero Carousel - Embla carousel */}
      <div
        className='relative pb-16  adam-store-bg-light overflow-hidden w-full'
        style={{ minHeight: 400 }}
      >
        <MainBannerSwiper heroSlides={heroSlides} />
      </div>
      {/* <div className="py-8 px-8" ref={buttonRef}>
          <div className="flex justify-end">
            <Button
              onClick={handleChatClick}
              className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 shadow-lg"
            >
              {t("chatwithus")}
            </Button>
          </div>
        </div> */}

      {/* Sticky button that appears after scrolling past original */}
      <Button
        onClick={handleChatClick}
        className='fixed bottom-6 right-6 z-50 group
          bg-gradient-to-r from-gray-600 to-gray-700 
          hover:from-gray-700 hover:to-gray-800 
          text-white rounded-full px-6 py-4 
          shadow-xl hover:shadow-2xl
          transform transition-all  ease-out
          hover:scale-105 hover:-translate-y-1
          animate-in slide-in-from-bottom-8 fade-in duration-500
          border border-blue-500/20
          backdrop-blur-sm
          flex items-center gap-3
          min-w-[140px] justify-center
          active:scale-95 active:shadow-lg
          before:absolute before:inset-0 before:rounded-full 
          before:bg-white/10 before:opacity-0 before:transition-opacity 
          hover:before:opacity-100'
      >
        <MessageCircle className='h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110' />
        <span className='font-medium text-sm tracking-wide'>
          {t('chatwithus')}
        </span>

        <div className='absolute inset-0 rounded-full border-2 border-gray-400/50 animate-ping opacity-75'></div>
        <div className='absolute inset-0 rounded-full border border-gray-300/30 animate-pulse'></div>
      </Button>
    </section>
  );
}
