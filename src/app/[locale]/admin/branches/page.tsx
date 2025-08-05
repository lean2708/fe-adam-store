"use client";

import { useState } from "react";
import { BranchesHeader } from "@/components/templates/admin/branches/BranchesHeader";
import { BranchesStats } from "@/components/templates/admin/branches/BranchesStats";
import { BranchesTable } from "@/components/templates/admin/branches/BranchesTable";
import { BranchDialog } from "@/components/templates/admin/branches/BranchDialog";
import { useBranches } from "@/hooks/admin/useBranches";
import type { TBranch } from "@/types";

export default function BranchesAdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<TBranch | null>(null);

  const { branches, loading, handleDelete, handleRestore, handleRefresh } = useBranches();

  const handleCreateBranch = () => {
    setEditingBranch(null);
    setIsDialogOpen(true);
  };

  const handleEditBranch = (branch: TBranch) => {
    setEditingBranch(branch);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBranch(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <BranchesHeader
            onRefresh={handleRefresh}
            onCreateBranch={handleCreateBranch}
          />
        </div>

        {/* <div className="bg-white rounded-lg shadow-sm border p-6">
          <BranchesStats branches={branches} />
        </div> */}

        <div className="bg-white rounded-lg shadow-sm border">
          <BranchesTable
            branches={branches}
            loading={loading}
            onEdit={handleEditBranch}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        </div>

        <BranchDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          editingBranch={editingBranch}
        />
      </div>
    </div>
  );
}
