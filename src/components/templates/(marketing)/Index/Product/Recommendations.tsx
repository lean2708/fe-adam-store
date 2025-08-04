'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCardIndex from '@/components/modules/ProductCardIndex';
import { ProductCardWithColorsSkeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import useRecommendations from '@/hooks/(product_details)/useRecommendations';

export default function Recommendations() {
  const { products, loading } = useRecommendations();

  return (
    <div className='space-y-6'>
      {loading ? (
        <Carousel className='w-full'>
          <CarouselContent>
            {[...Array(5)].map((_, index) => (
              <CarouselItem
                key={index}
                className='basis-1/2 md:basis-1/3 lg:basis-1/5'
              >
                <ProductCardWithColorsSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : products.length === 0 ? (
        <div className='w-full text-center py-8'>
          <p className='text-gray-500'>Không có sản phẩm bán chạy nào.</p>
        </div>
      ) : (
        <Carousel className='w-full'>
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className='basis-1/2 md:basis-1/3 lg:basis-1/5'
              >
                <Link href={`${product.id}`}>
                  <ProductCardIndex product={product} badgeText='Bán Chạy' />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
}
