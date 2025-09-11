import { handlePendingEmail } from '@/actions/nextAuthActions';
import AuthTemplate from '@/components/templates/(auth)/AuthTemplate';
import VerifyForm from '@/components/templates/(auth)/register/VerifyForm';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

// This page needs to be dynamically rendered because it uses cookies
export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const t = await getTranslations('Register.verify');
  const email = await handlePendingEmail();

  if (!email) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center p-6 adam-store-bg rounded-lg shadow-md'>
          <h1 className='text-2xl font-bold mb-4'>Yêu cầu không hợp lệ</h1>
          <p className='mb-4'>{t('no_email.title')}</p>
          <Link
            href='/register'
            className='text-muted-foreground hover:underline'
          >
            {t('no_email.message')}
          </Link>
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
          {t('title')}
        </h2>
        <p className='text-xs md:text-sm '>{t('sub_title', { email })}</p>
      </div>

      <VerifyForm email={email} />
    </AuthTemplate>
  );
}
