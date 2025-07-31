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
import { CategorySkeleton, Skeleton } from '@/components/ui/skeleton';
import { TProduct } from '@/types';

export default function Gallery({ product }: { product: TProduct }) {
  //* Lưu instance của Carousel API để điều khiển carousel
  const [api, setApi] = useState<CarouselApi>();

  //* Lưu index của ảnh hiện tại đang được hiển thị trong carousel
  const [current, setCurrent] = useState(0);

  //* Mảng boolean, mỗi phần tử tương ứng với một ảnh, cho biết ảnh đó đã được load xong hay chưa
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  //* Trạng thái auto play, true nếu carousel đang tự động chuyển slide
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  //* Ref để đánh dấu đã preload ảnh hay chưa, tránh preload nhiều lần
  const preloadedRef = useRef(false);

  // Preload images only once
  useEffect(() => {
    if (preloadedRef.current) return;

    const loadedStates = new Array(product.images?.length).fill(false);
    setImagesLoaded(loadedStates);

    product.images?.forEach((imgObj, index) => {
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
      img.src = imgObj?.imageUrl || '';
    });

    preloadedRef.current = true;
  }, [product.images]);

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

  // Kiểm tra tất cả thumbnails đã load xong chưa
  const allThumbnailsLoaded = useMemo(
    () =>
      product.images &&
      imagesLoaded.length === product.images.length &&
      imagesLoaded.every(Boolean),
    [imagesLoaded, product.images]
  );

  return (
    <div className='flex gap-4'>
      {/* Thumbnail Images */}
      <div className='flex flex-col gap-2 min-w-[80px]'>
        {!allThumbnailsLoaded
          ? // Hiển thị skeleton placeholder cho toàn bộ thumbnails
            Array.from({ length: product.images?.length || 4 }).map(
              (_, idx) => (
                <Skeleton key={idx} className='w-20 h-20 mb-2 rounded' />
              )
            )
          : product.images?.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageSelect(index)}
                className={`w-20 h-20 bg-muted-foreground rounded overflow-hidden border-2 relative shadow-md hover:shadow-lg ${
                  current === index + 1
                    ? 'border-[#0e3bac] shadow-lg'
                    : 'border-transparent'
                } hover:border-[#0e3bac] transition-all duration-200`}
              >
                <Image
                  src={image?.imageUrl || '/placeholder.svg'}
                  alt={`Product view ${index + 1}`}
                  width={80}
                  height={80}
                  className='w-full h-full object-cover'
                  loading='lazy'
                  sizes='80px'
                  unoptimized
                />
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
            {product.images?.map((image, index) => (
              <CarouselItem key={index}>
                <div className='aspect-square bg-muted-foreground rounded-lg overflow-hidden relative'>
                  <Image
                    src={image?.imageUrl || '/placeholder.svg'}
                    alt={`${product.name} ${index + 1}`}
                    width={600}
                    height={600}
                    className='w-full h-full object-cover transition-opacity duration-300'
                    priority={index === 0}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
                    unoptimized
                  />

                  {/* Loading overlay */}
                  {!imagesLoaded[index] && <CategorySkeleton />}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
          <CarouselNext className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />

          {/* Image Indicators */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
            {product.images?.map((_, index) => (
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
