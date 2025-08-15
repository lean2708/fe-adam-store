"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { searchOrdersForAdminAction } from "@/actions/orderActions";
import type { TOrder } from "@/types";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

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
          const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
          startDate = thirtyDaysAgo.toISOString().split('T')[0];
          endDate = now.toISOString().split('T')[0];
          console.log("RecentOrders: Using default 30-day range", { startDate, endDate });
        }

        const result = await searchOrdersForAdminAction(
          startDate,
          endDate,
          0, // page
          6, // size - show only 5 recent orders
          ["orderDate,desc"] // sort by creation date descending
        );

        if (result.success && result.data?.items) {
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



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'SHIPPED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return t("delivered");
      case 'PROCESSING':
        return t("processing");
      case 'SHIPPED':
        return t("shipped");
      case 'CANCELLED':
        return t("cancelled");
      case 'PENDING':
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
        const customerName = order.userName;
        const customerPhone = 'No contact info';
        const customerAvatar = order.OrderItems[0].imageUrl; // No avatar in OrderResponse
        const orderTotalQuantities = (order.OrderItems?.length || 0)+" sản phẩm";

        return (
          <div key={order.id} className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={customerAvatar} alt={customerName} />
              <AvatarFallback>
                {customerName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {formatCurrency(parseFloat(order.totalPrice) || 0, locale)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getStatusColor(order.status || 'PENDING')}`}
                    >
                      {getStatusText(order.status || 'PENDING')}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {order.createdAt ? formatDate(order.createdAt.toISOString(), locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown date'}
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
