"use client";

import { useState } from "react";
import { ProductHeader } from "@/components/templates/admin/products/ProductHeader";
import { ProductVariantsStats } from "@/components/templates/admin/products/ProductVariantsStats";
import { ProductVariantsTable } from "@/components/templates/admin/products/ProductVariantsTable";
import { ProductVariantDialog } from "@/components/templates/admin/products/ProductVariantDialog";
import { ProductVariantsModal } from "@/components/templates/admin/products/ProductVariantsModal";
import { ProductCreateModal } from "@/components/templates/admin/products/ProductCreateModal";
import { useProducts } from "@/hooks/admin/useProductVariants";
import type { TProduct } from "@/types";

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);

  const { products, loading, handleDelete, handleRestore, handleRefresh } = useProducts();

  const handleCreateProduct = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };



  const handleEditProduct = (product: TProduct) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (product: TProduct) => {
    setSelectedProduct(product);
    setIsVariantsModalOpen(true);
  };



  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleCloseVariantsModal = () => {
    setIsVariantsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ProductHeader
            onRefresh={handleRefresh}
            onCreateProduct={handleCreateProduct}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ProductVariantsStats
            variants={products}
            totalElements={products.length}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <ProductVariantsTable
            variants={products}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onViewDetails={handleViewDetails}
          />
        </div>

        <ProductVariantDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          editingVariant={editingProduct}
        />

        <ProductVariantsModal
          open={isVariantsModalOpen}
          onClose={handleCloseVariantsModal}
          product={selectedProduct}
        />

        <ProductCreateModal
          open={isCreateModalOpen}
          onClose={handleCloseCreateModal}
        />
      </div>
    </div>
  );
}
