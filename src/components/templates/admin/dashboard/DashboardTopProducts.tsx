'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { TopProducts } from './TopProducts';
import { useDateRange } from '@/hooks/useDateRange';
import { useTranslations, useLocale } from 'next-intl';
import { RefreshCw } from 'lucide-react';

interface DashboardTopProductsProps {
  className?: string;
}

export function DashboardTopProducts({ className }: DashboardTopProductsProps) {
  const t = useTranslations('Admin');
  const locale = useLocale();

  const { dateRange, handleDateRangeUpdate } = useDateRange();

  // State to trigger refresh of TopProducts
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshTopProducts = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Card
      className={`bg-white dark:bg-gray-900 border border-border rounded-lg shadow-sm ${className}`}
    >
      <CardHeader className='flex-row items-center justify-between p-4 md:p-6'>
        <div>
          <CardTitle>{t('dashboard.topProducts.title')}</CardTitle>
          <CardDescription className='hidden md:block'>
            {t('dashboard.topProducts.description')}
          </CardDescription>
        </div>
        <div className='flex items-center flex-wrap justify-end md:space-x-3'>
          <DateRangePicker
            onUpdate={handleDateRangeUpdate}
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            align='end'
            locale={locale}
            t={useTranslations('')}
            showCompare={false}
          />
          <Button
            variant='outline'
            size='sm'
            onClick={handleRefreshTopProducts}
            className='hidden md:flex'
          >
            <RefreshCw className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='p-4 md:p-6'>
        <TopProducts dateRange={dateRange} key={refreshKey} />
      </CardContent>
    </Card>
  );
}
