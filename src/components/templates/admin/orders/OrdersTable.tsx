"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import {
  ShoppingCart,
  Eye,
  X
} from "lucide-react";
import type { OrderResponse } from "@/api-client/models";

interface OrdersTableProps {
  orders: OrderResponse[];
  loading: boolean;
  onViewDetails: (order: OrderResponse) => void;
  onCancelOrder: (id: string) => void;
  onDeleteOrder: (id: string) => void;
  onRestoreOrder?: (id: string) => void;
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export function OrdersTable({ 
  orders, 
  loading, 
  onViewDetails, 
  onCancelOrder, 
  onDeleteOrder, 
  onRestoreOrder 
}: OrdersTableProps) {
  const t = useTranslations("Admin.orders");
  const locale = useLocale();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('pending');
      case 'PROCESSING':
        return t('processing');
      case 'SHIPPED':
        return t('shipped');
      case 'DELIVERED':
        return t('delivered');
      case 'CANCELLED':
        return t('cancelled');
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">{t("orderHistory")}</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {t("description")}
        </p>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("noOrdersFound")}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">{t("orderId")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("customer")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("total")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("status")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("items")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("date")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow 
                    key={order.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      } hover:bg-blue-50 transition-colors`}
                  >
                    <TableCell className="font-medium text-gray-900">
                      #{order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-600">
                          {order.address?.streetDetail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {formatCurrency(order.totalPrice || 0, locale)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={getStatusColor(order.orderStatus || 'PENDING')}
                      >
                        {getStatusText(order.orderStatus || 'PENDING')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {t("itemsCount", { count: order.orderItems?.length || 0 })}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {order.orderDate 
                        ? formatDate(order.orderDate, locale, { year: 'numeric', month: 'short', day: 'numeric' }) 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => onViewDetails(order)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          {t("viewDetails")}
                        </button>
                        
                        {/* Action Dropdown */}
                        <ActionDropdown
                          onEdit={order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' 
                            ? () => onCancelOrder(order.id?.toString() || "") 
                            : undefined
                          }
                          onDelete={() => onDeleteOrder(order.id?.toString() || "")}
                          onRestore={onRestoreOrder ? () => onRestoreOrder(order.id?.toString() || "") : undefined}
                          showRestore={!!onRestoreOrder}
                          translationNamespace="Admin.orders"
                          customEditIcon={X}
                          customEditLabel={t("cancelOrder")}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
