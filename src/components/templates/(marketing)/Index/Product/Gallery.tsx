'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600',
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
              src={image || '/placeholder.svg'}
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
            src={images[selectedImage] || '/placeholder.svg'}
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
