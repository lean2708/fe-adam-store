"use client";

import { useState } from "react";

import { PromotionTable } from "@/components/templates/admin/promotions/PromotionTable";
import { PromotionModal } from "@/components/templates/admin/promotions/PromotionModal";
import { usePromotions } from "@/hooks/admin/usePromotions";

import type { TPromotion } from "@/types";

export default function PromotionsAdminPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<TPromotion | null>(null);

  const {
    promotions,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh
  } = usePromotions(currentPage, 20, statusFilter, searchTerm);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleStatusFilterChange = (value: 'ACTIVE' | 'INACTIVE' | "ALL") => {
    setStatusFilter(value);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleCreatePromotion = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleEditPromotion = (promotion: TPromotion) => {
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6 mt-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <PromotionTable
            promotions={promotions}
            loading={loading}
            onRefresh={handleRefresh}
            onCreatePromotion={handleCreatePromotion}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onEdit={handleEditPromotion}
            onDelete={handleDelete}
            onRestore={handleRestore}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
          />
        </div>

        <PromotionModal
          open={isModalOpen}
          onClose={handleCloseModal}
          editingPromotion={editingPromotion}
        />
      </div>
    </div>
  );
}
