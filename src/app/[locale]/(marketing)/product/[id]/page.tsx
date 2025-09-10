import { getProductDetailsAction } from '@/actions/productActions';
import Details from '@/components/templates/(marketing)/Index/Product/Details';
import Gallery from '@/components/templates/(marketing)/Index/Product/Gallery';
import Recommendations from '@/components/templates/(marketing)/Index/Product/Recommendations';
import Reviews from '@/components/templates/(marketing)/Index/Product/Reviews';
import { manrope } from '@/config/fonts';
import { pageMetadataPresets } from '@/lib/metadata';
import { cn, formatCurrency } from '@/lib/utils';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';

type Props = {
  params: { id: string; locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;

  const product = await getProductDetailsAction(id);

  if (!product) {
    return pageMetadataPresets.product(locale, 'Sản phẩm không tồn tại', id);
  }

  return pageMetadataPresets.product(
    locale,
    product.product?.name!,
    product.product?.id.toString()!,
    product.product?.mainImage,
    product.product?.minPrice
      ? formatCurrency(product.product?.minPrice, locale)
      : undefined
  );
}

const page = async ({ params }: Props) => {
  // ? tôi không còn lựa chọn nào khác ngoài việc sử dụng getTranslations để lấy các bản dịch
  // ? vì useTranslations không hoạt động trong server component
  // ? và tôi không thể sử dụng useTranslations trong server component
  const t = await getTranslations('Marketing.product_details');

  const { id } = await params;

  const productResponse = await getProductDetailsAction(id);

  if (!productResponse.product) {
    return (
      <>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <h1 className='text-2xl font-bold text-center'>Product Not Found</h1>
          <p className='text-center mt-4'>
            {t('product_not_found') ||
              'The product you are looking for does not exist.'}
          </p>
        </div>
      </>
    );
  }

  // console.log(productResponse);

  return (
    <div className='min-h-screen adam-store-bg-light pb-1'>
      <main className={cn(`max-w-7xl mx-auto px-4 py-8`, manrope.className)}>
        {/* Product Section */}
        <div className='grid lg:grid-cols-2 gap-12 mb-16'>
          <Gallery product={productResponse.product} />
          <Details product={productResponse.product} />
        </div>

        {/* Reviews Section */}
        <div className='mb-16'>
          <Reviews productId={id} />
        </div>
        <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-primary'>
          {t('recommendations.title')}
        </h1>
      </main>
      {/* Recommendations Section */}
      <div className='mb-16 px-4'>
        <Recommendations />
      </div>
    </div>
  );
};

export default page;
