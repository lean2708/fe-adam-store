import AuthTemplate from '@/components/templates/(auth)/AuthTemplate';
import ForgotPasswordForm from '@/components/templates/(auth)/forgot_password/ForgotPasswordForm';
import { getTranslations } from 'next-intl/server';

export default async function RegisterPage() {
  const t = await getTranslations('Forgot_password');
  return (
    <AuthTemplate
      imageSrc='landing-forgot-password-img.jpg'
      imageAlt='Landing Forgot Password Image'
    >
      <div className='space-y-4 md:space-y-6'>
        <div className='space-y-1 md:space-y-2'>
          <h1 className='h-fit text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl mb-20 font-sans  text-primary'>
            Adam Store
          </h1>
          <h2 className='text-lg md:text-2xl lg:text-3xl font-medium adam-store-text'>
            {t('title')}
          </h2>
          <p className='text-xs md:text-sm '>{t('sub_title')}</p>
        </div>

        <ForgotPasswordForm />
      </div>
    </AuthTemplate>
  );
}
