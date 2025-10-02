'use client';

import { useState } from 'react';
import { PaymentHistoryStats } from '@/components/templates/admin/payment-history/PaymentHistoryStats';
import { usePaymentHistory } from '@/hooks/admin/usePaymentHistory';
import { useDateRange } from '@/hooks/useDateRange';
import dynamic from 'next/dynamic';

const PaymentHistoryTable = dynamic(() =>
  import(
    '@/components/templates/admin/payment-history/PaymentHistoryTable'
  ).then((mod) => ({ default: mod.PaymentHistoryTable }))
);

export default function PaymentHistoryAdminPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | 'ALL'
  >('ALL');

  // Date range hook
  const { dateRange, handleDateRangeUpdate } = useDateRange();

  const {
    payments,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
  } = usePaymentHistory(currentPage, 10, statusFilter, searchTerm, dateRange);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleStatusFilterChange = (
    value: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | 'ALL'
  ) => {
    setStatusFilter(value);
    setCurrentPage(0); // Reset to first page when changing filter
  };

  const handleDateRangeUpdateWithReset = (values: {
    range: { from: Date; to: Date | undefined };
    rangeCompare?: { from: Date; to: Date | undefined };
  }) => {
    console.log('Date range updated in payment history:', values);
    handleDateRangeUpdate(values);
    setCurrentPage(0); // Reset to first page when changing date range
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='admin-page-container space-y-6 mt-4 dark:bg-gray-900'>
        <div className='bg-white rounded-lg shadow-sm border p-4 md:p-6 dark:bg-gray-900'>
          <PaymentHistoryStats
            payments={payments}
            totalElements={totalElements}
          />
        </div>
        <div className='bg-white overflow-hidden rounded-lg shadow-sm border dark:bg-gray-900'>
          <PaymentHistoryTable
            payments={payments}
            loading={loading}
            onDelete={handleDelete}
            onRestore={handleRestore}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onDateRangeUpdate={handleDateRangeUpdateWithReset}
          />
        </div>
      </div>
    </div>
  );
}
