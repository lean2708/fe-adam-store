import { handlePendingEmail } from '@/actions/authActions';
import AuthTemplate from '@/components/templates/(auth)/AuthTemplate';
import VerifyForm from '@/components/templates/(auth)/register/VerifyForm';

export default async function RegisterPage() {
  const email = await handlePendingEmail();

  if (!email) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center p-6 bg-white rounded-lg shadow-md'>
          <h1 className='text-2xl font-bold mb-4'>Yêu cầu không hợp lệ</h1>
          <p className='mb-4'>
            Không tìm thấy thông tin xác thực hoặc phiên làm việc đã hết hạn.
          </p>
          <a href='/register' className='text-blue-600 hover:underline'>
            Quay lại trang đăng ký
          </a>
        </div>
      </div>
    );
  }

  return (
    <AuthTemplate
      reverseOrder
      imageSrc='landing-register-img.jpg'
      imageAlt='Landing Register Image'
    >
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl my-20 font-sans  text-primary'>
          Adam Store
        </h1>
        <h2 className='text-lg md:text-2xl lg:text-3xl font-medium adam-store-text'>
          Đăng ký
        </h2>
        <p className='text-xs md:text-sm '>
          Tạo một tài khoản miễn phí và tận hưởng nó
        </p>
      </div>

      <VerifyForm email={email} />
    </AuthTemplate>
  );
}
