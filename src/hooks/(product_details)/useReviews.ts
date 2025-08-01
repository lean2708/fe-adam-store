import { useState, useEffect } from 'react';
import { getProductReviewsAction } from '@/actions/reviewActions';
import { ReviewResponse } from '@/api-client';

export default function useReviews(productId: string, pageSize: number) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
  }, [productId, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return {
    reviews,
    totalItems,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
  };
}
