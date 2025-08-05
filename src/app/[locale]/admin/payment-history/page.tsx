"use client";

import { useState } from "react";
import { PaymentHistoryHeader } from "@/components/templates/admin/payment-history/PaymentHistoryHeader";
import { PaymentHistoryStats } from "@/components/templates/admin/payment-history/PaymentHistoryStats";
import { PaymentHistoryTable } from "@/components/templates/admin/payment-history/PaymentHistoryTable";
import { usePaymentHistory } from "@/hooks/admin/usePaymentHistory";
import { AdminPagination } from "@/components/ui/pagination";

export default function PaymentHistoryAdminPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | "ALL">("ALL");

  const {
    payments,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh
  } = usePaymentHistory(currentPage, 10, statusFilter);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (value: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | "ALL") => {
    setStatusFilter(value);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PaymentHistoryHeader
            onRefresh={handleRefresh}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PaymentHistoryStats
            payments={payments}
            totalElements={totalElements}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <PaymentHistoryTable
            payments={payments}
            loading={loading}
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
            itemsPerPage={10}
            itemName="payments"
          />
        )}
      </div>
    </div>
  );
}