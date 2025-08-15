"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { TopProducts } from "./TopProducts";
import { useDateRange } from "@/hooks/useDateRange";
import { useTranslations, useLocale } from "next-intl";
import { RefreshCw } from "lucide-react";

interface DashboardTopProductsProps {
  className?: string;
}

export function DashboardTopProducts({ className }: DashboardTopProductsProps) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  
  const { dateRange, handleDateRangeUpdate, getFormattedDateRange } = useDateRange();
  
  // State to trigger refresh of TopProducts
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshTopProducts = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card className={`bg-white dark:bg-gray-800 border border-border rounded-lg shadow-sm ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("dashboard.topProducts.title")}</CardTitle>
          <CardDescription>
            {t("dashboard.topProducts.description")}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-3">
          <DateRangePicker
            onUpdate={handleDateRangeUpdate}
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            align="end"
            locale={locale}
            showCompare={false}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshTopProducts}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TopProducts dateRange={dateRange} key={refreshKey} />
      </CardContent>
    </Card>
  );
}
