"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useTopProducts } from "@/hooks/admin/useTopProducts";

interface TopProductsProps {
  dateRange?: {
    from: string;
    to: string;
  };
}

export function TopProducts({ dateRange }: TopProductsProps) {
  const locale = useLocale();

  // Use React Query hook for data fetching
  const {
    products,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    hasProducts
  } = useTopProducts({
    dateRange,
    limit: 10
  });



  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded animate-pulse w-48" />
          <div className="h-4 bg-muted rounded animate-pulse w-32" />
        </div>

        {/* Table skeleton */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-medium">Tên sản phẩm</TableHead>
                <TableHead className="font-medium text-center">Đã bán</TableHead>
                <TableHead className="font-medium text-right">Giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Các sản phẩm bán chạy</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Thử lại
          </Button>
        </div>

        <div className="border rounded-lg p-8">
          <div className="text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-sm font-medium">Không thể tải dữ liệu</p>
              <p className="text-xs text-muted-foreground">
                {error?.message || "Đã xảy ra lỗi khi tải danh sách sản phẩm bán chạy"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!hasProducts) {
    return (
      <div className="border rounded-lg p-8">
        <div className="text-center py-8 text-muted-foreground">
          <p>Không có dữ liệu sản phẩm bán chạy</p>
          <p className="text-xs mt-1">Thử thay đổi khoảng thời gian để xem dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium">Tên sản phẩm</TableHead>
              <TableHead className="font-medium text-center">Đã bán</TableHead>
              <TableHead className="font-medium text-right">Giá</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shadow-sm">
                        <span className="text-xs font-medium text-blue-600">
                          {product.productName?.charAt(0)?.toUpperCase() || 'P'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {product.productName || `Product #${product.productId}`}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-medium">
                    {(product.soldQuantity || 0).toLocaleString('vi-VN')}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium">
                    {formatCurrency(product.totalRevenue || 0, locale)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="pt-2">
        <Link
          href="/admin/products"
          className="text-sm text-primary hover:underline"
        >
          Xem tất cả sản phẩm →
        </Link>
      </div>
    </div>
  );
}
