import Image from 'next/image';
import type { ReactNode } from 'react';

interface AuthTemplateProps {
  children: ReactNode;
  reverseOrder?: boolean;
  imageSrc?: string;
  imageAlt?: string;
}

export default function AuthTemplate({
  children,
  reverseOrder = false,
  imageSrc,
  imageAlt,
}: AuthTemplateProps) {
  const ImageSection = () => (
    <div className='lg:w-1/2 hidden lg:block lg:min-h-full'>
      <Image
        src={`/imgs/${imageSrc}`}
        alt={`${imageAlt}`}
        width={600}
        height={600}
        className='w-full h-full object-cover'
        placeholder='blur'
        blurDataURL={`/imgs/${imageSrc}`}
      />
    </div>
  );

  const FormSection = () => (
    <div className='h-fit lg:w-1/2 py-8 px-4 md:px-12 md:py-12 lg:px-24  flex flex-col justify-center'>
      {children}
    </div>
  );

  return (
    <div className='adam-store-bg-light flex items-center justify-center'>
      <div className='w-full adam-store-bg overflow-hidden'>
        <div className='flex flex-col lg:flex-row min-h-screen py-10 lg:py-0'>
          {reverseOrder ? (
            <>
              <FormSection />
              <ImageSection />
            </>
          ) : (
            <>
              <ImageSection />
              <FormSection />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
