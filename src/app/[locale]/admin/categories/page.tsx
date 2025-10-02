'use client';

import { useState } from 'react';

import { useCategories } from '@/hooks/admin/useCategories';

import type { TCategory } from '@/types';
import dynamic from 'next/dynamic';

const CategoriesTable = dynamic(
  () =>
    import('@/components/templates/admin/categories/CategoriesTable').then(
      (mod) => ({ default: mod.CategoriesTable })
    ),
  {
    loading: () => (
      <div className='h-[350px] flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    ),
    ssr: false,
  }
);

const CategoryModal = dynamic(() =>
  import('@/components/templates/admin/categories/CategoryModal').then(
    (mod) => ({ default: mod.CategoryModal })
  )
);

export default function CategoriesAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(0);

  const {
    categories,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
  } = useCategories(currentPage, 20);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: TCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 border rounded-lg'>
      <div className='admin-page-container space-y-6 mt-4 dark:bg-gray-900'>
        <div className='bg-white  shadow-sm  dark:bg-gray-900'>
          <CategoriesTable
            categories={categories}
            loading={loading}
            onEdit={handleEditCategory}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onRefresh={handleRefresh}
            onCreateCategory={handleCreateCategory}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
          />
        </div>

        <CategoryModal
          open={isModalOpen}
          onClose={handleCloseModal}
          editingCategory={editingCategory}
        />
      </div>
    </div>
  );
}
