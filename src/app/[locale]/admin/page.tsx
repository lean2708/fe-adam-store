"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/templates/admin/dashboard/Overview";
import { RecentOrders } from "@/components/templates/admin/dashboard/RecentOrders";
import { TopProducts } from "@/components/templates/admin/dashboard/TopProducts";
import { DashboardStats } from "@/components/templates/admin/dashboard/DashboardStats";
import { useTranslations } from "next-intl";

export default function AdminDashboard() {
  const t = useTranslations("Admin");
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.welcome")}
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("dashboard.overview.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.overview.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("dashboard.recentOrders.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.recentOrders.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.topProducts.title")}</CardTitle>
          <CardDescription>
            {t("dashboard.topProducts.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopProducts />
        </CardContent>
      </Card>
    </div>
  );
}
