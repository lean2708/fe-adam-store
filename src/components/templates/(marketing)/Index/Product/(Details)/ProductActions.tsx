import { Button } from '@/components/ui/button';

export default function ProductActions({
  onAddToCart,
  onBuyNow,
}: {
  onAddToCart: () => void;
  onBuyNow: () => void;
}) {
  return (
    <div className='flex gap-2 justify-center'>
      <Button
        variant={'outline'}
        onClick={onAddToCart}
        className='px-10 py-3 flex-1 rounded-md font-semibold text-primary text-xl cursor-pointer'
      >
        Thêm vào giỏ hàng
      </Button>
      <Button
        variant={'default'}
        onClick={onBuyNow}
        className='px-10 py-3 flex-1 rounded-md font-semibold text-xl cursor-pointer'
      >
        Mua Ngay
      </Button>
    </div>
  );
}
