"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { AdminPagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package } from "lucide-react";
import Image from "next/image";
import type { TProduct } from "@/types";

interface ProductVariantsTableProps {
  variants: TProduct[];
  loading: boolean;
  onEdit: (product: TProduct) => void;
  onUpdate?: (product: TProduct) => void;
  onDelete: (productId: number) => void;
  onRestore?: (productId: number) => void;
  onViewDetails?: (product: TProduct) => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}

export function ProductVariantsTable({
  variants,
  loading,
  onEdit,
  onUpdate,
  onDelete,
  onRestore,
  onViewDetails,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ProductVariantsTableProps) {
  const t = useTranslations("Admin.products");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "INACTIVE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[60px]">
                  {t("id") || "ID"}
                </TableHead>
                <TableHead className="min-w-[180px]">
                  {t("productName") || "Tên sản phẩm"}
                </TableHead>
                <TableHead className="max-w-[150px] hidden md:table-cell">
                  {t("description") || "Mô tả"}
                </TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">
                  {t("rating") || "Điểm đánh giá"}
                </TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">
                  {t("soldQuantity") || "Số lượng đã bán"}
                </TableHead>
                <TableHead className="min-w-[80px] hidden sm:table-cell">
                  {t("variantCount") || "Số biến thể"}
                </TableHead>
                <TableHead className="min-w-[80px]">
                  {t("image") || "Hình ảnh"}
                </TableHead>
                <TableHead className="min-w-[100px]">
                  {t("status") || "Trạng thái"}
                </TableHead>
                <TableHead className="text-right min-w-[100px]">
                  {t("actions") || "Hành động"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[60px]">
                  {t("id") || "ID"}
                </TableHead>
                <TableHead className="min-w-[180px]">
                  {t("productName") || "Tên sản phẩm"}
                </TableHead>
                <TableHead className="max-w-[150px] hidden md:table-cell">
                  {t("description") || "Mô tả"}
                </TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">
                  {t("rating") || "Điểm đánh giá"}
                </TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">
                  {t("soldQuantity") || "Số lượng đã bán"}
                </TableHead>
                <TableHead className="min-w-[80px] hidden sm:table-cell">
                  {t("variantCount") || "Số biến thể"}
                </TableHead>
                <TableHead className="min-w-[80px]">
                  {t("image") || "Hình ảnh"}
                </TableHead>
                <TableHead className="min-w-[100px]">
                  {t("status") || "Trạng thái"}
                </TableHead>
                <TableHead className="text-right min-w-[100px]">
                  {t("actions") || "Hành động"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium">
                    {t("noProductsFound") || "Không tìm thấy sản phẩm nào"}
                  </p>
                  <p className="text-sm">
                    {t("noProductsDescription") ||
                      "Tạo sản phẩm đầu tiên để bắt đầu"}
                  </p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View - Show on very small screens */}
      <div className="block sm:hidden space-y-4">
        {variants.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-12 h-12 relative rounded overflow-hidden bg-muted flex-shrink-0">
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
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {product.name || product.title || `Product #${product.id}`}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    ID: {product.id}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-xs">⭐</span>
                    <span className="text-xs">
                      {product.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({product.totalReviews || 0})
                    </span>
                  </div>
                </div>
              </div>
              <ActionDropdown
                onEdit={() => onEdit(product)}
                onUpdate={onUpdate ? () => onUpdate(product) : undefined}
                onDelete={() => onDelete(product.id)}
                onRestore={
                  product.status === "INACTIVE" && onRestore
                    ? () => onRestore(product.id)
                    : undefined
                }
                showRestore={product.status === "INACTIVE" && !!onRestore}
                onViewDetails={
                  onViewDetails ? () => onViewDetails(product) : undefined
                }
                translationNamespace="Admin.products"
                customEditLabel={t("editProduct") || "Edit Product"}
                customUpdateLabel={t("updateProduct") || "Cập nhật sản phẩm"}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">
                  {t("soldQuantity") || "Đã bán"}:{" "}
                </span>
                <span className="font-medium text-blue-600">
                  {product.soldQuantity || 0}
                </span>
              </div>
              <div className="text-right">
                <Badge
                  variant="secondary"
                  className={getStatusColor(product.status || "INACTIVE")}
                >
                  {t(product.status || "INACTIVE") ||
                    product.status ||
                    "INACTIVE"}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t("variantCount") || "Biến thể"}:{" "}
                </span>
                <span className="font-medium">
                  {product.colors?.reduce(
                    (total, color) => total + (color.variants?.length || 0),
                    0
                  ) || 0}
                </span>
              </div>
              <div
                className="text-right text-muted-foreground truncate"
                title={product.description || "No description"}
              >
                {product.description || "No description"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden sm:block rounded-md border">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[60px]">
                  {t("id") || "ID"}
                </TableHead>
                <TableHead className="min-w-[180px]">
                  {t("productName") || "Tên sản phẩm"}
                </TableHead>
                <TableHead className="max-w-[150px] hidden md:table-cell">
                  {t("description") || "Mô tả"}
                </TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">
                  {t("rating") || "Điểm đánh giá"}
                </TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">
                  {t("soldQuantity") || "Số lượng đã bán"}
                </TableHead>
                <TableHead className="min-w-[80px] hidden sm:table-cell">
                  {t("variantCount") || "Số biến thể"}
                </TableHead>
                <TableHead className="min-w-[80px]">
                  {t("image") || "Hình ảnh"}
                </TableHead>
                <TableHead className="min-w-[100px]">
                  {t("status") || "Trạng thái"}
                </TableHead>
                <TableHead className="text-right min-w-[100px]">
                  {t("actions") || "Hành động"}
                </TableHead>
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
                      {product.name ||
                        product.title ||
                        `Product #${product.id}`}
                    </div>
                  </TableCell>

                  {/* Mô tả */}
                  <TableCell className="max-w-[150px] hidden md:table-cell">
                    <div
                      className="text-sm text-muted-foreground truncate cursor-help"
                      title={product.description || "No description"}
                    >
                      {product.description || "No description"}
                    </div>
                  </TableCell>

                  {/* Điểm đánh giá */}
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">
                        {product.averageRating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Số lượng đã bán */}
                  <TableCell className="hidden lg:table-cell">
                    <span className="font-medium text-blue-600">
                      {product.soldQuantity || 0}
                    </span>
                  </TableCell>

                  {/* Số biến thể */}
                  <TableCell className="hidden sm:table-cell">
                    <span className="font-medium">
                      {product.colors?.reduce(
                        (total, color) => total + (color.variants?.length || 0),
                        0
                      ) || 0}
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
                      className={getStatusColor(product.status || "INACTIVE")}
                    >
                      {t(product.status || "INACTIVE") ||
                        product.status ||
                        "INACTIVE"}
                    </Badge>
                  </TableCell>

                  {/* Hành động */}
                  <TableCell className="text-right">
                    <ActionDropdown
                      onEdit={undefined}
                      onUpdate={onUpdate ? () => onUpdate(product) : undefined}
                      onDelete={() => onDelete(product.id)}
                      onRestore={
                        product.status === "INACTIVE" && onRestore
                          ? () => onRestore(product.id)
                          : undefined
                      }
                      showRestore={product.status === "INACTIVE" && !!onRestore}
                      onViewDetails={
                        onViewDetails ? () => onViewDetails(product) : undefined
                      }
                      translationNamespace="Admin.products"
                      customEditLabel={t("editProduct") || "Edit Product"}
                      customUpdateLabel={t("updateProduct") || "Cập nhật sản phẩm"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="border-t ">
          <div className="flex  justify-between mt-2">
            <div className="flex  space-x-4">
              <div className="flex  space-x-2">
                <span className="text-sm text-gray-600">
                  Products per page:
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={onPageSizeChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalElements}
              itemsPerPage={pageSize}
              itemName="products"
              showInfo={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
