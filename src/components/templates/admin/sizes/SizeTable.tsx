"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Ruler, RefreshCw } from "lucide-react";
import type { TSize } from "@/types";
import { AdminPagination } from "@/components/ui/pagination";

interface SizeTableProps {
  sizes: TSize[];
  loading: boolean;
  onRefresh: () => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function SizeTable({
  sizes,
  loading,
  onRefresh,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: SizeTableProps) {
  const t = useTranslations("Admin.sizes");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            {t("productSizes")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t("listOfAllAvailableSizes")}
          </p>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refresh")}
        </Button>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : sizes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Ruler className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("noSizesFound")}</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-gray-900  ">
                    {t("id")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900  ">
                    {t("name")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizes.map((size) => (
                  <TableRow key={size.id}>
                    <TableCell className="">{size.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {size.name}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalElements}
            itemsPerPage={pageSize}
            itemName="sizes"
          />
        </div>
      )}
    </div>
  );
}
