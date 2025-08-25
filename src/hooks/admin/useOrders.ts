"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  searchOrdersForAdminAction,
  deleteOrderAction,
  cancelOrderAdminAction
} from "@/actions/orderActions";
import { SearchOrdersForAdminOrderStatusEnum } from "@/types";

export function useOrders(
  page: number = 0,
  size: number = 10,
  statusFilter: SearchOrdersForAdminOrderStatusEnum | "ALL" = "ALL"
) {
  const t = useTranslations("Admin.orders");
  const queryClient = useQueryClient();

  // Query for fetching orders
  const {
    data: orderData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['orders', page, size, statusFilter],
    queryFn: async () => {
      // Get orders for the current month by default
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const startDate = startOfMonth.toISOString().split('T')[0];
      const endDate = endOfMonth.toISOString().split('T')[0];

      const result = await searchOrdersForAdminAction(
        startDate,
        endDate,
        page,
        size,
        ["id,desc"],
        statusFilter === "ALL" ? undefined : statusFilter
      );

      if (!result.success) {
        throw new Error(result.message || "Failed to load orders");
      }
      return result || { items: [], totalItems: 0, totalPages: 0 };
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteOrderAction(parseInt(id));
      if (!result.success) {
        throw new Error(result.message || "Failed to delete order");
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("orderDeletedSuccess"));
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      console.log("Error deleting order:", error);
      toast.error(error.message);
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await cancelOrderAdminAction(parseInt(id));
      if (!result.success) {
        throw new Error(result.message || "Failed to cancel order");
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("orderCancelledSuccess"));
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      console.log("Error cancelling order:", error);
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t("deleteOrderConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = (id: string) => {
    if (confirm(t("cancelOrderConfirm"))) {
      cancelMutation.mutate(id);
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
    orders: orderData?.data || [],
    totalElements: orderData?.actionSizeResponse?.totalItems || 0,
    totalPages: orderData?.actionSizeResponse?.totalPages || 0,
    loading,
    handleDelete,
    handleCancel,
    handleRestore,
    handleRefresh,
    isDeleting: deleteMutation.isPending,
    isCancelling: cancelMutation.isPending
  };
}
