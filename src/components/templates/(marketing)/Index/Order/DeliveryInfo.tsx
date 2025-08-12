import { Button } from '@/components/ui/button';

export function DeliveryInfo() {
  return (
    <div>
      <div className='flex flex-row items-center justify-between mb-3'>
        <h2 className='text-2xl font-bold text-primary '>Giao hàng</h2>
        <Button
          variant='outline'
          className='px-6 py-5 font-medium text-primary rounded-full'
        >
          Chỉnh sửa
        </Button>
      </div>
      <div className=' flex flex-row gap-12'>
        <div className='flex flex-col justify-between text-muted-foreground gap-2'>
          <span className=''>Họ và tên:</span>
          <span className=''>Địa chỉ nhận hàng:</span>
          <span className=''>Số điện thoại:</span>
        </div>
        <div className='flex flex-col justify-between text-muted-foreground gap-2 '>
          <span className=''>Nguyễn Thành Trung</span>
          <span className=''>
            139E Nguyễn Trãi, Phường Bến Thành, Quận 1, HCM
          </span>
          <span className=''>0986594877</span>
        </div>
      </div>
    </div>
  );
}
