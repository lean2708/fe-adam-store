import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CarouselApi } from '@/components/ui/carousel';
import { ImageBasic } from '@/api-client';

export default function useGallery(images: ImageBasic[]) {
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

  // TODO: Preload images only once
  useEffect(() => {
    if (preloadedRef.current || !images.length) return;

    const loadedStates = new Array(images.length).fill(false);
    setImagesLoaded(loadedStates);

    images.forEach((imgObj, index) => {
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
  }, [images]);

  // TODO: Set up carousel API
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  // TODO: Auto-play functionality
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
    (index: number) => api?.scrollTo(index),
    [api]
  );

  const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), []);
  const handleMouseLeave = useCallback(() => setIsAutoPlaying(true), []);

  // TODO: Check all thumbnails have been loaded or not
  const allThumbnailsLoaded = useMemo(
    () => imagesLoaded.length === images.length && imagesLoaded.every(Boolean),
    [imagesLoaded, images]
  );

  return {
    api,
    current,
    imagesLoaded,
    isAutoPlaying,
    allThumbnailsLoaded,
    setApi,
    handleImageSelect,
    handleMouseEnter,
    handleMouseLeave,
  };
}
