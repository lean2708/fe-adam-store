"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  getAllBranchesAction,
  deleteBranchAction,
  restoreBranchesAction,
} from "@/actions/branchActions";

export function useBranches() {
  const t = useTranslations("Admin.branches");
  const queryClient = useQueryClient();

  // Query for fetching branches
  const {
    data: branches = [],
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const result = await getAllBranchesAction();
      if (!result.success) {
        throw new Error(result.message || "Failed to load branches");
      }
      return result.data || [];
    },
  });

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
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
    isDeleting: deleteMutation.isPending
  };
}
