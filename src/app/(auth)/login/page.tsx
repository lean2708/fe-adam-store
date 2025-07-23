import AuthTemplate from '@/components/Auth/AuthTemplate';
import LoginForm from '@/components/Auth/form/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <AuthTemplate
      imageSrc='landing-login-img.png'
      imageAlt='Landing Login Image'
    >
      <div className='space-y-4 md:space-y-6'>
        <div className='space-y-1 md:space-y-2'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl mb-24 font-sans  text-primary'>
            Adam Store
          </h1>
          <h2 className='text-lg md:text-2xl lg:text-3xl font-medium adam-store-text'>
            Đăng nhập
          </h2>
          <p className='text-xs md:text-sm '>
            Đăng nhập với tài khoản đã đăng ký với chúng tôi
          </p>
        </div>

        {/* <form action='/register'>
          <div className='space-y-4'>
            <div className='space-y-2 relative'>
              <Input
                id='email'
                type='email'
                placeholder='Địa chỉ Email'
                className='w-full -px-3  py-8 rounded-none  border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none  focus-visible:border-b-2  focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none '
              />

              <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <Mail className='text-gray-500 size-5' />
              </span>
            </div>

            <div className='space-y-2 relative'>
              <Input
                id='password'
                type='password'
                placeholder='Mật khẩu'
                className='w-full -px-3  py-8 rounded-none  border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none  focus-visible:border-b-2  focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none '
              />

              <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <Lock className='text-gray-500 size-5' />
              </span>
            </div>
          </div>

          <div className='space-y-1 mt-8 flex justify-between'>
            <Button className='w-fit bg-foreground cursor-pointer hover:bg-foreground/80 text-secondary py-2 px-4 rounded-md font-medium'>
              Đăng nhập
            </Button>

            <div className='text-center'>
              <Link
                href='/forgot_password'
                className='text-sm text-primary hover:underline'
              >
                Quên mật khẩu ?
              </Link>
            </div>
          </div>
        </form> */}
        <LoginForm />

        <div className='text-sm text-primary px-3'>
          Bạn chưa có tài khoản ?
          <Link
            href='/register'
            className='text-primary font-medium hover:underline ml-1'
          >
            Tạo tài khoản ngay
          </Link>
        </div>
      </div>
    </AuthTemplate>
  );
}
