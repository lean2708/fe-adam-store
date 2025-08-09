"use client";

import { useState } from "react";
import { CategoriesHeader } from "@/components/templates/admin/categories/CategoriesHeader";
import { CategoriesStats } from "@/components/templates/admin/categories/CategoriesStats";
import { CategoriesTable } from "@/components/templates/admin/categories/CategoriesTable";
import { CategoryDialog } from "@/components/templates/admin/categories/CategoryDialog";
import { useCategories } from "@/hooks/admin/useCategories";
import { AdminPagination } from "@/components/ui/pagination";
import type { TCategory } from "@/types";

export default function CategoriesAdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: TCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <CategoriesHeader 
            onRefresh={handleRefresh}
            onCreateCategory={handleCreateCategory}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <CategoriesStats 
            categories={categories}
            totalElements={totalElements}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <CategoriesTable 
            categories={categories}
            loading={loading}
            onEdit={handleEditCategory}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        </div>

        {totalPages > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalElements}
            itemsPerPage={20}
            itemName="categories"
          />
        )}

        <CategoryDialog 
          open={isDialogOpen}
          onClose={handleCloseDialog}
          editingCategory={editingCategory}
        />
      </div>
    </div>
  );
}
