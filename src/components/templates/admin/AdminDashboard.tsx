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
        <h1 className='text-3xl font-bold tracking-tight hidden md:block'>
          {t('dashboard.title')}
        </h1>
        {/* <p className="text-muted-foreground">
          {t("dashboard.welcome")}
        </p> */}
      </div>

      {/* Main Dashboard Grid */}
      <div className='grid gap-y-6 lg:gap-6  grid-cols-1  xl:grid-cols-10 lg:items-start'>
        {/* Left Column - Stats and Chart */}
        <DashboardOverview className='space-y-6 lg:col-span-7 h-full' />

        {/* Right Column - Recent Orders and Calendar */}
        <div className='space-y-6 lg:col-span-3 h-full'>
          {/* Calendar Date Picker */}

          {/* Recent Orders */}
          <Card className='bg-white dark:bg-gray-900 border border-border rounded-lg shadow-sm h-full flex flex-col'>
            <CardHeader className='p-4 md:p-6'>
              <CardTitle>{t('dashboard.recentOrders.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.recentOrders.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4 md:p-6 flex-1'>
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
