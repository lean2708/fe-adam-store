import AuthTemplate from '@/components/templates/(auth)/AuthTemplate';
import RegisterForm from '@/components/templates/(auth)/register/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthTemplate
      reverseOrder
      imageSrc='landing-register-img.jpg'
      imageAlt='Landing Register Image'
    >
      <div className='space-y-4 md:space-y-6'>
        <div className='space-y-1 md:space-y-2'>
          <h1 className='h-fit text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl mb-20 font-sans  text-primary'>
            Adam Store
          </h1>
          <h2 className='text-lg md:text-2xl lg:text-3xl font-medium adam-store-text'>
            Đăng ký
          </h2>
          <p className='text-xs md:text-sm '>
            Tạo một tài khoản miễn phí và tận hưởng nó
          </p>
        </div>

        <RegisterForm />
      </div>
    </AuthTemplate>
  );
}
