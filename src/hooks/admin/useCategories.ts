"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  fetchAllCategoriesForAdminAction,
  deleteCategoryAction,
  restoreCategoryAction
} from "@/actions/categoryActions";

export function useCategories(page: number = 0, size: number = 20) {
  const t = useTranslations("Admin.categories");
  const queryClient = useQueryClient();

  // Query for fetching categories
  const {
    data: categoryData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['categories', page, size],
    queryFn: async () => {
      const result = await fetchAllCategoriesForAdminAction(page, size);
      if (!result.success) {
        throw new Error(result.message || "Failed to load categories");
      }
      return result;
    },
  });

  // Extract data with fallbacks
  const categories = categoryData?.data || [];
  const totalElements = categoryData?.actionSizeResponse?.totalItems || 0;
  const totalPages = categoryData?.actionSizeResponse?.totalPages || 0;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteCategoryAction(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete category");
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("categoryDeleted") || "Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await restoreCategoryAction(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to restore category");
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("categoryRestored") || "Category restored successfully");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleRestore = (id: number) => {
    restoreMutation.mutate(id);
  };

  const handleRefresh = () => {
    refetch();
  };

  return {
    categories,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
    isDeleting: deleteMutation.isPending,
    isRestoring: restoreMutation.isPending,
  };
}
