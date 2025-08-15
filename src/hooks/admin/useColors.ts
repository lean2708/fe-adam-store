"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  fetchAllColorsAction,
  deleteColorAction
} from "@/actions/colorActions";

export function useColors(page: number = 0, size: number = 20) {
  const t = useTranslations("Admin.colors");
  const queryClient = useQueryClient();

  // Query for fetching colors
  const {
    data: colorData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['colors', page, size],
    queryFn: async () => {
      const result = await fetchAllColorsAction(page, size);
      if (!result.success) {
        throw new Error(result.message || "Failed to load colors");
      }
      return result;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteColorAction(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete color");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Color deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
    onError: (error: Error) => {
      console.log("Error deleting color:", error);
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t("deleteColorConfirm"))) {
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
    colors: colorData?.data || [],
    totalElements: colorData?.actionSizeResponse?.totalItems || 0,
    totalPages: colorData?.actionSizeResponse?.totalPages || 0,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
    isDeleting: deleteMutation.isPending
  };
}
