"use client";

import { useState } from "react";
import { OrdersStats } from "@/components/templates/admin/orders/OrdersStats";
import { OrdersTable } from "@/components/templates/admin/orders/OrdersTable";
import { OrderDetailsModal } from "@/components/templates/admin/orders/OrderDetailsModal";
import { useOrders } from "@/hooks/admin/useOrders";

import type { TOrder, SearchOrdersForAdminOrderStatusEnum } from "@/types";

export default function OrdersAdminPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    SearchOrdersForAdminOrderStatusEnum | "ALL"
  >("ALL");

  const {
    orders,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleCancel,
    handleRestore,
    handleRefresh,
  } = useOrders(currentPage, 10, statusFilter);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewDetails = (order: TOrder) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusFilterChange = (
    value: SearchOrdersForAdminOrderStatusEnum | "ALL"
  ) => {
    setStatusFilter(value);
    setCurrentPage(0); // Reset to first page when changing filter
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="admin-page-container space-y-6 mt-4 dark:bg-gray-900">
        <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-900">
          <OrdersStats orders={orders} totalElements={totalElements} />
        </div>
        <div className="bg-white overflow-hidden shadow-sm border rounded-lg dark:bg-gray-900">
          <OrdersTable
            orders={orders}
            loading={loading}
            onViewDetails={handleViewDetails}
            onCancelOrder={handleCancel}
            onDeleteOrder={handleDelete}
            onRestoreOrder={handleRestore}
            onRefresh={handleRefresh}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>

        <OrderDetailsModal
          open={isDetailsDialogOpen}
          onClose={handleCloseDetailsDialog}
          order={selectedOrder}
        />
      </div>
    </div>
  );
}
