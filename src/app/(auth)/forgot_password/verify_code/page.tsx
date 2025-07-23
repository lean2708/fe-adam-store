import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthTemplate from '@/components/Auth/AuthTemplate';

export default function RegisterPage() {
  return (
    <AuthTemplate
      imageSrc='landing-forgot-password-img.jpg'
      imageAlt='Landing Forgot Password Image'
    >
      <div className='space-y-4 md:space-y-6'>
        <div className='space-y-1 md:space-y-2'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl mb-20 font-sans  text-primary'>
            Adam Store
          </h1>
          <h2 className='text-lg md:text-2xl lg:text-3xl font-medium adam-store-text'>
            Quên mật khẩu
          </h2>
          <p className='text-xs md:text-sm '>Khôi phục mật khẩu của bạn</p>
        </div>

        <form action='/forgot_password/reset_password'>
          <div className='space-y-4'>
            <div className='space-y-2 relative'>
              <Input
                id='otp'
                type='text'
                placeholder='Nhập mã xác thực'
                className='w-full -px-3  py-8 rounded-none  border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none  focus-visible:border-b-2  focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none '
              />

              <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <Mail className='text-gray-500 size-5' />
              </span>
            </div>
          </div>

          <div className='space-y-1 mt-8 flex justify-between'>
            <Button className='w-fit bg-foreground cursor-pointer hover:bg-foreground/80 text-secondary py-2 px-4 rounded-md font-medium'>
              Xác thực
            </Button>

            <div className='text-center'>
              <Link
                href='/login'
                className='text-sm text-primary hover:underline'
              >
                Trờ về đăng nhập
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AuthTemplate>
  );
}
