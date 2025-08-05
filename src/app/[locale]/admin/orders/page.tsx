"use client";

import { useState } from "react";
import { OrdersHeader } from "@/components/templates/admin/orders/OrdersHeader";
import { OrdersStats } from "@/components/templates/admin/orders/OrdersStats";
import { OrdersTable } from "@/components/templates/admin/orders/OrdersTable";
import { OrderDetailsDialog } from "@/components/templates/admin/orders/OrderDetailsDialog";
import { useOrders } from "@/hooks/admin/useOrders";
import { AdminPagination } from "@/components/ui/pagination";
import type { OrderResponse } from "@/api-client/models";
import { SearchOrdersForAdminOrderStatusEnum } from "@/api-client/apis/order-controller-api";

export default function OrdersAdminPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SearchOrdersForAdminOrderStatusEnum | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const {
    orders,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleCancel,
    handleRestore,
    handleRefresh
  } = useOrders(currentPage, 10, statusFilter);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewDetails = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // TODO: Implement search functionality when API supports it
  };

  const handleStatusFilterChange = (value: SearchOrdersForAdminOrderStatusEnum | "ALL") => {
    setStatusFilter(value);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <OrdersHeader
            onRefresh={handleRefresh}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <OrdersStats
            orders={orders}
            totalElements={totalElements}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <OrdersTable
            orders={orders}
            loading={loading}
            onViewDetails={handleViewDetails}
            onCancelOrder={handleCancel}
            onDeleteOrder={handleDelete}
            onRestoreOrder={handleRestore}
          />
        </div>

        {totalPages > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalElements}
            itemsPerPage={10}
            itemName="orders"
          />
        )}

        <OrderDetailsDialog
          open={isDetailsDialogOpen}
          onClose={handleCloseDetailsDialog}
          order={selectedOrder}
        />
      </div>
    </div>
  );
}
