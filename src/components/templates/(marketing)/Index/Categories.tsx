'use client';

import { TCategory } from '@/types';
import CategoryItem from './Category/CategoryItem';
import { getAllCategoriesAction } from '@/actions/categoryActions';
import { CategorySkeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Categories() {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Marketing');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategoriesAction();

        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <Carousel className='w-full py-4 relative px-4 mt-8  md:px-6 md:mt-10 lg:mt-12'>
        <CarouselContent>
          {[...Array(6)].map((_, index) => (
            <CarouselItem
              key={index}
              className='basis-1/2 md:basis-1/3 lg:basis-1/6'
            >
              <CategorySkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  }

  // Show empty state if no categories
  if (!categories.length) {
    return (
      <section>
        <div className='text-center py-8'>
          <p className='text-gray-500'>{t('categories.noCategories')}</p>
        </div>
      </section>
    );
  }

  return (
    <Carousel className='w-full py-4 relative mt-8 px-4 md:px-6 md:mt-10 lg:mt-12'>
      <CarouselContent>
        {categories.map((category) => (
          <CarouselItem
            key={category.id}
            className='basis-1/2 md:basis-1/3 lg:basis-1/6 '
          >
            <CategoryItem
              title={category.name}
              imageSrc={category.imageUrl}
              id={category.id + ''}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
