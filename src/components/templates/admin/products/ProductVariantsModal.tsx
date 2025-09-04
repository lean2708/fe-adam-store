"use client";

import { useState } from "react";
import { Modal, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { ProductVariantEditModal } from "./ProductVariantEditModal";
import { useTranslations, useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { TProduct } from "@/types";

interface ProductVariantsModalProps {
  open: boolean;
  onClose: () => void;
  product: TProduct | null;
}

export function ProductVariantsModal({
  open,
  onClose,
  product,
}: ProductVariantsModalProps) {
  const t = useTranslations("Admin.products");
  const locale = useLocale();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!product) return null;

  // Extract all variants from all colors
  const allVariants =
    product.colors?.flatMap(
      (color) =>
        color.variants?.map((variant) => ({
          ...variant,
          colorName: color.name,
          colorId: color.id,
        })) || []
    ) || [];

  const handleEditVariant = (variant: any) => {
    setEditingVariant(variant);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVariant(null);
    // Refresh the products data when modal closes
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    // Refresh the products data when modal closes
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("refreshSuccess") || "Data refreshed successfully");
    } catch (error) {
      toast.error(t("refreshError") || "Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Callback for when variant operations succeed
  const handleVariantSuccess = () => {
    // Force refresh the product data to update the variants display
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        variant="centered"
        size="xl"
        showOverlay={true}
        closeOnClickOutside={false}
        showCloseButton={true}
        className="bg-white rounded-lg shadow-xl max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t("productVariants") || "Biến thể sản phẩm"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title={t("refresh") || "Refresh"}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        <ModalBody className="p-6 overflow-auto max-h-[60vh]">
          <div className="overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-gray-900  ">
                    {t("id") || "ID"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900  ">
                    {t("product") || "Sản phẩm"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900  ">
                    {t("price") || "Giá"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900  ">
                    {t("quantity") || "Số lượng"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900  ">
                    {t("size") || "Size"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900  ">
                    {t("color") || "Màu Sắc"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900  ">
                    {t("actions") || "Hành động"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allVariants.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {t("noVariants") || "Không có biến thể nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  allVariants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <span className="font-mono text-sm">{variant.id}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {product.name || product.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {variant.price
                            ? formatCurrency(variant.price, locale)
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            (variant.quantity || 0) > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {variant.quantity || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {variant.size?.name || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {variant.colorName || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ActionDropdown
                          onEdit={() => handleEditVariant(variant)}
                          translationNamespace="Admin.products"
                          customEditLabel={t("editVariant") || "Sửa biến thể"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-center pt-4 border-t">
            <Button
              onClick={handleOpenAddModal}
              className="bg-black hover:bg-gray-900 text-white px-6 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("addVariant") || "Thêm biến thể"}
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* Edit Modal - Outside main modal to prevent nesting */}
      <ProductVariantEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        variant={editingVariant}
        productName={product.name || product.title}
        productId={product.id}
        onSuccess={handleVariantSuccess}
      />

      {/* Add Modal - Outside main modal to prevent nesting */}
      <ProductVariantEditModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        variant={null} // null for creating new variant
        productName={product.name || product.title}
        productId={product.id}
        onSuccess={handleVariantSuccess}
      />
    </>
  );
}
