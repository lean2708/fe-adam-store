'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DashboardStats } from './DashboardStats';
import { Overview } from './Overview';
import { useDateRange } from '@/hooks/useDateRange';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { getexportOrderRevenueToExcel } from '@/actions/statisticsActions';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DashboardOverviewProps {
  className?: string;
}

export function DashboardOverview({ className }: DashboardOverviewProps) {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const [isExporting, setIsExporting] = useState(false);
  const { dateRange, handleDateRangeUpdate } = useDateRange();

  function b64ToBlob(base64: string, contentType: string) {
    const byteChars = atob(base64);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++)
      byteNums[i] = byteChars.charCodeAt(i);
    const bytes = new Uint8Array(byteNums);
    return new Blob([bytes], { type: contentType });
  }

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await getexportOrderRevenueToExcel(
        dateRange.from,
        dateRange.to
      );
      console.log(result.data?.base64);

      if (result.success) {
        const blob = b64ToBlob(
          result.data?.base64 || '',
          result.data?.contentType || ''
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = result.data?.filename || '';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else {
        alert('Export failed: ' + result.message);
      }
    } catch (e) {
      console.log(e);

      alert('Export failed.');
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className='space-y-6 col-span-7 h-full'>
      <Card className='bg-white dark:bg-gray-900 border border-border rounded-lg shadow-sm h-full flex flex-col'>
        <CardHeader className='flex flex-row items-center justify-between p-4 md:p-6'>
          <CardTitle className='text-xl md:text-base'>
            {t('dashboard.overview.title')}
          </CardTitle>

          <DateRangePicker
            onUpdate={handleDateRangeUpdate}
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            align='start'
            locale={locale}
            t={useTranslations('')}
            showCompare={false}
          />
        </CardHeader>
        <CardContent className='p-4 md:p-6 flex-1'>
          <DashboardStats dateRange={dateRange} />
          <Overview dateRange={dateRange} />
        </CardContent>
        <CardContent className=' p-4 md:p-6 flex justify-end'>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            aria-busy={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {t('dashboard.overview.loading')}
              </>
            ) : (
              t('dashboard.overview.button')
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
