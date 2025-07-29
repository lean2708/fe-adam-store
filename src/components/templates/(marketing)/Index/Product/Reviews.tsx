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

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: 'Minh Anh',
      avatar: '/placeholder.svg?height=40&width=40',
      rating: 5,
      comment:
        'Chất liệu vải rất tốt, form dáng đẹp, mặc rất thoải mái. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop tiếp.',
      images: [
        '/placeholder.svg?height=60&width=60',
        '/placeholder.svg?height=60&width=60',
        '/placeholder.svg?height=60&width=60',
      ],
    },
    {
      id: 2,
      name: 'Tuấn Minh',
      avatar: '/placeholder.svg?height=40&width=40',
      rating: 5,
      comment:
        'Áo đẹp, chất lượng tốt, đúng như mô tả. Size vừa vặn, form dáng đẹp. Giá cả hợp lý, sẽ mua thêm.',
      images: [
        '/placeholder.svg?height=60&width=60',
        '/placeholder.svg?height=60&width=60',
      ],
    },
    {
      id: 3,
      name: 'Thu Hương',
      avatar: '/placeholder.svg?height=40&width=40',
      rating: 4,
      comment:
        'Sản phẩm đẹp, chất lượng ổn. Giao hàng hơi chậm nhưng đóng gói cẩn thận. Nhìn chung hài lòng với sản phẩm.',
      images: [
        '/placeholder.svg?height=60&width=60',
        '/placeholder.svg?height=60&width=60',
        '/placeholder.svg?height=60&width=60',
        '/placeholder.svg?height=60&width=60',
      ],
    },
    {
      id: 4,
      name: 'Thu Hương',
      avatar: '/placeholder.svg?height=40&width=40',
      rating: 4,
      comment:
        'Sản phẩm đẹp, chất lượng ổn. Giao hàng hơi chậm nhưng đóng gói cẩn thận. Nhìn chung hài lòng với sản phẩm.',
      images: [
        '/placeholder.svg?height=60&width=60',
        '/placeholder.svg?height=60&width=60',
        '/placeholder.svg?height=60&width=60',
        '/placeholder.svg?height=60&width=60',
      ],
    },
  ];

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-[#262626]'>Đánh giá (33)</h2>

      <div className='space-y-1'>
        {reviews.map((review) => (
          <Card
            key={review.id}
            className={`border-border ${
              review.id === reviews[0].id ? '' : 'border-t-2'
            }`}
          >
            <CardContent className='p-6'>
              <div className='flex items-start gap-4'>
                <div className='flex-1'>
                  <div className='flex  justify-between gap-2 mb-4'>
                    <div className='flex flex-row gap-6 items-center'>
                      <Avatar className='size-12'>
                        <AvatarImage
                          src={review.avatar || '/placeholder.svg'}
                        />
                        <AvatarFallback>
                          <User className='size-10' />
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium text-[#262626]'>
                          {review.name}
                        </span>
                        <span>20/7/2025</span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-5 ${
                            i < review.rating
                              ? 'fill-[#feca38] text-[#feca38]'
                              : 'text-[#e0e0e0]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    {review.images.map((img, i) => (
                      <div
                        key={i}
                        className='w-16 h-16 bg-[#e8e8e8] rounded overflow-hidden'
                      >
                        <Image
                          src={img || '/placeholder.svg'}
                          alt={`Review image ${i + 1}`}
                          width={64}
                          height={64}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    ))}
                  </div>
                  <p className='text-[#757575] mt-3'>{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink href='#'>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#' isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#'>9</PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
