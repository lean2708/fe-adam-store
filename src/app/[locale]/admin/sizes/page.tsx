'use client';

import { useState, useEffect } from 'react';
import { SizeTable } from '@/components/templates/admin/sizes/SizeTable';
import { fetchAllSizesAction } from '@/actions/sizeActions';
import type { TSize } from '@/types';
import { toast } from 'sonner';

export default function SizesAdminPage() {
  const [sizes, setSizes] = useState<TSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const pageSize = 20;

  // Load sizes on component mount
  useEffect(() => {
    loadSizes(0);
  }, []);

  const loadSizes = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchAllSizesAction(page, pageSize);
      if (result.success && result.data) {
        setSizes(result.data || []);
        setTotalPages(result.actionSizeResponse?.totalPages || 0);
        setTotalElements(result.actionSizeResponse?.totalItems || 0);
        setCurrentPage(page);
      } else {
        toast.error(result.message || 'Failed to load sizes');
      }
    } catch {
      toast.error('Failed to load sizes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadSizes(currentPage);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadSizes(newPage);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='admin-page-container space-y-6 mt-4 dark:bg-gray-900'>
        <div className='bg-white rounded-lg shadow-sm border p-4 md:p-6 dark:bg-gray-900'>
          <SizeTable
            sizes={sizes}
            loading={loading}
            onRefresh={handleRefresh}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
