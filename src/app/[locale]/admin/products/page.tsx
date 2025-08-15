"use client";

import { useState } from "react";
import { ProductHeader } from "@/components/templates/admin/products/ProductHeader";
import { ProductVariantsStats } from "@/components/templates/admin/products/ProductVariantsStats";
import { ProductVariantsTable } from "@/components/templates/admin/products/ProductVariantsTable";
import { ProductVariantModal } from "@/components/templates/admin/products/ProductVariantModal";
import { ProductVariantsModal } from "@/components/templates/admin/products/ProductVariantsModal";
import { ProductCreateModal } from "@/components/templates/admin/products/ProductCreateModal";
import { ProductUpdateModal } from "@/components/templates/admin/products/ProductUpdateModal";
import { useProducts } from "@/hooks/admin/useProductVariants";

import type { TProduct } from "@/types";

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [updatingProduct, setUpdatingProduct] = useState<TProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  const { products, totalElements, totalPages, loading, handleDelete, handleRestore, handleRefresh } = useProducts(currentPage, pageSize, searchTerm);

  const handleCreateProduct = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUpdateProduct = (product: TProduct) => {
    setUpdatingProduct(product);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUpdatingProduct(null);
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ProductHeader
            onRefresh={handleRefresh}
            onCreateProduct={handleCreateProduct}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ProductVariantsStats
            variants={products}
            totalElements={totalElements}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <ProductVariantsTable
            variants={products}
            loading={loading}
            onEdit={handleEditProduct}
            onUpdate={handleUpdateProduct}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onViewDetails={handleViewDetails}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

        <ProductVariantModal
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

        <ProductUpdateModal
          open={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          product={updatingProduct}
        />
      </div>
    </div>
  );
}
