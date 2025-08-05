"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/templates/admin/dashboard/Overview";
import { RecentOrders } from "@/components/templates/admin/dashboard/RecentOrders";
import { TopProducts } from "@/components/templates/admin/dashboard/TopProducts";
import { DashboardStats } from "@/components/templates/admin/dashboard/DashboardStats";
import { useTranslations, useLocale } from "next-intl";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { formatDate } from "@/lib/utils";

// Define DateRange type to match the DateRangePicker component
interface DateRange {
  from: Date;
  to: Date | undefined;
}

export default function AdminDashboard() {
  const t = useTranslations("Admin");
  const locale = useLocale();

  // Map locale to proper format for DateRangePicker

  // Calculate default date range (last 30 days)
  const getDefaultDateRange = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    return {
      from: lastMonth.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0]
    };
  };

  const defaultRange = getDefaultDateRange();

  // State for managing date range across components
  const [dateRange, setDateRange] = useState({
    from: defaultRange.from,
    to: defaultRange.to
  });

  // Handle date range updates
  const handleDateRangeUpdate = (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => {
    console.log("Date range updated:", values);
    if (values.range?.from && values.range?.to) {
      const newDateRange = {
        from: values.range.from.toISOString().split("T")[0],
        to: values.range.to.toISOString().split("T")[0]
      };

      setDateRange(newDateRange);

      const fromFormatted = formatDate(values.range.from.toISOString(), locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const toFormatted = formatDate(values.range.to.toISOString(), locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      console.log(`Date range: ${fromFormatted} - ${toFormatted}`);
      console.log("Date range state updated:", newDateRange);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.welcome")}
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-8">
        {/* Left Column - Stats and Chart */}
        <div className="space-y-6 col-span-5">
          {/* Stats Cards */}
          <DashboardStats dateRange={dateRange} />

          {/* Chart */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>{t("dashboard.overview.title")}</CardTitle>
              <CardDescription>
                {t("dashboard.overview.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2 ">
              <Overview dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Orders and Calendar */}
        <div className="space-y-6 col-span-3">
          {/* Calendar Date Picker */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardContent className="p-4">
              <DateRangePicker
                onUpdate={handleDateRangeUpdate}
                initialDateFrom={dateRange.from}
                initialDateTo={dateRange.to}
                align="start"
                locale={locale}
                showCompare={false}
              />
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>{t("dashboard.recentOrders.title")}</CardTitle>
              <CardDescription>
                {t("dashboard.recentOrders.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrders dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Products */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle>{t("dashboard.topProducts.title")}</CardTitle>
          <CardDescription>
            {t("dashboard.topProducts.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopProducts dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  );
}
