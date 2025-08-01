import { Button } from '@/components/ui/button';

export default function ProductActions({
  onAddToCart,
  onBuyNow,
}: {
  onAddToCart: () => void;
  onBuyNow: () => void;
}) {
  return (
    <div className='flex gap-2'>
      <Button
        onClick={onAddToCart}
        className='px-10 py-3 rounded-md font-semibold text-white bg-neutral-800 hover:bg-neutral-700'
      >
        Thêm vào giỏ hàng
      </Button>
      <Button
        onClick={onBuyNow}
        className='px-10 py-3 rounded-md font-semibold text-white bg-blue-800 hover:bg-blue-700'
      >
        Mua Ngay
      </Button>
    </div>
  );
}
