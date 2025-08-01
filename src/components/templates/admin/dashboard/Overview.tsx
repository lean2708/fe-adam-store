"use client";

import { useEffect, useState } from "react";
import { getMonthlyRevenueAction } from "@/actions/statisticsActions";
import type { RevenueByMonthDTO } from "@/api-client/models";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface ChartData {
  name: string;
  total: number;
}

export function Overview() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Get revenue data for the current year
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        
        const startDate = startOfYear.toISOString().split('T')[0];
        const endDate = endOfYear.toISOString().split('T')[0];

        const result = await getMonthlyRevenueAction(startDate, endDate);
        
        if (result.success && result.data) {
          // Transform the data for the chart
          const chartData = result.data.map((item: RevenueByMonthDTO) => {
            // Handle the month object - it might be a date string or object
            let monthName = "Unknown";
            if (item.month) {
              if (typeof item.month === 'string') {
                const date = new Date(item.month);
                monthName = date.toLocaleDateString('en-US', { month: 'short' });
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
              total: item.totalAmount || 0,
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
  }, []);

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
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₫${value.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value: number) => [
            `₫${value.toLocaleString()}`,
            "Revenue"
          ]}
          labelStyle={{ color: "#000" }}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
