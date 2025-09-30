'use client';
import Address from '@/components/templates/(private)/user/address';
import ChangePassword from '@/components/templates/(private)/user/changePassword';
import Infomation from '@/components/templates/(private)/user/infomation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';

export function ContentUser() {
  const t = useTranslations('Profile');

  const tabList = [
    { key: 'Info', label: t('tabs.info') },
    { key: 'Change', label: t('tabs.change_password') },
    { key: 'Address', label: t('tabs.addresses') },
  ];
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // Lấy tham số tìm kiếm
  const tab = searchParams.get('tab');

  const [activeStatus, setActiveStatus] = useState<string>('Info'); // Mặc định là 'Info'

  useEffect(() => {
    // Kiểm tra xác thực và điều hướng đến trang đăng nhập nếu chưa xác thực
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);

  useEffect(() => {
    // Cập nhật activeStatus nếu có query parameter 'tab'
    if (tab && tabList.some((item) => item.key === tab)) {
      setActiveStatus(tab as string);
    }
  }, [tab]);

  const handleTabChange = (newTab: string) => {
    setActiveStatus(newTab);
    router.push(`/user?tab=${newTab}`); // Cập nhật URL với tab mới
  };

  return (
    <>
      <div className='w-full md:max-w-xs flex flex-col items-center'>
        <h3 className='font-bold text-3xl '>{t('title')}</h3>
        <ul className='md:mt-4 w-full md:w-fit flex justify-between md:block'>
          {tabList.map((item) => (
            <div key={item.key}>
              <li
                key={item.key}
                onClick={() => handleTabChange(item.key)}
                className={cn(
                  'px-3 py-2 cursor-pointer underline-offset-1 ',
                  activeStatus !== item.key && 'text-muted-foreground'
                )}
              >
                {item.label}
              </li>

              {activeStatus === item.key && (
                <Separator
                  className=' bg-primary mx-auto rounded-full '
                  style={{ height: '0.25rem' }}
                />
              )}
            </div>
          ))}
        </ul>
      </div>
      <div className='flex-1 md:flex-col md:ml-6'>
        <h3 className='hidden md:block w-full text-center font-bold text-xl md:text-3xl'>
          {tabList.find((tab) => tab.key === activeStatus)?.label}
        </h3>
        {activeStatus === 'Info' && <Infomation />}
        {activeStatus === 'Change' && <ChangePassword />}
        {activeStatus === 'Address' && <Address />}
      </div>
    </>
  );
}
