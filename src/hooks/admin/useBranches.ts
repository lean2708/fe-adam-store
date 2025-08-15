"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  getAllBranchesAction,
  deleteBranchAction,
  restoreBranchesAction,
} from "@/actions/branchActions";

export function useBranches(page: number = 0, size: number = 20) {
  const t = useTranslations("Admin.branches");
  const queryClient = useQueryClient();

  // Query for fetching branches
  const {
    data: branchData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['branches', page, size],
    queryFn: async () => {
      const result = await getAllBranchesAction(page, size, ["id,desc"]);
      if (!result.success) {
        throw new Error(result.message || "Failed to load branches");
      }
      return result;
    },
  });

  const branches = branchData?.data || [];
  const totalElements = branchData?.actionSizeResponse?.totalItems || 0;
  const totalPages = branchData?.actionSizeResponse?.totalPages || 0;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteBranchAction(id);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete branch");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Branch deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (error: Error) => {
      console.log("Error deleting branch:", error);
      toast.error(error.message);
    },
  });
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await restoreBranchesAction(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete branch");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Branch deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t("deleteBranchConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestore = (_id: string) => {
    restoreMutation.mutate(_id);
    toast.success("Restore functionality will be implemented");
  };

  const handleRefresh = () => {
    refetch();
  };

  return {
    branches,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
    isDeleting: deleteMutation.isPending
  };
}
