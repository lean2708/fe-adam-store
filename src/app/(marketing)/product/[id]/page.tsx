import Details from '@/components/templates/(marketing)/Index/Product/Details';
import Gallery from '@/components/templates/(marketing)/Index/Product/Gallery';
import Recommendations from '@/components/templates/(marketing)/Index/Product/Recommendations';
import Reviews from '@/components/templates/(marketing)/Index/Product/Reviews';
import React from 'react';

type Props = {};

const page = (props: Props) => {
  return (
    <div className=' pt-10  '>
      <div className='flex flex-col gap-8 lg:flex-row xl:gap-x-10'>
        <div className='w-full'>
          <Gallery />
        </div>
        <div className='w-full pt-5 xl:pt-8'>
          <Details />
        </div>
      </div>
      <Reviews />
      <Recommendations />
    </div>
  );
};

export default page;
