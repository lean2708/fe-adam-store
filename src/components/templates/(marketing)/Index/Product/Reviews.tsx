'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { useEffect, useState } from 'react';
import { getProductReviewsAction } from '@/actions/productActions';
import { Skeleton } from '@/components/ui/skeleton';

export default function Reviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 4; // !Số lượng review trên mỗi trang

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getProductReviewsAction(
          productId,
          currentPage,
          pageSize,
          ['createdAt,desc']
        );

        if (response.status === 200) {
          setReviews(response.reviews?.items || []);
          setTotalItems(response.reviews?.totalItems || 0);
          setTotalPages(response.reviews?.totalPages || 0);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold text-primary'>
          Đang tải đánh giá...
        </h2>
        {[...Array(pageSize)].map((_, index) => (
          <Card key={index} className='border-border animate-pulse'>
            <CardContent className='p-6'>
              <div className='flex items-start gap-4'>
                <div className='flex-1 space-y-4'>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div id='reviews' className='space-y-6'>
      <h2 className='text-2xl font-bold text-primary'>
        Đánh giá ({totalItems})
      </h2>

      <div className='space-y-1'>
        {reviews.length === 0 ? (
          <p className='text-gray-500'>
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        ) : (
          <div className='space-y-1'>
            {reviews.map((review) => (
              <Card key={review.id} className='border-border'>
                <CardContent className='p-6'>
                  <div className='flex items-start gap-4'>
                    <div className='flex-1'>
                      <div className='flex justify-between gap-2 mb-4'>
                        <div className='flex flex-row gap-6 items-center'>
                          {/* Avatar */}
                          <Avatar className='size-12 ml-2'>
                            <AvatarImage
                              src={review.userAvatarUrl || '/placeholder.svg'}
                            />
                            <AvatarFallback>
                              {review.userName?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>

                          {/* Username */}
                          <div className='flex flex-col'>
                            <span className='font-bold text-primary'>
                              {review.userName || 'Người dùng'}
                            </span>
                            <span className='text-muted-foreground'>
                              {review.createdAt}
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
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

                      {/* Review Images */}
                      {review.imageUrls &&
                        Object.keys(review.imageUrls).length > 0 && (
                          <div className='flex gap-4 mb-3 flex-wrap'>
                            {Object.values(review.imageUrls).map((img, i) => (
                              <div
                                key={i}
                                className='size-24 bg-muted rounded overflow-hidden'
                              >
                                <img
                                  src={img as string}
                                  alt={`Review image ${i + 1}`}
                                  className='w-full h-full object-cover'
                                  loading='lazy'
                                />
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Comments */}
                      <p className='text-primary text-base'>{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Chỉ hiển thị phân trang khi có từ 4 reviews trở lên */}
            {totalItems >= 4 && totalPages > 1 && (
              <div className='mt-6'>
                <Pagination>
                  <PaginationContent>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i);
                            const reviewsSection =
                              document.getElementById('reviews');
                            if (reviewsSection) {
                              reviewsSection.scrollIntoView({
                                behavior: 'smooth',
                              });
                            }
                          }}
                          isActive={i === currentPage}
                          className='cursor-pointer'
                          href={'#reviews'}
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
      </div>
    </div>
  );
}
