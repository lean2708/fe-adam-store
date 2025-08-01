export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div>
      <label className='block text-sm font-medium text-primary mb-2'>
        Số lượng:
      </label>
      <div className='flex items-center gap-2'>
        <button
          onClick={onDecrease}
          className='w-8 h-8 border border-border rounded flex items-center justify-center hover:bg-[#e8e8e8]'
        >
          -
        </button>
        <span className='w-12 text-center'>{quantity}</span>
        <button
          onClick={onIncrease}
          className='w-8 h-8 border border-border rounded flex items-center justify-center hover:bg-[#e8e8e8]'
        >
          +
        </button>
      </div>
    </div>
  );
}
