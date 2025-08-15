"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { ProductVariantEditModal } from "./ProductVariantEditModal";
import { RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import type { TProduct } from "@/types";

interface ProductVariantModalProps {
  open: boolean;
  onClose: () => void;
  editingVariant: TProduct | null;
}

export function ProductVariantModal({ open, onClose, editingVariant }: ProductVariantModalProps) {
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
      <Modal 
        open={open} 
        onClose={onClose}
        variant="centered"
        size="md"
        showOverlay={true}
        closeOnClickOutside={true}
      >
        <ModalHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {t("productVariants") || "Product Variants"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t("manageProductVariants") || "Manage variants for this product"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </ModalHeader>

        <ModalBody>
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
                className="px-6 py-2 bg-black hover:bg-gray-800 text-white"
              >
                {t("addVariant") || "Add Variant"}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

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
