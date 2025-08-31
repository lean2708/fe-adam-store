import { deteleAddressById, getAllAddressUser } from '@/actions/addressActions';
import { AddressResponse } from '@/api-client';
import ConfirmDialogModule from '@/components/modules/ConfirmDialogModule';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { SquarePen, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
export default function Address() {
  const t = useTranslations('Profile.address');

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listAddress, setListAddress] = useState<AddressResponse[]>();
  const [selectAddressId, setSelectAddressId] = useState<number>();
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);
  useEffect(() => {
    getAddress();
  }, []);
  const getAddress = async () => {
    try {
      const res = await getAllAddressUser();
      if (res.status == 200 && res.address?.items) {
        setListAddress(res.address.items);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      if (selectAddressId) {
        const res = await deteleAddressById(selectAddressId);
        if (res.status === 200) {
          await getAddress();
          setVisible(false);
          toast.success(res.message || t('success.message_delete'));
        } else {
          toast.error(res.message || t('failed.message_delete'));
        }
      }
    } catch (error) {
      toast.error(t('failed.message_delete'));
    } finally {
      setLoading(false);
    }
  };
  if (!listAddress)
    return (
      <div className='mt-8 w-full h-90'>
        <div className='flex w-full justify-between'>
          <h5 className='font-bold text-3xl'>{t('title')}</h5>
          <Button
            onClick={() => router.push('/address')}
            className='py-6 px-8 font-medium rounded-xl'
          >
            {t('action.add')}
          </Button>
        </div>
        <ul className='mt-5'>
          <Skeleton className='w-full  mt-3 py-9 px-6 flex items-center justify-between shadow' />
          <Skeleton className='w-full  mt-3 py-9 px-6 flex items-center justify-between shadow' />
        </ul>
      </div>
    );
  if (listAddress.length === 0)
    return (
      <div className='mt-8 w-full h-90'>
        <div className='flex w-full justify-between'>
          <h5 className='font-bold text-3xl'>{t('title')}</h5>
          <Button
            onClick={() => router.push('/address')}
            className='py-6 px-8 font-medium rounded-xl'
          >
            {t('action.add')}
          </Button>
        </div>
        <ul className='mt-5'>
          <div className='w-full bg-gray-100 mt-3 py-9 px-6 flex items-center justify-center shadow'>
            <p>{t('no_address')}</p>
          </div>
        </ul>
      </div>
    );
  return (
    <div className='mt-8 w-full h-90'>
      <div className='flex w-full justify-between'>
        <h5 className='font-bold text-3xl'>{t('title')}</h5>
        <Button
          onClick={() => router.push('/address')}
          className='py-6 px-8 font-medium rounded-xl'
        >
          {t('action.add')}
        </Button>
      </div>
      <ul className='mt-5 overflow-y-auto max-h-80 scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
        {listAddress &&
          listAddress.map((address, index) => (
            <li
              className='adam-store-bg max-w-full rounded-md m-3 py-9 px-6 flex items-center justify-between shadow transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:bg-accent/80 animate-fade-in '
              key={address.id}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <div className='flex flex-col justify-between h-full relative'>
                {address.isDefault && (
                  <Badge
                    variant={'outline'}
                    className='border-black dark:border-white my-1 absolute -top-7 '
                  >
                    {t('set_default.title')}
                  </Badge>
                )}
                <p className='mt-1 transition-colors duration-200 group-hover:text-gray-700'>
                  {t('address')}: {address.streetDetail} - {address.ward?.name}{' '}
                  - {address.district?.name} - {address.province?.name}
                </p>
                <p className='pt-2 transition-colors duration-200 group-hover:text-gray-700'>
                  {t('phone.label')}: {address.phone}
                </p>
              </div>
              <div className='flex space-x-1'>
                <Link
                  className='p-2 rounded-lg group transition-all duration-200 hover:bg-blue-100 hover:scale-110 hover:shadow-md active:scale-95'
                  href={`/address?idAddress=${address.id}`}
                >
                  <SquarePen className='transition-colors duration-200 group-hover:text-blue-600' />
                </Link>
                <button
                  className='p-2 cursor-pointer rounded-lg transition-all duration-200 hover:bg-red-100 hover:scale-110 hover:shadow-md active:scale-95'
                  onClick={() => {
                    setSelectAddressId(address.id);
                    setVisible(true);
                  }}
                >
                  <Trash
                    color='red'
                    className='transition-colors duration-200 hover:text-red-700'
                  />
                </button>
              </div>
            </li>
          ))}
      </ul>
      <ConfirmDialogModule
        title={t('action.confirm_delete')}
        onClose={() => {
          setVisible(false);
        }}
        confirm={visible}
        onSubmit={handleDelete}
        loading={loading}
      />
    </div>
  );
}
