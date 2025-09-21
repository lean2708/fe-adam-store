'use client';

import Link from 'next/link';
import { MessageCircle, Camera, Users } from 'lucide-react';
import { getActiveBranchesAction } from '@/actions/branchActions';
import { TBranch } from '@/types';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import useIsMobile from '@/hooks/useIsMobile';
import { shouldHideByPathAndDevice } from '@/lib/utils';

export default function Footer() {
  const t = useTranslations('Footer');
  const [branches, setBranches] = useState<TBranch[]>([]);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  const unAllowPaths = ['/login', '/register', '/cart', '/order', '/checkout']; // List of paths to be excluded from the footer

  // Check if should hide footer - only after component mounts
  const shouldHideFooter =
    isMounted && shouldHideByPathAndDevice(pathname, isMobile, unAllowPaths);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (shouldHideFooter) return; // Don't fetch if footer is hidden

    const fetchBranches = async () => {
      try {
        const branchesResult = await getActiveBranchesAction();
        setBranches(branchesResult.success ? branchesResult.data || [] : []);
      } catch (error) {
        console.log('Branches not available');
        setBranches([]);
      }
    };
    fetchBranches();
  }, [shouldHideFooter]);

  // Don't render anything until we know the client state
  if (!isMounted) {
    return null;
  }

  if (shouldHideFooter) return null;

  return (
    <footer className='bg-black text-white py-16 px-10 min-h-[600px] lg:min-h-[700px]'>
      <div className='max-w-7xl mx-auto'>
        {/* Top Section */}
        <div className='flex flex-col gap-8 mb-16 lg:grid lg:grid-cols-3 '>
          {/* Left Column - Brand */}
          <div className='lg:col-span-1'>
            <h1 className='text-2xl font-bold mb-4'>{t('brand.title')}</h1>
            <p className='text-gray-300 text-sm mb-6 leading-relaxed'>
              {t('brand.description')}
            </p>
            <button className='bg-white text-black px-6 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors'>
              {t('brand.feedbackButton')}
            </button>
          </div>

          {/* Middle Column - Contact Info */}
          <div className='lg:col-span-1'>
            <div className='lg:text-right'>
              <div className='mb-4'>
                <p className='text-sm text-gray-300'>{t('contact.hotline')}</p>
                <p className='text-sm text-gray-300'>
                  {t('contact.hours.weekdays')}
                </p>
                <p className='text-sm text-gray-300'>
                  {t('contact.hours.weekends')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Social Icons */}
          <div className='lg:col-span-1'>
            <div className='lg:text-right'>
              <h2 className='font-semibold mb-4 text-white'>
                {t('social.title')}
              </h2>
              <div className='flex justify-start lg:justify-end gap-4'>
                <Link
                  href='#'
                  className='w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'
                  title={t('social.community')}
                >
                  <Users className='w-5 h-5' />
                </Link>
                <Link
                  href='#'
                  className='w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'
                  title={t('social.facebook')}
                >
                  <MessageCircle className='w-5 h-5' />
                </Link>
                <Link
                  href='#'
                  className='w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'
                  title={t('social.instagram')}
                >
                  <Camera className='w-5 h-5' />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-gray-700 pt-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {/* CHÍNH SÁCH */}
            <div>
              <h2 className='font-semibold mb-4 text-white'>
                {t('policies.title')}
              </h2>
              <ul className='space-y-2 text-sm text-gray-300 min-h-[120px]'>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('policies.return')}
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('policies.shipping')}
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('policies.privacy')}
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('policies.delivery')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* CHĂM SÓC KHÁCH HÀNG */}
            <div>
              <h2 className='font-semibold mb-4 text-white'>
                {t('customerCare.title')}
              </h2>
              <ul className='space-y-2 text-sm text-gray-300 min-h-[120px]'>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('customerCare.sizeGuide')}
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('customerCare.careInstructions')}
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('customerCare.faq')}
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('customerCare.contact')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* VỀ ADAM STORE */}
            <div>
              <h2 className='font-semibold mb-4 text-white'>
                {t('about.title')}
              </h2>
              <ul className='space-y-2 text-sm text-gray-300 min-h-[120px]'>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('about.story')}
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('about.careers')}
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('about.news')}
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    {t('about.sustainability')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* ĐỊA CHỈ CHI NHÁNH */}
            <div>
              <h2 className='font-semibold mb-4 text-white'>
                {t('branches.title')}
              </h2>
              <ul className='space-y-2 text-sm text-gray-300 min-h-[120px]'>
                {branches.length > 0 ? (
                  branches.map((branch) => (
                    <li key={branch.id} className='mb-3 min-h-[48px]'>
                      <div className='font-medium text-white'>
                        {branch.name}
                      </div>
                      <div>{branch.location}</div>
                      {branch.phone && (
                        <div className='text-xs text-gray-400'>
                          {t('branches.phone')}: {branch.phone}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  // Skeleton loading with fixed height
                  <>
                    {[...Array(4)].map((_, idx) => (
                      <li key={idx} className='mb-3 min-h-[48px]'>
                        <Skeleton className=' h-4 w-2/3 mb-2' />
                        <Skeleton className=' h-3 w-1/2 mb-1' />
                        <Skeleton className=' h-3 w-1/3' />
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
