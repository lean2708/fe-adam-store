import LoginForm from '@/components/templates/(auth)/login/LoginForm';
import AuthTemplate from '@/components/templates/(auth)/AuthTemplate';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function LoginPage() {
  const t = await getTranslations('Login');

  return (
    <AuthTemplate
      imageSrc='landing-login-img.png'
      imageAlt='Landing Login Image'
    >
      <div className='space-y-4 md:space-y-6'>
        <div className='space-y-1 md:space-y-2'>
          <h1 className='text-3xl md:text-4xl lg:text-6xl xl:text-7xl  mb-8 md:mb-16 lg:mb-24 font-sans  text-primary'>
            Adam Store
          </h1>
          <h2 className='text-lg md:text-2xl lg:text-3xl font-medium adam-store-text'>
            {t('title')}
          </h2>
          <p className='text-xs md:text-sm '>{t('sub_title')}</p>
        </div>

        <LoginForm />

        <div className='text-sm text-primary px-3'>
          {t('noAccount')}
          <Link
            href='/register'
            className='text-primary font-medium hover:underline ml-1'
          >
            {t('register')}
          </Link>
        </div>
      </div>
    </AuthTemplate>
  );
}
