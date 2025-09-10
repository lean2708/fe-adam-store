'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RecentOrders } from '@/components/templates/admin/dashboard/RecentOrders';
import { DashboardOverview } from '@/components/templates/admin/dashboard/DashboardOverview';
import { DashboardTopProducts } from '@/components/templates/admin/dashboard/DashboardTopProducts';
import { useTranslations } from 'next-intl';
import { useDateRange } from '@/hooks/useDateRange';

export default function AdminDashboard() {
  const t = useTranslations('Admin');
  const { dateRange } = useDateRange();

  return (
    <div className='space-y-6 mt-4'>
      {/* Page Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          {t('dashboard.title')}
        </h1>
        {/* <p className="text-muted-foreground">
          {t("dashboard.welcome")}
        </p> */}
      </div>

      {/* Main Dashboard Grid */}
      <div className='grid gap-6 lg:grid-cols-10 lg:items-start'>
        {/* Left Column - Stats and Chart */}
        <DashboardOverview className='space-y-6 col-span-7 h-full' />

        {/* Right Column - Recent Orders and Calendar */}
        <div className='space-y-6 col-span-3 h-full'>
          {/* Calendar Date Picker */}

          {/* Recent Orders */}
          <Card className='bg-white dark:bg-gray-900 border border-border rounded-lg shadow-sm h-full flex flex-col'>
            <CardHeader>
              <CardTitle>{t('dashboard.recentOrders.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.recentOrders.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-1'>
              <RecentOrders dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Products */}
      <DashboardTopProducts />
    </div>
  );
}
