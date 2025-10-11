'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CategorySkeleton } from '@/components/ui/skeleton';
import { TProduct } from '@/types';
import useGallery from '@/hooks/(product_details)/useGallery';
import GalleryThumbnails from './(Gallery)/GalleryThumbnails';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

export default function Gallery({ product }: { product: TProduct }) {
  const images = product.images || [];
  const {
    current,
    imagesLoaded,
    isAutoPlaying,
    allThumbnailsLoaded,
    setApi,
    handleImageSelect,
    handleMouseEnter,
    handleMouseLeave,
  } = useGallery(images);

  return (
    <div className='flex flex-col-reverse sm:flex-row gap-4'>
      {/* Thumbnail Images */}
      <GalleryThumbnails
        images={images}
        current={current}
        allLoaded={allThumbnailsLoaded}
        onSelect={handleImageSelect}
      />

      {/* Main Image Carousel */}
      <div
        className='flex-1 w-full sm:w-auto'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel setApi={setApi} className='w-full h-fit'>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className=' bg-muted-foreground rounded-lg overflow-hidden relative md:h-[580px]'>
                  <AspectRatio ratio={3 / 4} className='w-full md:h-full'>
                    <Image
                      src={
                        image?.imageUrl ||
                        'https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg'
                      }
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className='object-cover transition-opacity duration-300'
                      priority={index === 0}
                      sizes='(min-width: 1360px) 504px,
         (min-width: 1040px) calc(40vw - 32px),
         (min-width: 640px) calc(100vw - 128px),
         (min-width: 380px) calc(100vw - 32px),
         calc(28.33vw + 226px)'
                    />

                    {!imagesLoaded[index] && <CategorySkeleton />}
                  </AspectRatio>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
          <CarouselNext className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />

          {/* Image Indicators */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
            {images.map((_, index) => (
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
