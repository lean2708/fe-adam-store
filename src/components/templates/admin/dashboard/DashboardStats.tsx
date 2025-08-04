"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderRevenueSummaryAction } from "@/actions/statisticsActions";
import { fetchAllUsersAction } from "@/actions/userActions";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
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

  // Query for user count
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users-count'],
    queryFn: async () => {
      const result = await fetchAllUsersAction(0, 1);
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch users');
      }
      return result.data;
    },
  });

  const loading = statsLoading || usersLoading;
  const userCount = usersData?.totalItems || 0;



  const statsCards = [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue ? formatCurrency(stats.totalRevenue, locale) : "₫0",
      icon: DollarSign,
      description: "This month",
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toString() || "0",
      icon: ShoppingCart,
      description: "This month",
      color: "text-blue-600",
    },
    {
      title: "Average Order Value",
      value: stats?.totalOrders && stats?.totalRevenue
        ? formatCurrency(stats.totalRevenue / stats.totalOrders, locale)
        : "₫0",
      icon: TrendingUp,
      description: "Per order",
      color: "text-purple-600",
    },
    {
      title: "Total Users",
      value: userCount.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US'),
      icon: Users,
      description: "Registered users",
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 bg-muted rounded animate-pulse w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
