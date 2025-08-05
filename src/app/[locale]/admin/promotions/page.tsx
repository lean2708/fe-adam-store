"use client";

import { useState } from "react";
import { PromotionHeader } from "@/components/templates/admin/promotions/PromotionHeader";
import { PromotionStats } from "@/components/templates/admin/promotions/PromotionStats";
import { PromotionTable } from "@/components/templates/admin/promotions/PromotionTable";
import { PromotionDialog } from "@/components/templates/admin/promotions/PromotionDialog";
import { usePromotions } from "@/hooks/admin/usePromotions";
import { AdminPagination } from "@/components/ui/pagination";
import type { TPromotion } from "@/types";

export default function PromotionsAdminPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | "ALL">("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<TPromotion | null>(null);

  const {
    promotions,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh
  } = usePromotions(currentPage, 20, statusFilter);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // TODO: Implement search functionality when API supports it
  };

  const handleStatusFilterChange = (value: 'ACTIVE' | 'INACTIVE' | "ALL") => {
    setStatusFilter(value);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleCreatePromotion = () => {
    setEditingPromotion(null);
    setIsDialogOpen(true);
  };

  const handleEditPromotion = (promotion: TPromotion) => {
    setEditingPromotion(promotion);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPromotion(null);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PromotionHeader
            onRefresh={handleRefresh}
            onCreatePromotion={handleCreatePromotion}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PromotionStats
            promotions={promotions}
            totalElements={totalElements}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <PromotionTable
            promotions={promotions}
            loading={loading}
            onEdit={handleEditPromotion}
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
            itemName="promotions"
          />
        )}

        <PromotionDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          editingPromotion={editingPromotion}
        />
      </div>
    </div>
  );
}
