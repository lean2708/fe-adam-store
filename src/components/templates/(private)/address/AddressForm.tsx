'use client';

import {
  createAddressByIdAction,
  fetchAddressById,
  fetchDistrictByProvinceId,
  fetchProvince,
  fetchWardByDistrictId,
  updateAddressByIdAction,
} from '@/actions/addressActions';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { District, Province, Ward } from '@/types';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function AddressForm() {
  const t = useTranslations('Profile.address');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('idAddress');
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);

  const [listWard, setListWard] = useState<Ward[]>([]);
  const [listDistrict, setListDistrict] = useState<District[]>([]);
  const [listProvince, setListProvince] = useState<Province[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>();
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>();
  const [addressSet, setAddress] = useState({
    isDefault: false,
    phone: '',
    streetDetail: '',
    wardCode: '',
    districtId: 0,
    provinceId: 0,
  });

  useEffect(() => {
    getListProvince();
    console.log(id);
    if (id) {
      getAddress();
    }
  }, [id]);

  useEffect(() => {
    if (selectedProvinceId) {
      getListDistrict(selectedProvinceId);
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedDistrictId) {
      getListWard(selectedDistrictId);
    }
  }, [selectedDistrictId]);

  const getListProvince = async () => {
    try {
      const res = await fetchProvince();
      if (res.status === 200 && res.provinces?.items) {
        setListProvince(res.provinces.items);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const getListDistrict = async (id: number) => {
    try {
      const res = await fetchDistrictByProvinceId(id);
      if (res.status === 200 && res.districts?.items) {
        setListDistrict(res.districts.items);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const getListWard = async (id: number) => {
    try {
      const res = await fetchWardByDistrictId(id);
      if (res.status === 200 && res.ward?.items) {
        setListWard(res.ward.items);
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const getAddress = async () => {
    const res = await fetchAddressById(Number(id));
    if (res.status === 200 && res.address) {
      const address = res.address;
      console.log(address);
      setAddress({
        isDefault: address.isDefault || false,
        phone: address.phone || '',
        streetDetail: address.streetDetail || '',
        wardCode: address.ward?.code || '',
        districtId: address.district?.id || 0,
        provinceId: address.province?.id || 0,
      });

      setSelectedProvinceId(address.province?.id);
      setSelectedDistrictId(address.district?.id);
    }
  };

  const handleSaveChanges = async () => {
    if (
      addressSet.provinceId === 0 ||
      addressSet.districtId === 0 ||
      addressSet.wardCode === '' ||
      addressSet.streetDetail === '' ||
      addressSet.phone === ''
    ) {
      toast.warning(t('validation.required_fields'));
      return;
    }
    if (!/^(0[0-9]{9})$/.test(addressSet.phone)) {
      toast.warning(t('phone.validation.invalid'));
      return;
    }
    try {
      if (id) {
        const res = await updateAddressByIdAction(Number(id), addressSet);
        if (res.status === 200 && res.newAddress) {
          toast.success(t('success.message_update'));
          router.push('/user?tab=Address');
        } else toast.error(t('failed.message'));
      } else {
        const res = await createAddressByIdAction(addressSet);
        if (res.status === 200 && res.newAddress) {
          toast.success(t('success.message_add'));
          router.push('/user?tab=Address');
        } else toast.error(t('failed.message'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (
    id &&
    addressSet.provinceId === 0 &&
    addressSet.districtId === 0 &&
    addressSet.wardCode === ''
  )
    return (
      <main className='max-w-3xl mx-auto p-4 pt-5'>
        <h3 className='font-bold text-3xl w-full text-center'>
          {id ? t('edit_address') : t('add_address')}
        </h3>
        <div className='mt-5 w-full p-5 min-h-110 border-2 border-black rounded-lg shadow adam-store-bg'>
          <div className='w-full flex mt-5 h-10 items-center'>
            <span className='w-70'>{t('city.label')}:</span>
            <Skeleton className='h-9 rounded-lg w-full border p-2 outline-none'></Skeleton>
          </div>
          <div className='w-full flex mt-5 h-10 items-center'>
            <span className='w-70'>{t('district.label')}:</span>
            <Skeleton className='h-9 rounded-lg w-full border p-2 outline-none'></Skeleton>
          </div>
          <div className='w-full flex mt-5 h-10 items-center'>
            <span className='w-70'>{t('ward.label')}:</span>
            <Skeleton className='h-9 rounded-lg w-full border p-2 outline-none'></Skeleton>
          </div>
          <div className='w-full flex mt-5 h-10 items-center'>
            <span className='w-70'>{t('address_line1.label')}:</span>
            <Skeleton className='h-9 w-full border  p-2 rounded-lg outline-none' />
          </div>
          <div className='w-full flex mt-5 h-10 items-center'>
            <span className='w-70'>{t('phone.label')}:</span>
            <Skeleton className='h-9 w-full border  p-2 rounded-lg outline-none' />
          </div>
          <div className='w-full flex mt-5 h-10 items-center'>
            <span className='!w-50'>{t('set_default.label')}:</span>

            <label className='switch text-start'>
              <input type='checkbox' disabled />
              <span className='slider'></span>
            </label>
          </div>
          <div className='w-full text-center pt-4'>
            <button
              className='py-2 px-6 bg-black text-white rounded-lg'
              disabled
            >
              {id ? t('action.save') : t('action.add')}
            </button>
          </div>
        </div>
      </main>
    );

  return (
    <main className='max-w-3xl mx-auto p-4 pt-5'>
      <h3 className='font-bold text-3xl w-full text-center'>
        {id ? t('edit_address') : t('add_address')}
      </h3>
      <div className='mt-5 w-full p-5 min-h-110 border-2 border-primary rounded-lg shadow adam-store-bg'>
        <div className='w-full flex mt-5 h-10 items-center'>
          <span className='w-70'>{t('city.label')}:</span>
          <select
            value={addressSet.provinceId || ''}
            className='rounded-lg w-full border p-2 outline-none'
            onChange={(e) => {
              const id = Number(e.target.value);
              setAddress({ ...addressSet, provinceId: id });
              setSelectedProvinceId(id);
              setSelectedDistrictId(undefined);
              setListDistrict([]);
              setListWard([]);
            }}
          >
            <option value=''>{t('city.placeholder')}</option>
            {listProvince.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex mt-5 h-10 items-center'>
          <span className='w-70'>{t('district.label')}:</span>
          <select
            value={addressSet.districtId || ''}
            className='rounded-lg w-full border p-2 outline-none'
            onChange={(e) => {
              const id = Number(e.target.value);
              setAddress({ ...addressSet, districtId: id });
              setSelectedDistrictId(id);
            }}
          >
            <option value=''>{t('district.placeholder')}</option>
            {listDistrict.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex mt-5 h-10 items-center'>
          <span className='w-70'>{t('ward.label')}:</span>
          <select
            value={addressSet.wardCode || ''}
            className='rounded-lg w-full border p-2 outline-none'
            onChange={(e) => {
              const code = e.target.value;
              setAddress({ ...addressSet, wardCode: code });
            }}
          >
            <option value=''>{t('ward.placeholder')}</option>
            {listWard.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex mt-5 h-10 items-center'>
          <span className='w-70'>{t('address_line1.label')}:</span>
          <input
            type='text'
            value={addressSet.streetDetail || ''}
            placeholder={t('address_line1.placeholder')}
            className='w-full border p-2 rounded-lg outline-none'
            onChange={(e) =>
              setAddress({ ...addressSet, streetDetail: e.target.value })
            }
          />
        </div>
        <div className='w-full flex mt-5 h-10 items-center'>
          <span className='w-70'>{t('phone.label')}:</span>
          <input
            type='text'
            value={addressSet.phone || ''}
            placeholder={t('phone.placeholder')}
            className='w-full border p-2 rounded-lg outline-none'
            onChange={(e) =>
              setAddress({ ...addressSet, phone: e.target.value })
            }
          />
        </div>
        <div className='w-full flex mt-5 h-10 items-center'>
          <span className='!w-50'>{t('set_default.label')}:</span>

          <label className='relative inline-block w-[50px] h-[28px]'>
            <input
              type='checkbox'
              checked={addressSet.isDefault}
              onChange={(e) =>
                setAddress({ ...addressSet, isDefault: e.target.checked })
              }
              className='peer sr-only'
            />
            <span className='absolute inset-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-green-500'></span>
            <span className='absolute left-[4px] bottom-[4px] h-[20px] w-[20px] bg-white rounded-full transition-transform peer-checked:translate-x-[22px]'></span>
          </label>
        </div>
        <div className='w-full text-center pt-4'>
          <Button
            className='py-6 px-8 font-medium rounded-xl'
            onClick={handleSaveChanges}
          >
            {id ? t('action.save') : t('action.add')}
          </Button>
        </div>
      </div>
    </main>
  );
}
