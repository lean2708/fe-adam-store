'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ProductResponse } from '@/api-client';

export default function Gallery({ product }: { product: ProductResponse }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const preloadedRef = useRef(false);

  // Danh sách URL ảnh, fallback nếu không có ảnh
  const imageUrls = useMemo(
    () =>
      product.images && product.images.length > 0
        ? product.images.map((img) => img.imageUrl)
        : [
            'https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300',
          ],
    [product.images]
  );

  // Preload images only once
  useEffect(() => {
    if (preloadedRef.current) return;

    const loadedStates = new Array(imageUrls.length).fill(false);
    setImagesLoaded(loadedStates);

    imageUrls.forEach((src, index) => {
      const img = new window.Image();
      img.onload = () => {
        setImagesLoaded((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
      img.onerror = () => {
        setImagesLoaded((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
      img.src = src || '';
    });

    preloadedRef.current = true;
  }, [imageUrls]);

  // Set up carousel API
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-play functionality
  useEffect(() => {
    if (!api || !isAutoPlaying) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api, isAutoPlaying]);

  const handleImageSelect = useCallback(
    (index: number) => {
      if (api) {
        api.scrollTo(index);
      }
    },
    [api]
  );

  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  return (
    <div className='flex gap-4'>
      {/* Thumbnail Images */}
      <div className='flex flex-col gap-2'>
        {imageUrls.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageSelect(index)}
            className={`w-20 h-20 bg-[#e8e8e8] rounded overflow-hidden border-2 relative shadow-md hover:shadow-lg ${
              current === index + 1
                ? 'border-[#0e3bac] shadow-lg'
                : 'border-transparent'
            } hover:border-[#0e3bac] transition-all duration-200`}
          >
            <Image
              src={image || '/placeholder.svg'}
              alt={`Product view ${index + 1}`}
              width={80}
              height={80}
              className='w-full h-full object-cover'
              loading='lazy'
              sizes='80px'
            />
            {!imagesLoaded[index] && (
              <div className='absolute inset-0 bg-[#e8e8e8] animate-pulse' />
            )}
          </button>
        ))}
      </div>

      {/* Main Image Carousel */}
      <div
        className='flex-1'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel setApi={setApi} className='w-full'>
          <CarouselContent>
            {imageUrls.map((image, index) => (
              <CarouselItem key={index}>
                <div className='aspect-square bg-[#e8e8e8] rounded-lg overflow-hidden relative'>
                  <Image
                    src={image || '/placeholder.svg'}
                    alt={`Slim-Fit Stretch-Cotton Poplin Fabric Overshirt - View ${
                      index + 1
                    }`}
                    width={600}
                    height={600}
                    className='w-full h-full object-cover transition-opacity duration-300'
                    priority={index === 0}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
                  />

                  {/* Loading overlay */}
                  {!imagesLoaded[index] && (
                    <div className='absolute inset-0 bg-[#e8e8e8] animate-pulse flex items-center justify-center'>
                      <div className='w-8 h-8 border-2 border-[#0e3bac] border-t-transparent rounded-full animate-spin' />
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
          <CarouselNext className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />

          {/* Image Indicators */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
            {imageUrls.map((_, index) => (
              <button
                key={index}
                onClick={() => handleImageSelect(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  current === index + 1 ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          {isAutoPlaying && (
            <div className='absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse' />
          )}
        </Carousel>
      </div>
    </div>
  );
}
