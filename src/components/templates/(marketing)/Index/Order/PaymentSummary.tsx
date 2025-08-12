import { Separator } from '@/components/ui/separator';

export function PaymentSummary() {
  return (
    <div className='space-y-3 text-sm'>
      <h4 className='text-2xl font-bold text-primary mb-4'>
        Chi tiết thanh toán
      </h4>
      <div className='flex justify-between text-muted-foreground'>
        <span className=''>Tạm tính</span>
        <span className=''>5,600,000 VND</span>
      </div>
      <div className='flex justify-between text-muted-foreground'>
        <span className=''>Phí vận chuyển</span>
        <span className=''>50,000 VND</span>
      </div>
      <div className='flex justify-between text-muted-foreground'>
        <span className=''>Mã giảm giá</span>
        <span className=''>0 VND</span>
      </div>
      <Separator className='mt-4' />
      <div className='text-primary font-bold  pt-3 flex justify-between'>
        <span className=''>Thành tiền</span>
        <span className=''>5,650,000 VND</span>
      </div>
    </div>
  );
}
