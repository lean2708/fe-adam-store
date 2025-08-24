"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  deleteUserAction,
  fetchAllUsersAction,
  restoreUserAction,
} from "@/actions/userActions";

export function useUsers(page: number = 0, size: number = 20) {
  const t = useTranslations("Admin.users");
  const queryClient = useQueryClient();

  // Query for fetching users
  const {
    data: userData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['users', page, size],
    queryFn: async () => {
      const result = await fetchAllUsersAction(page, size, ["id,desc"]);
      if (!result.success) {
        throw new Error(result.message || "Failed to load users");
      }
      return result;
    },
  });

  const users = userData?.data || [];
  const totalElements = userData?.actionSizeResponse?.totalItems || 0;
  const totalPages = userData?.actionSizeResponse?.totalPages || 0;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteUserAction(Number(id));

      if (!result.success) {
        throw new Error(result.message || "Failed to delete user");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      console.log("Error deleting user:", error);
      toast.error(error.message);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await restoreUserAction(Number(id));
      if (!result.success) {
        throw new Error(result.message || "Failed to restore user");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("User restored successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t("deleteUserConfirm"))) {
      deleteMutation.mutate(Number(id));
    }
  };

  const handleRestore = (_id: string) => {
    restoreMutation.mutate(_id);
  };

  const handleRefresh = () => {
    refetch();
  };

  return {
    users,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
    isDeleting: deleteMutation.isPending
  };
}
