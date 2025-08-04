import { useState, useEffect } from 'react';
import { getProductReviewsAction } from '@/actions/reviewActions';
import { TReview } from '@/types';

/**
 * Custom hook to manage product reviews, pagination, and image modal state.
 * @param productId - The ID of the product to fetch reviews for.
 * @param pageSize - Number of reviews per page.
 */
export default function useReviews(productId: string, pageSize: number) {
  // *State to store the list of reviews for the current page
  const [reviews, setReviews] = useState<TReview[]>([]);
  // *Total number of review items for the product
  const [totalItems, setTotalItems] = useState(0);
  // *Loading state for fetching reviews
  const [loading, setLoading] = useState(true);

  // *Current page index (zero-based)
  const [currentPage, setCurrentPage] = useState(0);
  // *Total number of pages available
  const [totalPages, setTotalPages] = useState(0);

  // *State for the currently selected review (for modal display)
  const [selectedReview, setSelectedReview] = useState<TReview | null>(null);
  // *Index of the currently selected image in the review's imageUrls
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // *Modal open/close state for image viewer
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  /**
   * TODO: Change the current page if the new page is within valid range.
   * @param newPage - The page index to switch to.
   */
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  /**
   * TODO: Open the image modal for a specific review and image index.
   * @param review - The review whose image is clicked.
   * @param imageIndex - The index of the clicked image.
   */
  const handleImageClick = (review: TReview, imageIndex: number) => {
    setSelectedReview(review);
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  /**
   * TODO: Close the image modal and reset selected review and image index.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    setSelectedImageIndex(0);
  };

  /**
   * TODO: Show the previous image in the modal, looping to the last image if at the start.
   */
  const handlePrevImage = () => {
    if (selectedReview && selectedReview.imageUrls) {
      const imageCount = Object.keys(selectedReview.imageUrls).length;
      setSelectedImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
    }
  };

  /**
   * TODO: Show the next image in the modal, looping to the first image if at the end.
   */
  const handleNextImage = () => {
    if (selectedReview && selectedReview.imageUrls) {
      const imageCount = Object.keys(selectedReview.imageUrls).length;
      setSelectedImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
    }
  };

  /**
   * TODO: Set the selected image index when a thumbnail is clicked in the modal.
   * @param index - The index of the thumbnail image.
   */
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return {
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
  };
}
