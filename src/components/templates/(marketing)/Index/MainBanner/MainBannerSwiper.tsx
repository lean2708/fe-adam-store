'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@/components/ui/carousel';
import Image from 'next/image';

type HeroSlide = {
  src: string;
  alt: string;
  // add other properties if needed
};

export default function MainBannerSwiper({
  heroSlides,
}: {
  heroSlides: HeroSlide[];
}) {
  return (
    <Carousel className='w-full'>
      <CarouselContent>
        {heroSlides.map((slide, idx) => (
          <CarouselItem key={idx}>
            <div className='relative w-full h-[400px] md:h-[500px] lg:h-[600px]'>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes='(min-width: 1580px) 100vw, (min-width: 1040px) calc(15.58vw + 1317px), (min-width: 780px) 1236px, 995px'
                className='w-full h-full object-cover'
                priority={idx === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPagination />
    </Carousel>
  );
}
