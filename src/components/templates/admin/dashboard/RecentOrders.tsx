"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { searchOrdersForAdminAction } from "@/actions/orderActions";
import type { TOrder } from "@/types";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { ORDER_STATUS } from "@/enums";

interface RecentOrdersProps {
  dateRange?: {
    from: string;
    to: string;
  };
}

export function RecentOrders({ dateRange }: RecentOrdersProps) {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations("Admin.orders");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Use dateRange if provided, otherwise default to last 30 days
        let startDate: string;
        let endDate: string;

        if (dateRange) {
          startDate = dateRange.from;
          endDate = dateRange.to;
          console.log("RecentOrders: Using date range", { startDate, endDate });
        } else {
          // Default to last 30 days
          const now = new Date();
          const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
          );
          startDate = thirtyDaysAgo.toISOString().split("T")[0];
          endDate = now.toISOString().split("T")[0];
          console.log("RecentOrders: Using default 30-day range", {
            startDate,
            endDate,
          });
        }

        const result = await searchOrdersForAdminAction(
          startDate,
          endDate,
          0, // page
          6, // size - show only 5 recent orders
          ["orderDate,desc"] // sort by creation date descending
        );

        if (result.success && result.data?.items) {
          console.log(result.data.items);

          setOrders(result.data.items);
        }
      } catch (error) {
        console.error("Failed to fetch recent orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dateRange]);

  const getStatusText = (status: string) => {
    switch (status) {
      case ORDER_STATUS.DELIVERED:
        return t("delivered");
      case ORDER_STATUS.PROCESSING:
        return t("processing");
      case ORDER_STATUS.SHIPPED:
        return t("shipped");
      case ORDER_STATUS.CANCELED:
        return t("cancelled"); // vẫn giữ key cũ
      case ORDER_STATUS.PENDING:
        return t("pending");
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-9 h-9 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-32" />
            </div>
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("noRecentOrders")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const orderID = order.id;
        const customerName = order.userName;
        const customerPhone = order.customerPhone || "";
        const customerAvatar = order.OrderItems[0].imageUrl; // No avatar in OrderResponse
        const orderTotalQuantities =
          (order.OrderItems?.length || 0) + " sản phẩm";

        return (
          <div key={order.id} className="flex items-center space-x-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-full  text-sm font-medium text-gray-700">
              #{orderID}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium leading-none">
                    {customerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customerPhone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderTotalQuantities}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end space-y-1">
                  <div className="text-sm font-medium">
                    {formatCurrency(parseFloat(order.totalPrice) || 0, locale)}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getStatusColor(
                      order.status || "PENDING",
                      "order"
                    )}`}
                  >
                    {getStatusText(order.status || "PENDING")}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {order.createdAt
                  ? formatDate(order.createdAt.toISOString(), locale, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Unknown date"}
              </p>
            </div>
          </div>
        );
      })}

      <div className="pt-4 border-t">
        <Link
          href="/admin/orders"
          className="text-sm text-primary hover:underline"
        >
          View all orders →
        </Link>
      </div>
    </div>
  );
}
