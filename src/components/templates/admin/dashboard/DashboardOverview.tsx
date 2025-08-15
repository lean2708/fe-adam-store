"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DashboardStats } from "./DashboardStats";
import { Overview } from "./Overview";
import { useDateRange } from "@/hooks/useDateRange";
import { useTranslations, useLocale } from "next-intl";

interface DashboardOverviewProps {
  className?: string;
}

export function DashboardOverview({ className }: DashboardOverviewProps) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  
  const { dateRange, handleDateRangeUpdate } = useDateRange();

  return (
    <div className={className}>
      <Card className="bg-white dark:bg-gray-800 border border-border rounded-lg shadow-sm h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("dashboard.overview.title")}</CardTitle>

          <DateRangePicker
            onUpdate={handleDateRangeUpdate}
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            align="start"
            locale={locale}
            showCompare={false}
          />
        </CardHeader>
        <CardContent className="pl-2 flex-1">
          <DashboardStats dateRange={dateRange} />
          <Overview dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  );
}
