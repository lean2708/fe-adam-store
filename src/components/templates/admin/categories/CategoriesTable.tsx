"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { FolderTree, RefreshCw, Plus } from "lucide-react";
import Image from "next/image";
import type { TCategory } from "@/types";
import { getStatusColor } from "@/lib/utils";

interface CategoriesTableProps {
  categories: TCategory[];
  loading: boolean;
  onEdit: (category: TCategory) => void;
  onDelete: (id: number) => void;
  onRestore?: (id: number) => void;
  onRefresh: () => void;
  onCreateCategory: () => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
  onRestore,
  onRefresh,
  onCreateCategory,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: CategoriesTableProps) {
  const t = useTranslations("Admin.categories");



  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-900  min-w-[60px]">ID</TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[80px]">Ảnh</TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[180px]">Tên</TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[120px] hidden md:table-cell">
                  Người tạo
                </TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[120px] hidden lg:table-cell">
                  Ngày tạo
                </TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[100px]">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-900  text-right min-w-[100px]">
                  Hành động
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
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-20" />
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

  if (categories.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-900  min-w-[60px]">ID</TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[80px]">Ảnh</TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[180px]">Tên</TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[120px] hidden md:table-cell">
                  Người tạo
                </TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[120px] hidden lg:table-cell">
                  Ngày tạo
                </TableHead>
                <TableHead className="font-semibold text-gray-900  min-w-[100px]">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-900  text-right min-w-[100px]">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  <FolderTree className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium">
                    {t("noCategoriesFound") || "Không tìm thấy danh mục nào"}
                  </p>
                  <p className="text-sm">
                    {t("noCategoriesDescription") ||
                      "Tạo danh mục đầu tiên để bắt đầu"}
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
    <div>
      {/* Header */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("categoriesTitle") || "Quản lý danh mục"}
            </h2>
          </div>
          <div className="flex gap-3">
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("refresh") || "Làm mới"}
            </Button>
            <Button onClick={onCreateCategory} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t("addCategory") || "Thêm danh mục"}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {t("categoriesDescription") ||
            "Quản lý danh mục sản phẩm và phân loại"}
        </p>
      </div>

      <div className="p-6">
        {/* Mobile Card View - Show on very small screens */}
        <div className="block sm:hidden space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-12 h-12 relative rounded overflow-hidden bg-muted flex-shrink-0">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.imageUrl}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        <FolderTree className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      ID: {category.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Người tạo: {category.createdBy || "Admin"}
                    </p>
                  </div>
                </div>
                <ActionDropdown
                  onEdit={() => onEdit(category)}
                  onDelete={() => onDelete((category.id))}
                  onRestore={
                    category.status === "INACTIVE" && onRestore
                      ? () => onRestore((category.id))
                      : undefined
                  }
                  showRestore={category.status === "INACTIVE" && !!onRestore}
                  translationNamespace="Admin.categories"
                  customEditLabel={t("editCategory") || "Edit Category"}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <Badge
                  variant="secondary"
                  className={getStatusColor(category.status || "INACTIVE", "general")}
                >
                  {t(category.status || "INACTIVE") ||
                    category.status ||
                    "INACTIVE"}
                </Badge>
                <span className="text-muted-foreground">
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
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
                  <TableHead className="font-semibold text-gray-900  min-w-[60px]">ID</TableHead>
                  <TableHead className="font-semibold text-gray-900  min-w-[80px]">Ảnh</TableHead>
                  <TableHead className="font-semibold text-gray-900  min-w-[180px]">Tên</TableHead>
                  <TableHead className="font-semibold text-gray-900  min-w-[120px] hidden md:table-cell">
                    Người tạo
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900  min-w-[120px] hidden lg:table-cell">
                    Ngày tạo
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900  min-w-[100px]">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-gray-900  text-right min-w-[100px]">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    {/* ID */}
                    <TableCell>
                      <span className="font-mono text-sm">{category.id}</span>
                    </TableCell>

                    {/* Image */}
                    <TableCell>
                      <div className="w-10 h-10 relative rounded overflow-hidden bg-muted">
                        {category.imageUrl ? (
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                            <FolderTree className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Category Name */}
                    <TableCell>
                      <div className="font-medium">{category.name}</div>
                    </TableCell>

                    {/* Creator - Người tạo */}
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {category.createdBy || "Admin"}
                      </span>
                    </TableCell>

                    {/* Created At */}
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {category.createdAt
                          ? new Date(category.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(
                          category.status || "INACTIVE",
                          "general"
                        )}
                      >
                        {t(category.status || "INACTIVE") ||
                          category.status ||
                          "INACTIVE"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <ActionDropdown
                        onEdit={() => onEdit(category)}
                        onDelete={() => onDelete((category.id))}
                        onRestore={
                          category.status === "INACTIVE" && onRestore
                            ? () => onRestore((category.id))
                            : undefined
                        }
                        showRestore={
                          category.status === "INACTIVE" && !!onRestore
                        }
                        translationNamespace="Admin.categories"
                        customEditLabel={t("editCategory") || "Edit Category"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalElements}
              itemsPerPage={20}
              itemName="categories"
            />
          </div>
        )}
      </div>
    </div>
  );
}
