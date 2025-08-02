"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderRevenueSummaryAction } from "@/actions/statisticsActions";
import { fetchAllUsersAction } from "@/actions/userActions";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import type { OrderStatsDTO } from "@/api-client/models";

export function DashboardStats() {
  const [stats, setStats] = useState<OrderStatsDTO | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get stats for the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const startDate = startOfMonth.toISOString().split('T')[0];
        const endDate = endOfMonth.toISOString().split('T')[0];
        
        // Fetch order/revenue stats and user count in parallel
        const [statsResult, usersResult] = await Promise.all([
          getOrderRevenueSummaryAction("2025-08-10", "2025-07-20"),
          fetchAllUsersAction(0, 1) // Just get first page to get total count
        ]);
        
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        }

        if (usersResult.success && usersResult.data) {
          setUserCount(usersResult.data.totalItems || 0);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statsCards = [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : "₫0",
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
        ? formatCurrency(stats.totalRevenue / stats.totalOrders)
        : "₫0",
      icon: TrendingUp,
      description: "Per order",
      color: "text-purple-600",
    },
    {
      title: "Total Users",
      value: userCount.toLocaleString(),
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
