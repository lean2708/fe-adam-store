import Image from 'next/image';

interface ProductItemProps {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: string;
  image: string;
}

export function ProductItem({
  name,
  color,
  size,
  quantity,
  price,
  image,
}: ProductItemProps) {
  return (
    <div className='flex gap-4'>
      <Image
        width={134}
        height={180}
        src={image || '/placeholder.svg'}
        alt={name}
        className='w-32 h-44 object-cover rounded-lg'
        loading='lazy'
      />
      <div className='flex-1'>
        <h4 className='font-bold text-primary mb-1 line-clamp-1'>{name}</h4>
        <p className=' text-muted-foreground mb-1'>Màu sắc: {color}</p>
        <p className=' text-muted-foreground mb-1'>Kích cỡ: {size}</p>
        <p className=' text-muted-foreground'>Số lượng: {quantity}</p>
      </div>
      <div className='text-right'>
        <p className='font-bold text-primary'>{price}</p>
      </div>
    </div>
  );
}
