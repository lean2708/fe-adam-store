"use client";

import { useQuery } from "@tanstack/react-query";
import { getTopSellingProductsAction } from "@/actions/statisticsActions";
import type { TTopSelling } from "@/types";

interface UseTopProductsOptions {
  dateRange?: {
    from: string;
    to: string;
  };
  limit?: number;
  enabled?: boolean;
}

export function useTopProducts({
  dateRange,
  limit = 10,
  enabled = true
}: UseTopProductsOptions = {}) {
  
  // Generate date range if not provided
  const getDateRange = () => {
    if (dateRange) {
      return {
        startDate: dateRange.from,
        endDate: dateRange.to
      };
    }
    
    // Default to current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    };
  };

  const { startDate, endDate } = getDateRange();

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isRefetching
  } = useQuery({
    queryKey: ['top-products', startDate, endDate, limit],
    queryFn: async (): Promise<TTopSelling[]> => {
      const result = await getTopSellingProductsAction(startDate, endDate);
      
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch top selling products");
      }
      
      // Return limited results
      return (result.data || []).slice(0, limit);
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    products,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    isFetching,
    isRefetching,
    // Additional computed values
    hasProducts: products.length > 0,
    dateRange: { startDate, endDate }
  };
}
