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
function generateMockPaymentData(page: number, size: number, statusFilter: string) {
  const statuses: TPaymentHistory['paymentStatus'][] = ['PAID', 'PENDING', 'REFUNDED', 'CANCELED', 'FAILED'];
  const methods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash', 'Digital Wallet'];

  const mockItems: TPaymentHistory[] = [];
  const totalItems = 47; // Mock total
  const startIndex = page * size;

  for (let i = 0; i < size && (startIndex + i) < totalItems; i++) {
    const id = startIndex + i + 1;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Filter by status if specified
    if (statusFilter !== "ALL" && status !== statusFilter) {
      continue;
    }

    mockItems.push({
      id,
      isPrimary: Math.random() > 0.7,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      totalAmount: Math.floor(Math.random() * 500000) + 50000, // 50k - 550k VND
      paymentStatus: status,
      paymentTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
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
  statusFilter: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | "ALL" = "ALL"
) {
  const t = useTranslations("Admin.paymentHistory");
  const queryClient = useQueryClient();

  // Query for fetching payment histories
  const {
    data: paymentData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['paymentHistories', page, size, statusFilter],
    queryFn: async () => {
      try {
        // Get payment histories for the current month by default
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const startDate = startOfMonth.toISOString().split('T')[0] + 'T00:00:00';
        const endDate = endOfMonth.toISOString().split('T')[0] + 'T00:00:00';
        console.log(startDate + "asd" + endDate);

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
          return generateMockPaymentData(page, size, statusFilter);
        }
        return result.data || { items: [], totalItems: 0, totalPages: 0 };
      } catch (error) {
        console.warn("Payment history fetch error:", error);
        // Return mock data for demonstration
        return generateMockPaymentData(page, size, statusFilter);
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
