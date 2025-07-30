import { getProductDetailsAction } from '@/actions/productActions';
import Details from '@/components/templates/(marketing)/Index/Product/Details';
import Gallery from '@/components/templates/(marketing)/Index/Product/Gallery';
import Recommendations from '@/components/templates/(marketing)/Index/Product/Recommendations';
import Reviews from '@/components/templates/(marketing)/Index/Product/Reviews';
import React from 'react';

type Props = {
  params: { id: string };
};

const page = async ({ params }: Props) => {
  const { id } = await params;

  const productResponse = await getProductDetailsAction(id);

  if (!productResponse.product) {
    return (
      <>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <h1 className='text-2xl font-bold text-center'>Product Not Found</h1>
          <p className='text-center mt-4'>
            The product you are looking for does not exist.
          </p>
        </div>
      </>
    );
  }

  // console.log(productResponse);

  return (
    <div className='min-h-screen bg-background'>
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {/* Product Section */}
        <div className='grid lg:grid-cols-2 gap-12 mb-16'>
          <Gallery product={productResponse.product} />
          <Details />
        </div>

        {/* Reviews Section */}
        <div className='mb-16'>
          <Reviews productId={id} />
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
