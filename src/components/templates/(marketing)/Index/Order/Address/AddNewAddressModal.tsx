'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import useAddress from '@/hooks/(order)/useAddress';
import { toast } from 'sonner';

const addressSchema = z.object({
  city: z.number().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.number().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  phone: z
    .string()
    .min(8, 'Vui lòng nhập số điện thoại hợp lệ')
    .max(14, 'Số điện thoại quá dài')
    .regex(/^[0-9]+$/, 'Số điện thoại không hợp lệ'),
  isDefault: z.boolean().optional(),
});

type AddressSchema = z.infer<typeof addressSchema>;

interface AddNewAddressModalProps {
  open: boolean;
  onclose: (open: boolean) => void;
  onSaveSuccess: () => void;
}

export default function AddNewAddressModal({
  open,
  onclose,
  onSaveSuccess,
}: AddNewAddressModalProps) {
  const {
    addNewAddress,
    provinces,
    districts,
    wards,
    loadingProvinces,
    loadingDistricts,
    loadingWards,
    setSelectedProvince,
    setSelectedDistrict,
  } = useAddress();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: 0,
      district: 0,
      ward: '',
      address: '',
      phone: '',
      isDefault: false,
    },
  });

  // Reset form state khi đóng dialog
  useEffect(() => {
    if (!open) {
      reset();
      setSelectedProvince(null);
      setSelectedDistrict(null);
    } else {
      // Khi mở modal, load danh sách tỉnh nếu chưa có
      if (provinces.length === 0 && !loadingProvinces) {
        setSelectedProvince(null);
      }
    }
  }, [open, provinces.length, loadingProvinces, reset]);

  const onSubmit = (data: AddressSchema) => {
    const addressData = {
      isDefault: data.isDefault || false,
      phone: data.phone,
      streetDetail: data.address,
      wardCode: data.ward,
      districtId: data.district,
      provinceId: data.city,
    };

    addNewAddress(addressData, {
      onSuccess: (response: any) => {
        if (response?.status === 200) {
          onclose(false);
          onSaveSuccess();
          reset();
        } else {
          toast.error('Thêm địa chỉ thất bại');
        }
      },
      onError: (error: any) => {
        toast.error('Lỗi khi thêm địa chỉ: ' + error.message);
      },
    });
  };

  // Xử lý khi chọn tỉnh/thành
  const handleProvinceChange = (value: string) => {
    const provinceId = Number(value);
    setValue('city', provinceId, { shouldValidate: true });
    setSelectedProvince(provinceId);

    // Reset các giá trị phụ thuộc
    setValue('district', 0);
    setValue('ward', '');
    setSelectedDistrict(null);
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = (value: string) => {
    const districtId = Number(value);
    setValue('district', districtId, { shouldValidate: true });
    setSelectedDistrict(districtId);

    // Reset giá trị phường/xã
    setValue('ward', '');
  };

  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent className='sm:max-w-md adam-store-bg-light rounded-2xl p-6'>
        <DialogHeader className='relative'>
          <DialogTitle className='text-center text-lg font-medium text-primary'>
            Thêm địa chỉ mới
          </DialogTitle>
          <p className='text-center text-sm text-muted-foreground mt-1'>
            Cập nhật địa chỉ mới
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-6 space-y-6'
          noValidate
        >
          {/* Tỉnh/Thành phố */}
          <div>
            <Select
              value={watch('city')?.toString()}
              onValueChange={handleProvinceChange}
              disabled={loadingProvinces}
            >
              <SelectTrigger
                className={cn(
                  'w-full border-border relative py-6',
                  errors.city && 'border-red-500'
                )}
              >
                <SelectValue
                  placeholder={
                    loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'
                  }
                />
                <Label
                  htmlFor='city'
                  className={cn(
                    'text-sm text-muted-foreground adam-store-bg-light mb-2 absolute -top-3 left-5 px-2 py-0.5 ',
                    errors.city && 'text-red-500'
                  )}
                >
                  Chọn tỉnh/thành phố
                </Label>
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem
                    key={province.id}
                    value={province.id ? province.id.toString() : ''}
                  >
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quận/Huyện */}
          <div>
            <Select
              value={watch('district')?.toString()}
              onValueChange={handleDistrictChange}
              disabled={!watch('city') || loadingDistricts}
            >
              <SelectTrigger
                className={cn(
                  'w-full border-border relative py-6',
                  errors.district && 'border-red-500'
                )}
              >
                <SelectValue placeholder={loadingDistricts && 'Đang tải...'} />
                <Label
                  htmlFor='district'
                  className={cn(
                    'text-sm text-muted-foreground adam-store-bg-light mb-2 absolute -top-3 left-5 px-2 py-0.5 ',
                    errors.district && 'text-red-500'
                  )}
                >
                  Chọn quận/huyện
                </Label>
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem
                    key={district.id}
                    value={district.id ? district.id.toString() : ''}
                  >
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phường/Xã */}
          <div>
            <Select
              value={watch('ward')}
              onValueChange={(value) =>
                setValue('ward', value, { shouldValidate: true })
              }
              disabled={!watch('district') || loadingWards}
            >
              <SelectTrigger
                className={cn(
                  'w-full border-border relative py-6',
                  errors.ward && 'border-red-500'
                )}
              >
                <SelectValue placeholder={loadingWards && 'Đang tải...'} />
                <Label
                  htmlFor='ward'
                  className={cn(
                    'text-sm text-muted-foreground adam-store-bg-light mb-2 absolute -top-3 left-5 px-2 py-0.5 ',
                    errors.ward && 'text-red-500'
                  )}
                >
                  Chọn phường/xã
                </Label>
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward.code} value={ward.code || ''}>
                    {ward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Địa chỉ cụ thể */}
          <div className=' relative'>
            <Label
              htmlFor='address'
              className={cn(
                'text-sm text-muted-foreground adam-store-bg-light mb-2 absolute -top-3 left-5 px-2 py-0.5 ',
                errors.address && 'text-red-500'
              )}
            >
              Nhập địa chỉ
            </Label>
            <Input
              id='address'
              {...register('address')}
              className={cn(
                'border-border border rounded-md py-6 text-sm adam-store-bg-light',
                errors.address && 'border-red-500'
              )}
              autoComplete='off'
              placeholder='Ví dụ: 123 Nguyễn Huệ...'
              disabled={isSubmitting}
            />
          </div>

          {/* Số điện thoại */}
          <div className='relative'>
            <Label
              htmlFor='phone'
              className={cn(
                'text-sm text-muted-foreground adam-store-bg-light mb-2 absolute -top-3 left-5 px-2 py-0.5 ',
                errors.phone && 'text-red-500'
              )}
            >
              Số điện thoại
            </Label>
            <Input
              id='phone'
              {...register('phone')}
              className={cn(
                'border-border border rounded-md py-6 text-sm adam-store-bg-light',
                errors.phone && 'border-red-500'
              )}
              autoComplete='off'
              placeholder='Ví dụ: 0987654321'
              disabled={isSubmitting}
            />
          </div>

          {/* Đặt làm mặc định */}
          <div className='flex items-center space-x-2 pt-2'>
            <Checkbox
              id='default'
              checked={watch('isDefault') || false}
              onCheckedChange={(checked) =>
                setValue('isDefault', !!checked, { shouldValidate: true })
              }
              disabled={isSubmitting}
            />
            <Label htmlFor='default' className='text-sm text-primary'>
              Đặt làm mặc định
            </Label>
          </div>

          <Button
            type='submit'
            className='w-full mt-6 py-3'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
