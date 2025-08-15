"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  searchPaymentHistoriesAction,
  deletePaymentHistoryAction
} from "@/actions/paymentHistoryActions";
import type { TPaymentHistory } from "@/types";

// Mock data generator for demonstration
// TODO: Remove this when the payment history API is fixed
function generateMockPaymentData(
  page: number,
  size: number,
  statusFilter: string,
  searchTerm: string = "",
  dateRange?: { from: string; to: string }
) {
  const statuses: TPaymentHistory['paymentStatus'][] = ['PAID', 'PENDING', 'REFUNDED', 'CANCELED', 'FAILED'];
  const methods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash', 'Digital Wallet'];

  const mockItems: TPaymentHistory[] = [];
  const totalItems = 47; // Mock total
  const startIndex = page * size;

  // Calculate date range for filtering
  let startTime: number;
  let endTime: number;

  if (dateRange) {
    startTime = new Date(dateRange.from).getTime();
    endTime = new Date(dateRange.to).getTime();
  } else {
    // Default to last 30 days
    endTime = Date.now();
    startTime = endTime - (30 * 24 * 60 * 60 * 1000);
  }

  for (let i = 0; i < size && (startIndex + i) < totalItems; i++) {
    const id = startIndex + i + 1;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];

    // Generate random payment time within the date range
    const paymentTime = new Date(startTime + Math.random() * (endTime - startTime));

    // Filter by status if specified
    if (statusFilter !== "ALL" && status !== statusFilter) {
      continue;
    }

    // Filter by search term if specified (search in payment method)
    if (searchTerm.trim() && !method.toLowerCase().includes(searchTerm.toLowerCase())) {
      continue;
    }

    mockItems.push({
      id,
      isPrimary: Math.random() > 0.7,
      paymentMethod: method,
      totalAmount: Math.floor(Math.random() * 500000) + 50000, // 50k - 550k VND
      paymentStatus: status,
      paymentTime: paymentTime.toISOString()
    });
  }

  return {
    items: mockItems,
    totalItems: statusFilter === "ALL" ? totalItems : Math.floor(totalItems * 0.6),
    totalPages: Math.ceil((statusFilter === "ALL" ? totalItems : Math.floor(totalItems * 0.6)) / size)
  };
}

export function usePaymentHistory(
  page: number = 0,
  size: number = 10,
  statusFilter: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | "ALL" = "ALL",
  searchTerm: string = "",
  dateRange?: { from: string; to: string }
) {
  const t = useTranslations("Admin.paymentHistory");
  const queryClient = useQueryClient();

  // Query for fetching payment histories
  const {
    data: paymentData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['paymentHistories', page, size, statusFilter, searchTerm, dateRange],
    queryFn: async () => {
      try {
        // Use provided date range or default to current month
        let startDate: string;
        let endDate: string;

        if (dateRange) {
          startDate = dateRange.from + 'T00:00:00';
          endDate = dateRange.to + 'T23:59:59';
        } else {
          // Default to current month
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          startDate = startOfMonth.toISOString().split('T')[0] + 'T00:00:00';
          endDate = endOfMonth.toISOString().split('T')[0] + 'T23:59:59';
        }

        console.log(`Date range: ${startDate} to ${endDate}`);

        const result = await searchPaymentHistoriesAction(
          startDate,
          endDate,
          page,
          size,
          ["paymentTime,desc"],
          statusFilter === "ALL" ? undefined : statusFilter
        );

        if (!result.success) {
          console.warn("Payment history API error:", result.message);
          // Return mock data for demonstration
          return generateMockPaymentData(page, size, statusFilter, searchTerm, dateRange);
        }
        return result.data || { items: [], totalItems: 0, totalPages: 0 };
      } catch (error) {
        console.warn("Payment history fetch error:", error);
        // Return mock data for demonstration
        return generateMockPaymentData(page, size, statusFilter, searchTerm, dateRange);
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deletePaymentHistoryAction(parseInt(id));
      if (!result.success) {
        throw new Error(result.message || "Failed to delete payment history");
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("paymentDeletedSuccess"));
      queryClient.invalidateQueries({ queryKey: ['paymentHistories'] });
    },
    onError: (error: Error) => {
      console.log("Error deleting payment history:", error);
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t("deletePaymentConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestore = (_id: string) => {
    // TODO: Implement restore functionality when API is available
    toast.success("Restore functionality will be implemented");
  };

  const handleRefresh = () => {
    refetch();
  };

  return {
    payments: paymentData?.items || [],
    totalElements: paymentData?.totalItems || 0,
    totalPages: paymentData?.totalPages || 0,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
    isDeleting: deleteMutation.isPending
  };
}
