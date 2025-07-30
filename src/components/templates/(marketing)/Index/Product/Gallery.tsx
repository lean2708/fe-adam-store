'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { ProductResponse } from '@/api-client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Gallery component hiển thị carousel ảnh sản phẩm với auto-play và preload ảnh.
 */
export default function Gallery({ product }: { product: ProductResponse }) {
  // Index của ảnh đang được chọn
  const [selectedIdx, setSelectedIdx] = useState(0);
  // Trạng thái auto-play
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

  // Preload tất cả ảnh khi mount hoặc khi imageUrls thay đổi
  useEffect(() => {
    imageUrls.forEach((src) => {
      const img = new window.Image();
      img.src = src || '';
    });
  }, [imageUrls]);

  // Auto-play chuyển ảnh sau mỗi 5s nếu đang bật auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setSelectedIdx((prev) => (prev + 1) % imageUrls.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageUrls.length, isAutoPlaying]);

  const handlePrev = useCallback(() => {
    setSelectedIdx((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  }, [imageUrls.length]);

  const handleNext = useCallback(() => {
    setSelectedIdx((prev) => (prev + 1) % imageUrls.length);
  }, [imageUrls.length]);

  const handlePause = useCallback(() => setIsAutoPlaying(false), []);

  const handleResume = useCallback(() => setIsAutoPlaying(true), []);

  return (
    <div className='flex gap-4'>
      {/* Thumbnails bên trái */}
      <div className='flex flex-col gap-2'>
        {imageUrls.map((url, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`w-20 h-20 bg-[#e8e8e8] rounded overflow-hidden border-2 relative shadow-md hover:shadow-lg ${
              selectedIdx === idx
                ? 'border-primary shadow-lg'
                : 'border-transparent'
            } hover:border-primary transition-all duration-200`}
            aria-label={`Chọn ảnh ${idx + 1}`}
            type='button'
          >
            <Image
              src={
                url ||
                'https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300'
              }
              alt={`Ảnh sản phẩm ${idx + 1}`}
              width={80}
              height={80}
              className={`w-full h-full object-cover ${
                selectedIdx === idx
                  ? ' transform scale-125 ease-out duration-75 '
                  : ''
              }`}
              draggable={false}
            />
          </button>
        ))}
      </div>

      {/* Ảnh chính */}
      <div
        className='flex-1 relative group'
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        <div className='aspect-square h-fit bg-background rounded-lg overflow-hidden'>
          <AspectRatio ratio={1 / 2} className='h-fit w-full'>
            <Image
              src={
                imageUrls[selectedIdx] ||
                'https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300'
              }
              alt={`Ảnh sản phẩm chính`}
              width={600}
              height={600}
              priority={selectedIdx === 0}
              className='w-full h-full object-cover transition-opacity duration-300'
              draggable={false}
            />
          </AspectRatio>
        </div>

        {/* Nút chuyển ảnh trước */}
        <button
          onClick={handlePrev}
          className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'
          aria-label='Ảnh trước'
          type='button'
        >
          <ChevronLeft className='w-5 h-5 text-primary' />
        </button>

        {/* Nút chuyển ảnh tiếp */}
        <button
          onClick={handleNext}
          className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'
          aria-label='Ảnh tiếp'
          type='button'
        >
          <ChevronRight className='w-5 h-5 text-primary' />
        </button>

        {/* Chỉ số ảnh */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {imageUrls.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                selectedIdx === idx ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Chuyển đến ảnh ${idx + 1}`}
              type='button'
            />
          ))}
        </div>

        {/* Hiển thị trạng thái auto-play */}
        {isAutoPlaying && (
          <div className='absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse' />
        )}
      </div>
    </div>
  );
}
