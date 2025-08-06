"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { ProductVariantEditModal } from "./ProductVariantEditModal";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { TProduct } from "@/types";

interface ProductVariantDialogProps {
  open: boolean;
  onClose: () => void;
  editingVariant: TProduct | null;
}

export function ProductVariantDialog({ open, onClose, editingVariant }: ProductVariantDialogProps) {
  const t = useTranslations("Admin.products");
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(t("refreshSuccess") || "Data refreshed successfully");
    } catch (error) {
      toast.error(t("refreshError") || "Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {t("productVariants") || "Product Variants"}
            </DialogTitle>
            <DialogDescription>
              {t("manageProductVariants") || "Manage variants for this product"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-gray-600 text-center">
              {t("productVariantInfo") || `Managing variants for: ${editingVariant?.name || editingVariant?.title || "Product"}`}
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? (t("refreshing") || "Refreshing...") : (t("refresh") || "Refresh")}
              </Button>

              <Button
                onClick={handleOpenEditModal}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("addVariant") || "Add Variant"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProductVariantEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        variant={null}
        productName={editingVariant?.name || editingVariant?.title}
        productId={editingVariant?.id}
      />
    </>
  );
}
