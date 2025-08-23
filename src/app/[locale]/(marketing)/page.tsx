'use client';

import Categories from '@/components/templates/(marketing)/Index/Categories';
import BestSellers from '@/components/templates/(marketing)/Index/BestSellers';
import NewestProducts from '@/components/templates/(marketing)/Index/NewestProducts';
import MainBanner from '@/components/templates/(marketing)/Index/MainBanner';
import HeroBanner from '@/components/templates/(marketing)/Index/HeroBanner';
import AnnouncementVnPayModal from '@/components/modules/AnnouncementVnPayModal';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      {/* Featured Products Row */}
      <MainBanner />
      {/* Categories Section */}
      <Categories />
      {/* Best Sellers Section */}
      <BestSellers />
      {/* Hero Banner */}
      <HeroBanner />
      {/* Newest Products */}
      <NewestProducts />

      {/* Order Status Modal - handles its own visibility logic */}
      <AnnouncementVnPayModal />
    </main>
  );
}
