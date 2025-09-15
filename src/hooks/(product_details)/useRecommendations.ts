import { useState, useEffect } from 'react';
import { TProduct } from '@/types';
import { getAllProductsAction } from '@/actions/productActions';

export default function useRecommendations() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const randomPage = Math.floor(Math.random() * 7);
        const response = await getAllProductsAction(randomPage, 10, [
          'soldQuantity,desc',
        ]);

        if (response.status === 200 && response.products) {
          setProducts(response.products);
        }
      } catch (error) {
        console.error('Failed to fetch recommend products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
}
