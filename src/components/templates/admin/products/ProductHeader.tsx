'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { Plus, RefreshCw, Search } from 'lucide-react';

interface ProductHeaderProps {
  onRefresh: () => void;
  onCreateProduct: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ProductHeader({
  onRefresh,
  onCreateProduct,
  searchTerm,
  onSearchChange,
}: ProductHeaderProps) {
  const t = useTranslations('Admin.products');

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl  md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {t('productsTitle') || 'Quản lý sản phẩm'}
          </h1>
          <p className='text-gray-600 mt-1'>
            {t('productsDescription') ||
              'Quản lý sản phẩm bao gồm biến thể, màu sắc, kích cỡ, giá cả và tồn kho'}
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            onClick={onRefresh}
            variant='outline'
            className='bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hidden md:flex'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            {t('refresh') || 'Refresh'}
          </Button>
          <Button onClick={onCreateProduct}>
            <Plus className='h-4 w-4 mr-2' />
            {t('addProduct') || 'Thêm sản phẩm'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className='flex items-center space-x-4'>
        <div className='relative flex-1 max-w-sm rounded-lg border-2 focus-within:border-blue-500 overflow-hidden'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <Input
            placeholder={t('searchProducts') || 'Tìm kiếm sản phẩm...'}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-10  border-0  rounded-lg'
          />
        </div>
      </div>
    </div>
  );
}
