"use client";

import { useEffect, useState } from "react";
import { getMonthlyRevenueAction } from "@/actions/statisticsActions";
import type { TRevenueByMonth } from "@/types";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";

interface ChartData {
  name: string;
  total: number;
}

interface OverviewProps {
  dateRange?: {
    from: string;
    to: string;
  };
}

const chartConfig = {
  total: {
    label: "Revenue",
    color: "#8B5CF6", // Purple color to match the design
  },
} satisfies ChartConfig;

export function Overview({ dateRange }: OverviewProps) {
  const locale = useLocale();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Use dateRange if provided, otherwise default to current year
        let startDate: string;
        let endDate: string;

        if (dateRange) {
          startDate = dateRange.from;
          endDate = dateRange.to;
          console.log("Overview: Using date range", { startDate, endDate });
        } else {
          // Default to current year
          const now = new Date();
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const endOfYear = new Date(now.getFullYear(), 11, 31);
          startDate = startOfYear.toISOString().split('T')[0];
          endDate = endOfYear.toISOString().split('T')[0];
          console.log("Overview: Using default year range", { startDate, endDate });
        }

        const result = await getMonthlyRevenueAction(startDate, endDate);

        if (result.success && result.data) {
          // Transform the data for the chart
          const chartData = result.data.map((item: TRevenueByMonth) => {
            // Handle the month object - it might be a date string or object
            let monthName = "Unknown";
            if (item.month) {
              if (typeof item.month === 'string') {
                const date = new Date(item.month);
                monthName = date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { month: 'short' });
              } else if (typeof item.month === 'object') {
                // If it's an object, try to extract month information
                const monthObj = item.month as any;
                if (monthObj.month) {
                  const monthIndex = monthObj.month - 1; // Assuming 1-based month
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  monthName = monthNames[monthIndex] || "Unknown";
                }
              }
            }

            return {
              name: monthName,
              total: (item.totalAmount || 0) / 100000,
            };
          });

          setData(chartData);
        }
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
        No revenue data available
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-[380px] w-full ">
        <BarChart
          data={data}
          margin={{ top: 20, right: 15, left: 50, bottom: 20 }}
        >
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs"
            interval={0}
          />
          <YAxis
            className="text-xs"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={45}
            tickFormatter={(value) => {
              // Compact formatting for better zoom display
              if (value >= 1000000000) {
                return `${(value / 1000000000).toFixed(1)}B`;
              } else if (value >= 1000000) {
                return `${(value / 1000000).toFixed(0)}M`;
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(0)}K`;
              }
              return value.toString();
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number) => [
                  formatCurrency(value, locale),
                  "Revenue"
                ]}
              />
            }
          />
          <Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
