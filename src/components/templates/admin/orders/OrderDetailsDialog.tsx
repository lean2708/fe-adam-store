"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  ShoppingCart,
  User,
  MapPin,
  Calendar,
  Package
} from "lucide-react";
import type { OrderResponse } from "@/api-client/models";

interface OrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrderResponse | null;
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

export function OrderDetailsDialog({ open, onClose, order }: OrderDetailsDialogProps) {
  const t = useTranslations("Admin.orders");
  const locale = useLocale();

  if (!order) return null;

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gray-50 -m-6 mb-0 p-6 rounded-t-lg border-b">
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <ShoppingCart className="h-5 w-5" />
            {t("viewDetails")} - #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Order Status and Date */}
          <div className="flex items-center justify-between">
            <div>
              <Badge
                variant="secondary"
                className={`${getStatusColor(order.orderStatus || 'PENDING')} text-sm`}
              >
                {getStatusText(order.orderStatus || 'PENDING')}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              {order.orderDate
                ? formatDate(order.orderDate, locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
                : '-'
              }
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
              <User className="h-4 w-4" />
              {t("customer")}
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">{t("customerName")}:</span>
                <span className="ml-2 text-gray-700">{order.customerName}</span>
              </div>
              {order.address && (
                <div>
                  <span className="font-medium">{t("shippingAddress")}:</span>
                  <div className="ml-2 text-gray-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                      <div>
                        <div>{order.address.streetDetail}</div>
                        <div className="text-sm text-gray-600">
                          {order.address.ward?.name}, {order.address.district?.name}, {order.address.province?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
              <Package className="h-4 w-4" />
              {t("items")} ({order.orderItems?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.productVariant?.product?.name || 'Unknown Product'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.productVariant?.color?.name && (
                          <span>Color: {item.productVariant.color.name}</span>
                        )}
                        {item.productVariant?.size?.name && (
                          <span className="ml-2">Size: {item.productVariant.size.name}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(item.unitPrice || 0, locale)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency((item.unitPrice || 0) * (item.quantity || 1), locale)}
                    </div>
                  </div>
                </div>
              )) || (
                  <div className="text-center py-4 text-gray-500">
                    No items found
                  </div>
                )}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">{t("total")}:</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(order.totalPrice || 0, locale)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
