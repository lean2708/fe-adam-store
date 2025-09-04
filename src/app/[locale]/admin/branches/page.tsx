"use client";

import { useState } from "react";

import { BranchesTable } from "@/components/templates/admin/branches/BranchesTable";
import { BranchModal } from "@/components/templates/admin/branches/BranchModal";
import { useBranches } from "@/hooks/admin/useBranches";
import type { TBranch } from "@/types";

export default function BranchesAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<TBranch | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    branches,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
  } = useBranches(currentPage, 20);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreateBranch = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEditBranch = (branch: TBranch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 rounded-lg border">
      <div className="admin-page-container space-y-6 mt-4 dark:bg-gray-900">
        <div className="bg-white  shadow-sm  dark:bg-gray-900">
          <BranchesTable
            branches={branches}
            loading={loading}
            onEdit={handleEditBranch}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onRefresh={handleRefresh}
            onCreateBranch={handleCreateBranch}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
          />
        </div>

        <BranchModal
          open={isModalOpen}
          onClose={handleCloseModal}
          editingBranch={editingBranch}
        />
      </div>
    </div>
  );
}
