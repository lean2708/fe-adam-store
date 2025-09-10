import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageBasic } from '@/api-client';

export default function GalleryThumbnails({
  images,
  current,
  allLoaded,
  onSelect,
}: {
  images: ImageBasic[];
  current: number;
  allLoaded: boolean;
  onSelect: (index: number) => void;
}) {
  if (!allLoaded) {
    return (
      <div className='flex flex-col gap-2 min-w-[80px]'>
        {Array.from({ length: images.length || 4 }).map((_, idx) => (
          <Skeleton key={idx} className='w-20 h-20 mb-2 rounded' />
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 min-w-[80px]'>
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-20 h-20 bg-muted-foreground rounded overflow-hidden border-2 relative shadow-md hover:shadow-lg ${
            current === index + 1
              ? 'border-[#0e3bac] shadow-lg'
              : 'border-transparent'
          } hover:border-[#0e3bac] transition-all duration-200`}
        >
          <Image
            src={image?.imageUrl || '/imgs/placeholder.png'}
            alt={`Product view ${index + 1}`}
            width={80}
            height={80}
            className='w-full h-full object-cover'
            loading='lazy'
            sizes='80px'
            unoptimized
          />
        </button>
      ))}
    </div>
  );
}
