'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { TReview } from '@/types';
import { useTranslations } from 'next-intl';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: TReview | null;
  selectedImageIndex: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onThumbnailClick: (index: number) => void;
}

export default function ImagePreviewModal({
  isOpen,
  onClose,
  review,
  selectedImageIndex,
  onPrevImage,
  onNextImage,
  onThumbnailClick,
}: ImagePreviewModalProps) {
  const t = useTranslations('Marketing.product_details');

  if (!review || !review.imageUrls) return null;

  const images = Object.values(review.imageUrls) as string[];
  const currentImage = images[selectedImageIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-6xl w-full h-[80vh] bg-background '>
        <DialogTitle className='hidden'></DialogTitle>
        <DialogDescription className='hidden'></DialogDescription>

        <div className='flex h-full'>
          {/* Left Side - Image Display */}
          <div className='flex-1 bg-muted relative flex items-center justify-center w-full max-w-screen-md mx-auto'>
            {/* Main Image */}
            <div className='relative flex items-center  justify-center  w-full aspect-square max-w-[500px] '>
              <Image
                src={currentImage || '/placeholder.svg'}
                alt={`Review image ${selectedImageIndex + 1} by ${
                  review.userName || 'Người dùng'
                }`}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 500px'
                className='object-contain  '
                priority={true}
              />
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={onPrevImage}
                  className='absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-muted-foreground/20 hover:bg-muted-foreground/30 rounded-full flex items-center justify-center transition-colors'
                  aria-label='Ảnh trước'
                >
                  <ChevronLeft className='w-6 h-6 text-primary' />
                </button>
                <button
                  onClick={onNextImage}
                  className='absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-muted-foreground/20 hover:bg-muted-foreground/30 rounded-full flex items-center justify-center transition-colors'
                  aria-label='Ảnh tiếp theo'
                >
                  <ChevronRight className='w-6 h-6 text-primary' />
                </button>
              </>
            )}
          </div>

          {/* Right Side - Review Details */}
          <div className='w-96 bg-background border-l border-border flex flex-col overflow-y-auto'>
            {/* Review Content */}
            <div className='flex-1 p-6 overflow-y-auto'>
              {/* User Info */}
              <div className='flex items-center gap-3 mb-4'>
                <Avatar className='w-10 h-10'>
                  <AvatarImage
                    src={review.userAvatarUrl || '/placeholder.svg'}
                  />
                  <AvatarFallback>
                    {review.userName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-bold text-primary'>
                    {review.userName || 'Người dùng'}
                  </div>
                  <div
                    className='flex items-center gap-1'
                    role='img'
                    aria-label={`${review.rating || 0} sao`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (review.rating || 0)
                            ? 'fill-[#feca38] text-[#feca38]'
                            : 'text-[#e0e0e0]'
                        }`}
                        aria-hidden='true'
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Date */}
              <p className='text-sm text-muted-foreground mb-4'>
                {t('reviews.images_preview.review_date')}: {review.updatedAt}
              </p>

              {/* Review Text */}
              <p className='text-primary leading-relaxed mb-6'>
                {review.comment}
              </p>

              {/* Images in this review */}
              <div>
                <h4 className='font-bold text-primary mb-3'>
                  {t('reviews.images_preview.images_in_this_review')}
                </h4>
                <div
                  className='flex gap-2 flex-wrap'
                  role='group'
                  aria-label='Thumbnails ảnh đánh giá'
                >
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => onThumbnailClick(index)}
                      className={`w-16 h-16 rounded overflow-hidden border-2 transition-all shadow-md hover:shadow-lg ${
                        index === selectedImageIndex
                          ? 'border-primary'
                          : 'border-border hover:border-primary'
                      }`}
                      aria-label={`Xem ảnh ${index + 1}`}
                      aria-pressed={index === selectedImageIndex}
                    >
                      <img
                        src={img || '/placeholder.svg'}
                        alt={`Review thumbnail ${index + 1}`}
                        className='w-full h-full object-cover'
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
