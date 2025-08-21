"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderRevenueSummaryAction } from "@/actions/statisticsActions";
import { DollarSign, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";

interface DashboardStatsProps {
  dateRange?: {
    from: string;
    to: string;
  };
}

export function DashboardStats({ dateRange }: DashboardStatsProps) {
  const locale = useLocale();

  // Use dateRange or default dates
  const getDateRange = () => {
    if (dateRange) {
      return { from: dateRange.from, to: dateRange.to };
    }
    // Default to last 30 days
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    return {
      from: lastMonth.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    };
  };

  const { from, to } = getDateRange();

  // Query for order/revenue stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats", from, to],
    queryFn: async () => {
      console.log("DashboardStats: Fetching data for range", { from, to });
      const result = await getOrderRevenueSummaryAction(from, to);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch stats");
      }
      return result.data;
    },
  });

  const loading = statsLoading;

  const statsCards = [
    {
      title: locale === "vi" ? "Tổng doanh thu" : "Total Revenue",
      value: stats?.totalRevenue
        ? formatCurrency(stats.totalRevenue, locale)
        : locale === "vi"
        ? "0 VNĐ"
        : "$0",
      icon: DollarSign,
      // description: locale === 'vi' ? "so với tháng trước" : "vs last month",
      change: "+20.25%",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: locale === "vi" ? "Số lượng đơn hàng" : "Total Orders",
      value:
        stats?.totalOrders?.toLocaleString(
          locale === "vi" ? "vi-VN" : "en-US"
        ) || (locale === "vi" ? "0" : "0"),
      icon: ShoppingCart,
      // description: locale === 'vi' ? "so với tháng trước" : "vs last month",
      change: "-20.25%",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="bg-white dark:bg-gray-800 border border-border rounded-lg shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="relative overflow-hidden bg-white dark:bg-gray-800 border border-border rounded-lg shadow-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                </div>
                {stat.change && (
                  <div className="flex flex-col justify-center items-center space-y-1 px-1">
                    <span
                      className={`text-xs font-medium ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <div className={`rounded-full p-3 ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
