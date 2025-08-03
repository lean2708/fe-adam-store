'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import ReviewItem from './(Reviews)/ReviewItem';
import useReviews from '@/hooks/(product_details)/useReviews';
import ImagePreviewModal from './(Reviews)/ImagePreviewModal';

export default function Reviews({ productId }: { productId: string }) {
  const pageSize = 4; // !Số lượng đánh giá trên mỗi trang
  const {
    reviews,
    totalItems,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    // Modal state and handlers
    selectedReview,
    selectedImageIndex,
    isModalOpen,
    handleImageClick,
    handleCloseModal,
    handlePrevImage,
    handleNextImage,
    handleThumbnailClick,
  } = useReviews(productId, pageSize);

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id='reviews' className='space-y-6'>
      <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-primary'>
        Đánh giá ({totalItems})
      </h1>

      {loading ? (
        <div className='space-y-6'>
          {[...Array(pageSize)].map((_, index) => (
            <div
              key={index}
              className='border-border animate-pulse p-6 rounded-lg bg-gray-50'
            >
              <div className='flex justify-between gap-2 mb-4'>
                <div className='flex flex-row gap-6 items-center'>
                  <Skeleton className='w-12 h-12 rounded-full' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                </div>
                <div className='flex gap-2'>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='w-5 h-5' />
                  ))}
                </div>
              </div>
              <div className='flex gap-4 mb-3'>
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className='w-24 h-24' />
                ))}
              </div>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className='text-gray-500'>Chưa có đánh giá nào cho sản phẩm này.</p>
      ) : (
        <div className='-space-y-3'>
          {reviews.map((review) => (
            <div
              key={review.id}
              className='first:border-t-0 border-t-2 border-border'
            >
              <ReviewItem review={review} onImageClick={handleImageClick} />
            </div>
          ))}

          {totalItems >= pageSize && totalPages > 1 && (
            <div className='mt-6'>
              <Pagination>
                <PaginationContent>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i);
                          scrollToReviews();
                        }}
                        isActive={i === currentPage}
                        className='cursor-pointer'
                        href='#reviews'
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        review={selectedReview}
        selectedImageIndex={selectedImageIndex}
        onPrevImage={handlePrevImage}
        onNextImage={handleNextImage}
        onThumbnailClick={handleThumbnailClick}
      />
    </div>
  );
}
