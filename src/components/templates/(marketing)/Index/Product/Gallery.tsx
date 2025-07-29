'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { ProductResponse } from '@/api-client';

export default function Gallery({ product }: { product: ProductResponse }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.imageUrl)
      : [
          'https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300',
        ];

  return (
    <div className='flex gap-4'>
      {/* Thumbnail Images - Vertical on Left */}
      <div className='flex flex-col gap-2'>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 bg-muted rounded overflow-hidden border-2 ${
              selectedImage === index
                ? 'border-[#0e3bac]'
                : 'border-transparent'
            } hover:border-[#0e3bac] transition-colors`}
          >
            <Image
              src={
                image ||
                'https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300'
              }
              alt={`Product view ${index + 1}`}
              width={80}
              height={80}
              className='w-full h-full object-cover'
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className='flex-1 h-fit aspect-square bg-muted rounded-lg overflow-hidden'>
        <AspectRatio ratio={1 / 2} className='w-full h-fit'>
          <Image
            src={images[0] || '/placeholder.svg'}
            alt='Slim-Fit Stretch-Cotton Poplin Fabric Overshirt'
            width={600}
            height={600}
            className='w-full h-full object-cover'
          />
        </AspectRatio>
      </div>
    </div>
  );
}
