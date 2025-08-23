"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
} from "lucide-react";
import type { TOrder } from "@/types";

interface OrdersStatsProps {
  orders: TOrder[];
  totalElements: number;
}

export function OrdersStats({ orders, totalElements }: OrdersStatsProps) {
  const t = useTranslations("Admin.orders");

  // Calculate statistics from orders
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "PROCESSING"
  ).length;
  const shippedOrders = orders.filter(
    (order) => order.status === "SHIPPED"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;

  const stats = [
    {
      title: t("totalOrders"),
      value: totalElements,
      description: t("recentOrders"),
      icon: ShoppingCart,
      color: "from-blue-50 to-blue-100 border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
      valueColor: "text-blue-900",
    },
    {
      title: t("pendingOrders"),
      value: pendingOrders,
      description: t("pending"),
      icon: Clock,
      color: "from-yellow-50 to-yellow-100 border-yellow-200",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-900",
    },
    {
      title: t("processingOrders"),
      value: processingOrders,
      description: t("processing"),
      icon: Package,
      color: "from-purple-50 to-purple-100 border-purple-200",
      iconColor: "text-purple-600",
      textColor: "text-purple-800",
      valueColor: "text-purple-900",
    },
    {
      title: t("shippedOrders"),
      value: shippedOrders,
      description: t("shipped"),
      icon: Truck,
      color: "from-indigo-50 to-indigo-100 border-indigo-200",
      iconColor: "text-indigo-600",
      textColor: "text-indigo-800",
      valueColor: "text-indigo-900",
    },
    {
      title: t("deliveredOrders"),
      value: deliveredOrders,
      description: t("delivered"),
      icon: CheckCircle,
      color: "from-green-50 to-green-100 border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
      valueColor: "text-green-900",
    },
    {
      title: t("cancelledOrders"),
      value: cancelledOrders,
      description: t("cancelled"),
      icon: XCircle,
      color: "from-red-50 to-red-100 border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
      valueColor: "text-red-900",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t("title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br ${stat.color}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.valueColor}`}>
                {stat.value}
              </div>
              <p className={`text-xs ${stat.textColor}`}>{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
