import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { TReview } from '@/types';

interface ReviewItemProps {
  review: TReview;
  onImageClick: (review: TReview, imageIndex: number) => void;
}

export default function ReviewItem({ review, onImageClick }: ReviewItemProps) {
  return (
    <Card className='border-border'>
      <CardContent className='p-6'>
        <div className='flex items-start gap-4'>
          <div className='flex-1'>
            <div className='flex justify-between gap-2 mb-4'>
              <div className='flex flex-row gap-6 items-center'>
                <Avatar className='size-12 ml-2'>
                  <AvatarImage
                    src={review.userAvatarUrl || '/placeholder.svg'}
                    alt={review.userName || 'User Avatar'}
                  />
                  <AvatarFallback>
                    {review.userName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='font-bold text-primary'>
                    {review.userName || 'Người dùng'}
                  </span>
                  <span className='text-muted-foreground'>
                    {review.updatedAt}
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-5 ${
                      i < (review.rating || 0)
                        ? 'fill-[#feca38] text-[#feca38]'
                        : 'text-[#e0e0e0]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {review.imageUrls && Object.keys(review.imageUrls).length > 0 && (
              <div className='flex gap-4 mb-3 flex-wrap'>
                {Object.values(review.imageUrls).map((img: string, i) => (
                  <button
                    key={i}
                    onClick={() => onImageClick(review, i)}
                    className='size-24 bg-muted rounded overflow-hidden hover:opacity-80 transition-opacity cursor-pointer border border-border shadow-md hover:shadow-lg'
                  >
                    <img
                      src={img}
                      alt={`Review image ${i + 1}`}
                      className='w-full h-full object-cover'
                      loading='lazy'
                    />
                  </button>
                ))}
              </div>
            )}

            <p className='text-primary text-base'>{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
