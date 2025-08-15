"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  fetchAllPromotionsForAdminAction,
  searchPromotionsAction,
  deletePromotionAction,
  restorePromotionAction
} from "@/actions/promotionActions";

export function usePromotions(
  page: number = 0,
  size: number = 20,
  statusFilter: 'ACTIVE' | 'INACTIVE' | "ALL" = "ALL",
  searchTerm?: string
) {
  const t = useTranslations("Admin.promotions");
  const queryClient = useQueryClient();

  // Query for fetching promotions
  const {
    data: promotionData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['promotions', page, size, statusFilter, searchTerm],
    queryFn: async () => {
      let result;

      if (searchTerm && searchTerm.trim()) {
        // Use search API when there's a search term
        const searchCriteria = [
          `description~${searchTerm.trim()}`,
        ];
        result = await searchPromotionsAction(page, size, ["id,desc"], searchCriteria);
      } else {
        // Use regular fetch when no search term
        result = await fetchAllPromotionsForAdminAction(page, size, ["id,desc"]);
      }

      if (!result.success) {
        throw new Error(result.message || "Failed to load promotions");
      }

      let filteredItems = result.data || [];

      // Apply status filter on client side if needed
      if (statusFilter !== "ALL") {
        filteredItems = filteredItems.filter(promotion => promotion.status === statusFilter);
      }

      return {
        items: filteredItems,
        totalItems: result.actionSizeResponse?.totalItems || 0,
        totalPages: result.actionSizeResponse?.totalPages || 0
      };
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deletePromotionAction(parseInt(id));
      if (!result.success) {
        throw new Error(result.message || "Failed to delete promotion");
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("promotionDeletedSuccess"));
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (error: Error) => {
      console.log("Error deleting promotion:", error);
      toast.error(error.message);
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await restorePromotionAction(parseInt(id));
      if (!result.success) {
        throw new Error(result.message || "Failed to restore promotion");
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("promotionRestoredSuccess"));
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (error: Error) => {
      console.log("Error restoring promotion:", error);
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t("deletePromotionConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestore = (id: string) => {
    if (confirm(t("restorePromotionConfirm"))) {
      restoreMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return {
    promotions: promotionData?.items || [],
    totalElements: promotionData?.totalItems || 0,
    totalPages: promotionData?.totalPages || 0,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
    isDeleting: deleteMutation.isPending,
    isRestoring: restoreMutation.isPending
  };
}
