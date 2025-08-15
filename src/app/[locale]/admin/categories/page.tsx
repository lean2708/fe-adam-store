"use client";

import { useState } from "react";


import { CategoriesTable } from "@/components/templates/admin/categories/CategoriesTable";
import { CategoryModal } from "@/components/templates/admin/categories/CategoryModal";
import { useCategories } from "@/hooks/admin/useCategories";

import type { TCategory } from "@/types";

export default function CategoriesAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const { categories, totalElements, totalPages, loading, handleDelete, handleRestore, handleRefresh } = useCategories(currentPage, 20);

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
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6 mt-4">
        <div className="bg-white rounded-lg shadow-sm border">
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
