'use client';

import Image from 'next/image';
import { Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ReviewResponse } from '@/api-client';
import { useEffect, useState } from 'react';
import { getProductReviewsAction } from '@/actions/productActions';

export default function Reviews({ productId }: { productId: string }) {
  const [productReviews, setProductReviews] = useState<ReviewResponse[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        const response = await getProductReviewsAction(productId, 0, 10, [
          'createdAt,desc',
        ]);

        setProductReviews(response.reviews ?? []);
        setTotalReviews(response.reviews?.length ?? 0);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <div className='w-full'>loading...</div>;
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-primary'>
        Đánh giá ({totalReviews})
      </h2>

      <div className='space-y-1'>
        {productReviews.length === 0 ? (
          <p className='text-gray-500'>
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        ) : (
          <div className='space-y-1'>
            {productReviews.map((review) => (
              <Card key={review.id} className='border-border'>
                <CardContent className='p-6'>
                  <div className='flex items-start gap-4'>
                    <div className='flex-1'>
                      <div className='flex justify-between gap-2 mb-4'>
                        <div className='flex flex-row gap-6 items-center'>
                          {/* Avatar */}
                          <Avatar className='size-12'>
                            <AvatarImage
                              src={review.userAvatarUrl || '/placeholder.svg'}
                            />
                            <AvatarFallback>
                              {review.userName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          {/* Username */}
                          <div className='flex flex-col'>
                            <span className='font-medium text-primary'>
                              {review.userName || 'Người dùng'}
                            </span>
                            <span>{review.createdAt}</span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className='flex gap-2'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`size-5 ${
                                i < review.rating!
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
                          <div className='flex gap-4 mb-3'>
                            {Object.values(review.imageUrls).map((img, i) => (
                              <div
                                key={i}
                                className='w-16 h-16 bg-muted rounded overflow-hidden'
                              >
                                <img
                                  src={img || '/imgs/landing-login-img.png'}
                                  alt={`Review image ${i + 1}`}
                                  className='w-full h-full object-cover'
                                />
                                <p className='text-red-500'>img:{img}</p>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Comments */}
                      <p className='text-muted-foreground'>{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination sẽ hiển thị khi reviews > 3 */}
            {totalReviews > 3 && (
              <div className='mt-6'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href='#' />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href='#' isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href='#'>2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href='#' />
                    </PaginationItem>
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
