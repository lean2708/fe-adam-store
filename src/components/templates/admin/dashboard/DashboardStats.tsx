"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderRevenueSummaryAction } from "@/actions/statisticsActions";
import { DollarSign, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";

export function DashboardStats() {
  const locale = useLocale();

  // Query for order/revenue stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', '2025-08-10', '2025-07-20'],
    queryFn: async () => {
      const result = await getOrderRevenueSummaryAction("2025-08-10", "2025-07-20");
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch stats');
      }
      return result.data;
    },
  });



  const loading = statsLoading;


  const statsCards = [
    {
      title: locale === 'vi' ? "Tổng doanh thu" : "Total Revenue",
      value: stats?.totalRevenue ? formatCurrency(stats.totalRevenue, locale) : (locale === 'vi' ? "0 VNĐ" : "$0"),
      icon: DollarSign,
      // description: locale === 'vi' ? "so với tháng trước" : "vs last month",
      change: "+20.25%",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: locale === 'vi' ? "Số lượng đơn hàng" : "Total Orders",
      value: stats?.totalOrders?.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US') || (locale === 'vi' ? "0" : "0"),
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
          <Card key={i} className="bg-white dark:bg-gray-800 border-0 shadow-sm">
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardContent className="p-6">
              {stat.change && (
                <div className="flex justify-end items-center space-x-1 px-1">
                  <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stat.change}
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                </div>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
