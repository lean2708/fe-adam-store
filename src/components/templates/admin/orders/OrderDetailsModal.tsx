"use client";

import { Modal, ModalBody } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { ShoppingCart, User, MapPin, Calendar, Package } from "lucide-react";
import type { TOrder } from "@/types";
import Image from "next/image";

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: TOrder | null;
}

// Helper function to get status text
const getStatusText = (status: string, t: any) => {
  switch (status) {
    case "PENDING":
      return t("pending");
    case "PROCESSING":
      return t("processing");
    case "SHIPPED":
      return t("shipped");
    case "DELIVERED":
      return t("delivered");
    case "CANCELLED":
      return t("cancelled");
    default:
      return status;
  }
};

export function OrderDetailsModal({
  open,
  onClose,
  order,
}: OrderDetailsModalProps) {
  const t = useTranslations("Admin.orders");
  const locale = useLocale();

  if (!order) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="centered"
      size="lg"
      showOverlay={true}
      closeOnClickOutside={false}
      showCloseButton={true}
      className="bg-white rounded-lg shadow-xl"
    >
      <div className="flex items-center justify-between p-6 border-b">
        {/* Left side: icon + text */}
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span>
            {t("viewDetails")} - #{order.id}
          </span>
        </div>
      </div>

      <ModalBody className="space-y-6">
        {/* Order Status and Date */}
        <div className="flex items-center justify-between">
          <div>
            <Badge
              variant="secondary"
              className={`${getStatusColor(
                order.status || "PENDING",
                "order"
              )} text-sm`}
            >
              {getStatusText(order.status || "PENDING", t)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {order.createdAt
              ? formatDate(order.createdAt.toISOString(), locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
            <User className="h-4 w-4" />
            {t("customerInfo")}
          </h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{t("customerName")}:</span>{" "}
              {order.userName}
            </p>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{t("deliveryAddress")}</p>
                <p className="text-sm text-gray-600">{order.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="flex items-center gap-2 font-medium text-gray-900 mb-4">
            <Package className="h-4 w-4" />
            {t("orderItems")} ({order.orderItems?.length || 0} {t("items")})
          </h3>
          <div className="space-y-3">
            {order.orderItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-200">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.Product?.title || "Product"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className=" text-gray-900">
                    {item.Product?.title || "Unknown Product"}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>
                      {t("color")}: {item.color}
                    </span>
                    <span>
                      {t("size")}: {item.size}
                    </span>
                    <span>
                      {t("quantity")}: {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(
                      parseFloat(item.Product?.price + "" || "0") *
                        item.quantity,
                      locale
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              {t("total")}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(parseFloat(order.totalPrice) || 0, locale)}
            </span>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
