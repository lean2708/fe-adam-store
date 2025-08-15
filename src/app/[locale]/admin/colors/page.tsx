"use client";

import { useState } from "react";


import { ColorsTable } from "@/components/templates/admin/colors/ColorsTable";
import { ColorModal } from "@/components/templates/admin/colors/ColorModal";
import { useColors } from "@/hooks/admin/useColors";

import type { TColor } from "@/types";

export default function ColorsAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<TColor | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const { colors, totalElements, totalPages, loading, handleDelete, handleRestore, handleRefresh } = useColors(currentPage, 20);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreateColor = () => {
    setEditingColor(null);
    setIsModalOpen(true);
  };

  const handleEditColor = (color: TColor) => {
    setEditingColor(color);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingColor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6 mt-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <ColorsTable
            colors={colors}
            loading={loading}
            onEdit={handleEditColor}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onRefresh={handleRefresh}
            onCreateColor={handleCreateColor}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
          />
        </div>

        <ColorModal
          open={isModalOpen}
          onClose={handleCloseModal}
          editingColor={editingColor}
        />
      </div>
    </div>
  );
}
