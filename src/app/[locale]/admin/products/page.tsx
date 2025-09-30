'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductHeader } from '@/components/templates/admin/products/ProductHeader';
import { ProductVariantsStats } from '@/components/templates/admin/products/ProductVariantsStats';
import { ProductVariantsTable } from '@/components/templates/admin/products/ProductVariantsTable';
import { ProductVariantModal } from '@/components/templates/admin/products/ProductVariantModal';
import { ProductCreateModal } from '@/components/templates/admin/products/ProductCreateModal';

import { useProducts } from '@/hooks/admin/useProductVariants';

import type { TProduct } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    products,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
  } = useProducts(currentPage, pageSize, searchTerm);

  const handleCreateProduct = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUpdateProduct = (product: TProduct) => {
    router.push(`/admin/products/${product.id}`);
  };

  const handleEditProduct = (product: TProduct) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (product: TProduct) => {
    router.push(`/admin/products/${product.id}`);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
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
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='admin-page-container space-y-6 dark:bg-gray-900'>
        <div className='bg-white rounded-lg shadow-sm border p-4 md:p-6 dark:bg-gray-900'>
          <ProductHeader
            onRefresh={handleRefresh}
            onCreateProduct={handleCreateProduct}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        <div className='bg-white rounded-lg shadow-sm border p-4 md:p-6 dark:bg-gray-900'>
          <ProductVariantsStats
            variants={products}
            totalElements={totalElements}
          />
        </div>

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

        <ProductVariantModal
          open={isDialogOpen}
          onClose={handleCloseDialog}
          editingVariant={editingProduct}
        />

        <ProductCreateModal
          open={isCreateModalOpen}
          onClose={handleCloseCreateModal}
        />
      </div>
    </div>
  );
}
