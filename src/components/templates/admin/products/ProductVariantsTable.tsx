"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import {
  Package,
  Palette,
  Ruler,
  DollarSign
} from "lucide-react";
import Image from "next/image";
import type { TProduct } from "@/types";

interface ProductVariantsTableProps {
  variants: TProduct[];
  loading: boolean;
  onEdit: (product: TProduct) => void;
  onDelete: (productId: number) => void;
  onRestore?: (productId: number) => void;
  onViewDetails?: (product: TProduct) => void;
}

export function ProductVariantsTable({
  variants,
  loading,
  onEdit,
  onDelete,
  onRestore,
  onViewDetails
}: ProductVariantsTableProps) {
  const t = useTranslations("Admin.products");
  const locale = useLocale();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("id") || "ID"}</TableHead>
              <TableHead>{t("productName") || "Tên sản phẩm"}</TableHead>
              <TableHead>{t("description") || "Mô tả"}</TableHead>
              <TableHead>{t("rating") || "Điểm đánh giá"}</TableHead>
              <TableHead>{t("soldQuantity") || "Số lượng đã bán"}</TableHead>
              <TableHead>{t("variantCount") || "Số biến thể"}</TableHead>
              <TableHead>{t("image") || "Hình ảnh"}</TableHead>
              <TableHead>{t("status") || "Trạng thái"}</TableHead>
              <TableHead className="text-right">{t("actions") || "Hành động"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("id") || "ID"}</TableHead>
              <TableHead>{t("productName") || "Tên sản phẩm"}</TableHead>
              <TableHead>{t("description") || "Mô tả"}</TableHead>
              <TableHead>{t("rating") || "Điểm đánh giá"}</TableHead>
              <TableHead>{t("soldQuantity") || "Số lượng đã bán"}</TableHead>
              <TableHead>{t("variantCount") || "Số biến thể"}</TableHead>
              <TableHead>{t("image") || "Hình ảnh"}</TableHead>
              <TableHead>{t("status") || "Trạng thái"}</TableHead>
              <TableHead className="text-right">{t("actions") || "Hành động"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">{t("noProductsFound") || "Không tìm thấy sản phẩm nào"}</p>
                <p className="text-sm">{t("noProductsDescription") || "Tạo sản phẩm đầu tiên để bắt đầu"}</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("id") || "ID"}</TableHead>
            <TableHead>{t("productName") || "Tên sản phẩm"}</TableHead>
            <TableHead>{t("description") || "Mô tả"}</TableHead>
            <TableHead>{t("rating") || "Điểm đánh giá"}</TableHead>
            <TableHead>{t("soldQuantity") || "Số lượng đã bán"}</TableHead>
            <TableHead>{t("variantCount") || "Số biến thể"}</TableHead>
            <TableHead>{t("image") || "Hình ảnh"}</TableHead>
            <TableHead>{t("status") || "Trạng thái"}</TableHead>
            <TableHead className="text-right">{t("actions") || "Hành động"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((product) => (
            <TableRow key={product.id}>
              {/* ID */}
              <TableCell>
                <span className="font-mono text-sm">{product.id}</span>
              </TableCell>

              {/* Tên sản phẩm */}
              <TableCell>
                <div className="font-medium">
                  {product.name || product.title || `Product #${product.id}`}
                </div>
              </TableCell>

              {/* Mô tả */}
              <TableCell>
                <span className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {product.description || 'No description'}
                </span>
              </TableCell>

              {/* Điểm đánh giá */}
              <TableCell>
                <div className="flex items-center space-x-1">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm">
                    {product.averageRating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({product.totalReviews || 0})
                  </span>
                </div>
              </TableCell>

              {/* Số lượng đã bán */}
              <TableCell>
                <span className="font-medium text-blue-600">
                  {product.soldQuantity || 0}
                </span>
              </TableCell>

              {/* Số biến thể */}
              <TableCell>
                <span className="font-medium">
                  {product.colors?.reduce((total, color) => total + (color.variants?.length || 0), 0) || 0}
                </span>
              </TableCell>

              {/* Hình ảnh */}
              <TableCell>
                <div className="w-12 h-12 relative rounded overflow-hidden bg-muted">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].imageUrl || "/placeholder.png"}
                      alt={product.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Trạng thái */}
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(product.status || 'INACTIVE')}
                >
                  {t(product.status || 'INACTIVE') || product.status || 'INACTIVE'}
                </Badge>
              </TableCell>

              {/* Hành động */}
              <TableCell className="text-right">
                <ActionDropdown
                  onEdit={() => onEdit(product)}
                  onDelete={() => onDelete(product.id)}
                  onRestore={product.status === 'INACTIVE' && onRestore ? () => onRestore(product.id) : undefined}
                  showRestore={product.status === 'INACTIVE' && !!onRestore}
                  onViewDetails={onViewDetails ? () => onViewDetails(product) : undefined}
                  translationNamespace="Admin.products"
                  customEditLabel={t("editProduct") || "Edit Product"}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
