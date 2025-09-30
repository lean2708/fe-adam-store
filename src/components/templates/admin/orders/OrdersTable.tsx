'use client';

import { Badge } from '@/components/ui/badge';
import { useTranslations, useLocale } from 'next-intl';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionDropdown } from '@/components/ui/action-dropdown';
import { AdminPagination } from '@/components/ui/pagination';
import { ShoppingCart, Eye, X, RefreshCw } from 'lucide-react';
import type { TOrder, SearchOrdersForAdminOrderStatusEnum } from '@/types';
import { Button } from '@/components/ui/button';
import { ORDER_STATUS } from '@/enums';

interface OrdersTableProps {
  orders: TOrder[];
  loading: boolean;
  onViewDetails: (order: TOrder) => void;
  onCancelOrder: (id: string) => void;
  onDeleteOrder: (id: string) => void;
  onRestoreOrder?: (id: string) => void;
  onRefresh: () => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  // Status filter props
  statusFilter: SearchOrdersForAdminOrderStatusEnum | 'ALL';
  onStatusFilterChange: (
    value: SearchOrdersForAdminOrderStatusEnum | 'ALL'
  ) => void;
}

export function OrdersTable({
  orders,
  loading,
  onViewDetails,
  onCancelOrder,
  onDeleteOrder,
  onRestoreOrder,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
}: OrdersTableProps) {
  const t = useTranslations('Admin.orders');
  const locale = useLocale();

  const getStatusText = (status: string) => {
    switch (status) {
      case ORDER_STATUS.DELIVERED:
        return t('delivered');
      case ORDER_STATUS.PROCESSING:
        return t('processing');
      case ORDER_STATUS.SHIPPED:
        return t('shipped');
      case ORDER_STATUS.CANCELED:
        return t('cancelled'); // vẫn giữ key cũ
      case ORDER_STATUS.PENDING:
        return t('pending');
      default:
        return status;
    }
  };

  return (
    <div>
      <div className=' p-4 md:p-6  bg-gray-50 dark:bg-gray-900'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <ShoppingCart className='h-5 w-5 text-gray-700 dark:text-white hidden md:block' />
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
              {t('orderHistory')}
            </h2>
          </div>
          <div className='flex items-center gap-2 '>
            <span className='text-sm text-gray-600 hidden md:block '>
              {t('filterByStatus')}:
            </span>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                onStatusFilterChange(
                  value as SearchOrdersForAdminOrderStatusEnum | 'ALL'
                )
              }
            >
              <SelectTrigger className='w-[180px] bg-white border-gray-300 dark:text-black'>
                <SelectValue placeholder={t('filterByStatus')} />
              </SelectTrigger>
              <SelectContent className='bg-white '>
                <SelectItem value='ALL'>{t('allStatus')}</SelectItem>
                <SelectItem value='PENDING'>{t('pending')}</SelectItem>
                <SelectItem value='PROCESSING'>{t('processing')}</SelectItem>
                <SelectItem value='SHIPPED'>{t('shipped')}</SelectItem>
                <SelectItem value='DELIVERED'>{t('delivered')}</SelectItem>
                <SelectItem value='CANCELLED'>{t('cancelled')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={onRefresh}
              variant='outline'
              size='icon'
              className='hidden md:flex'
            >
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <p className='text-sm text-gray-600 mt-1 '>{t('description')}</p>
      </div>
      <div className='p-4 md:p-6'>
        {loading ? (
          <div className='space-y-3'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='h-16 w-full' />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            <ShoppingCart className='h-12 w-12 mx-auto mb-4 opacity-50' />
            <p>{t('noOrdersFound')}</p>
          </div>
        ) : (
          <div className='overflow-hidden rounded-lg border '>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50 hover:bg-gray-50'>
                  <TableHead className='font-semibold text-gray-900'>
                    {t('orderId')}
                  </TableHead>
                  <TableHead className='font-semibold text-gray-900'>
                    {t('customer')}
                  </TableHead>
                  <TableHead className='font-semibold text-gray-900'>
                    {t('total')}
                  </TableHead>
                  <TableHead className='font-semibold text-gray-900'>
                    {t('status')}
                  </TableHead>
                  <TableHead className='font-semibold text-gray-900'>
                    {t('items')}
                  </TableHead>
                  <TableHead className='font-semibold text-gray-900'>
                    {t('date')}
                  </TableHead>
                  <TableHead className='font-semibold text-gray-900'>
                    {t('actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <TableCell className='font-medium text-gray-900'>
                      #{order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className='font-medium text-gray-900'>
                          {order.userName}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {order.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='font-medium text-gray-900'>
                      {formatCurrency(
                        parseFloat(order.totalPrice) || 0,
                        locale
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='secondary'
                        className={getStatusColor(
                          order.status || 'PENDING',
                          'order'
                        )}
                      >
                        {getStatusText(order.status || 'PENDING')}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-gray-600'>
                      {t('itemsCount', {
                        count: order.orderItems?.length || 0,
                      })}
                    </TableCell>
                    <TableCell className='text-gray-600'>
                      {order.createdAt
                        ? formatDate(order.createdAt.toISOString(), locale, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        {/* Action Dropdown */}
                        <ActionDropdown
                          onEdit={
                            order.status !== 'CANCELLED' &&
                            order.status !== 'DELIVERED'
                              ? () => onCancelOrder(order.id?.toString() || '')
                              : undefined
                          }
                          onViewDetails={() => onViewDetails(order)}
                          onDelete={() =>
                            onDeleteOrder(order.id?.toString() || '')
                          }
                          onRestore={
                            onRestoreOrder
                              ? () => onRestoreOrder(order.id?.toString() || '')
                              : undefined
                          }
                          showRestore={!!onRestoreOrder}
                          translationNamespace='Admin.orders'
                          customEditIcon={X}
                          customEditLabel={t('cancelOrder')}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center md:justify-end '>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalElements}
              itemsPerPage={10}
              itemName='orders'
            />
          </div>
        )}
      </div>
    </div>
  );
}
