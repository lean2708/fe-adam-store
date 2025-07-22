import Image from 'next/image';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const ImageSection = () => (
    <div className='lg:w-1/2 min-h-[300px] lg:min-h-full'>
      <Image
        src='/imgs/landing-login-img.png'
        alt='Two people in mint green clothing sitting on wooden stairs'
        width={600}
        height={600}
        className='w-full h-full object-cover'
      />
    </div>
  );

  const FormSection = () => (
    <div className='lg:w-1/2 p-4 sm:p-8 md:p-12 lg:p-24 flex flex-col justify-center'>
      {children}
    </div>
  );

  return (
    <div className=' bg-background flex items-center justify-center '>
      <div className='w-full  bg-background overflow-hidden'>
        <div className='flex flex-col lg:flex-row max-h-screen'>
          <ImageSection />
          <FormSection />
        </div>
      </div>
    </div>
  );
}
