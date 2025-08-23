"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { AdminPagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface ProductVariant {
  id?: number;
  price?: number;
  quantity?: number;
  isAvailable?: boolean;
  imageUrl?: string;
  status?: string;
  size?: {
    id?: number;
    name?: string;
  };
  colorName?: string;
  colorId?: number;
}

interface ProductVariantsTableComponentProps {
  variants: ProductVariant[];
  productName: string;
  onEditVariant: (variant: ProductVariant) => void;
}

export function ProductVariantsTableComponent({
  variants,
  productName,
  onEditVariant,
}: ProductVariantsTableComponentProps) {
  const t = useTranslations("Admin.products");
  const locale = useLocale();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Pagination calculations
  const totalVariants = variants.length;
  const totalPages = Math.ceil(totalVariants / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedVariants = variants.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(parseInt(newSize));
    setCurrentPage(0); // Reset to first page when changing page size
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("id") || "ID"}</TableHead>
              <TableHead>{t("product") || "Product"}</TableHead>
              <TableHead>{t("price") || "Price"}</TableHead>
              <TableHead>{t("quantity") || "Quantity"}</TableHead>
              <TableHead>{t("size") || "Size"}</TableHead>
              <TableHead>{t("color") || "Color"}</TableHead>
              <TableHead>{t("actions") || "Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVariants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {totalVariants === 0
                    ? (t("noVariantsFound") || "No variants found")
                    : "No variants on this page"
                  }
                </TableCell>
              </TableRow>
            ) : (
              paginatedVariants.map((variant, index) => (
                <TableRow key={variant.id || `variant-${index}`}>
                  <TableCell>
                    <span className="font-mono text-sm">{variant.id || "N/A"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{productName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {variant.price
                        ? formatCurrency(variant.price, locale)
                        : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        (variant.quantity || 0) > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {variant.quantity || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {variant.size?.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {variant.colorName || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ActionDropdown
                      onEdit={() => onEditVariant(variant)}
                      translationNamespace="Admin.products"
                      customEditLabel={t("editVariant") || "Edit Variant"}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="border-t">
          <div className="flex justify-between items-center mt-4 px-6 pb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {t("itemsPerPage") || "Items per page"}:
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600">
                {t("showingResults") || "Showing"} {startIndex + 1}-{Math.min(endIndex, totalVariants)} {t("of") || "of"} {totalVariants} {t("variants") || "variants"}
              </div>
            </div>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalVariants}
              itemsPerPage={pageSize}
              itemName="variants"
            />
          </div>
        </div>
      )}
    </div>
  );
}
