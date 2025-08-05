"use client";

import { useState } from "react";
import { ColorsHeader } from "@/components/templates/admin/colors/ColorsHeader";
import { ColorsStats } from "@/components/templates/admin/colors/ColorsStats";
import { ColorsTable } from "@/components/templates/admin/colors/ColorsTable";
import { ColorDialog } from "@/components/templates/admin/colors/ColorDialog";
import { useColors } from "@/hooks/admin/useColors";
import { AdminPagination } from "@/components/ui/pagination";
import type { TColor } from "@/types";

export default function ColorsAdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setIsDialogOpen(true);
  };

  const handleEditColor = (color: TColor) => {
    setEditingColor(color);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingColor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ColorsHeader 
            onRefresh={handleRefresh}
            onCreateColor={handleCreateColor}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ColorsStats 
            colors={colors}
            totalElements={totalElements}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <ColorsTable 
            colors={colors}
            loading={loading}
            onEdit={handleEditColor}
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
            itemName="colors"
          />
        )}

        <ColorDialog 
          open={isDialogOpen}
          onClose={handleCloseDialog}
          editingColor={editingColor}
        />
      </div>
    </div>
  );
}
