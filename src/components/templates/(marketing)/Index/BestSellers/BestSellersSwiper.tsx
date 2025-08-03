'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { TProduct } from '@/types';
import ProductCardIndex from '@/components/modules/ProductCardIndex';
import { getAllProductsAction } from '@/actions/productActions';
import { ProductCardWithColorsSkeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function BestSellersSwiper() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Marketing');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch best-selling products (first 10 items, sorted by sold quantity)
        const response = await getAllProductsAction(0, 10, [
          'soldQuantity,desc',
        ]);

        if (response.status === 200 && response.products) {
          setProducts(response.products);
        }
      } catch (error) {
        console.error('Failed to fetch best-selling products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className='w-full'>
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
      </div>
    );
  }

  // Show empty state if no products
  if (!products.length) {
    return (
      <div className='w-full text-center py-8'>
        <p className='text-gray-500'>{t('bestSellers.noProducts')}</p>
      </div>
    );
  }

  return (
    <Carousel className='w-full'>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className='basis-1/2 md:basis-1/3 lg:basis-1/5'
          >
            <Link href={`product/${product.id}`}>
              <ProductCardIndex product={product} badgeText={t('bestSellers.badgeText')} />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
