import Details from '@/components/templates/(marketing)/Index/Product/Details';
import Gallery from '@/components/templates/(marketing)/Index/Product/Gallery';
import Recommendations from '@/components/templates/(marketing)/Index/Product/Recommendations';
import Reviews from '@/components/templates/(marketing)/Index/Product/Reviews';
import React from 'react';

type Props = {};

const page = (props: Props) => {
  return (
    <div className='min-h-screen bg-background'>
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {/* Product Section */}
        <div className='grid lg:grid-cols-2 gap-12 mb-16'>
          <Gallery />
          <Details />
        </div>

        {/* Reviews Section */}
        <div className='mb-16'>
          <Reviews />
        </div>
        <h2 className='text-2xl font-bold text-primary'>Bạn có thể sẽ thích</h2>
      </main>
      {/* Recommendations Section */}
      <div className='mb-16 px-4'>
        <Recommendations />
      </div>
    </div>
  );
};

export default page;
