"use client";

import { useEffect, useState } from "react";
import { getTopSellingProductsAction } from "@/actions/statisticsActions";
import type { TopSellingDTO } from "@/api-client/models";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import Link from "next/link";

const chartConfig = {
  soldQuantity: {
    label: "Sold Quantity",
    color: "#8B5CF6", // Purple color to match the design
  },
} satisfies ChartConfig;

export function TopProducts() {
  const [products, setProducts] = useState<TopSellingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        // Get top products for the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const startDate = startOfMonth.toISOString().split('T')[0];
        const endDate = endOfMonth.toISOString().split('T')[0];

        const result = await getTopSellingProductsAction(startDate, endDate);
        
        if (result.success && result.data) {
          setProducts(result.data.slice(0, 10)); // Show top 10
        }
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-muted rounded animate-pulse" />
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

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No top selling products data available
      </div>
    );
  }

  // Calculate max sold quantity for progress bars
  const maxSoldQuantity = Math.max(...products.map(p => p.soldQuantity || 0));

  // Prepare chart data
  const chartData = products.slice(0, 5).map((product, index) => ({
    name: product.productName?.substring(0, 10) + '...' || `Product ${index + 1}`,
    soldQuantity: product.soldQuantity || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Mini Chart */}
      {products.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top 5 Products Chart</CardTitle>
            <CardDescription>Visual representation of top selling products</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={10}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: number) => [
                        `${value} units`,
                        "Sold"
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="soldQuantity"
                  fill="var(--color-soldQuantity)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Product List */}
      <div className="grid gap-4">
        {products.map((product, index) => (
          <div key={product.productId} className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
              {index + 1}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium truncate">
                  {product.productName || `Product #${product.productId}`}
                </h4>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getStatusColor(product.status || 'ACTIVE')}`}
                >
                  {getStatusText(product.status || 'ACTIVE')}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Sold: {product.soldQuantity || 0} units</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(product.totalRevenue || 0)}
                </span>
              </div>
              
              <Progress 
                value={maxSoldQuantity > 0 ? ((product.soldQuantity || 0) / maxSoldQuantity) * 100 : 0}
                className="h-2"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t">
        <Link 
          href="/admin/products" 
          className="text-sm text-primary hover:underline"
        >
          View all products →
        </Link>
      </div>
    </div>
  );
}
