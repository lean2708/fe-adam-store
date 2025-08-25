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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  handleOpenAddModal: () => void;
  onEditVariant: (variant: ProductVariant) => void;
}

export function ProductVariantsTableComponent({
  variants,
  productName,
  onEditVariant,
  handleOpenAddModal,
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
      <div className="p-6 ">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">
            {t("productVariants") || "Biến thể sản phẩm"}
          </h3>
          <Button
            onClick={handleOpenAddModal}
            className="w-30 bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2 py-3"
          >
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 0.5C6.41775 0.5 4.87103 0.969192 3.55544 1.84824C2.23985 2.72729 1.21447 3.97672 0.608967 5.43853C0.00346628 6.90034 -0.15496 8.50887 0.153721 10.0607C0.462403 11.6126 1.22433 13.038 2.34315 14.1569C3.46197 15.2757 4.88743 16.0376 6.43928 16.3463C7.99113 16.655 9.59966 16.4965 11.0615 15.891C12.5233 15.2855 13.7727 14.2602 14.6518 12.9446C15.5308 11.629 16 10.0822 16 8.5C15.9978 6.37895 15.1542 4.34542 13.6544 2.84562C12.1546 1.34581 10.121 0.50224 8 0.5ZM8 15.2692C6.66117 15.2692 5.35241 14.8722 4.23922 14.1284C3.12603 13.3846 2.2584 12.3274 1.74605 11.0905C1.2337 9.85356 1.09965 8.49249 1.36084 7.17939C1.62203 5.86629 2.26674 4.66012 3.21343 3.71343C4.16013 2.76674 5.36629 2.12203 6.67939 1.86084C7.99249 1.59965 9.35356 1.7337 10.5905 2.24605C11.8274 2.75839 12.8846 3.62602 13.6284 4.73922C14.3722 5.85241 14.7692 7.16117 14.7692 8.5C14.7672 10.2947 14.0534 12.0153 12.7843 13.2843C11.5153 14.5534 9.79469 15.2672 8 15.2692ZM11.6923 8.5C11.6923 8.66321 11.6275 8.81973 11.5121 8.93514C11.3967 9.05055 11.2401 9.11538 11.0769 9.11538H8.61539V11.5769C8.61539 11.7401 8.55055 11.8967 8.43514 12.0121C8.31974 12.1275 8.16321 12.1923 8 12.1923C7.83679 12.1923 7.68027 12.1275 7.56486 12.0121C7.44945 11.8967 7.38462 11.7401 7.38462 11.5769V9.11538H4.92308C4.75987 9.11538 4.60334 9.05055 4.48794 8.93514C4.37253 8.81973 4.30769 8.66321 4.30769 8.5C4.30769 8.33679 4.37253 8.18026 4.48794 8.06486C4.60334 7.94945 4.75987 7.88461 4.92308 7.88461H7.38462V5.42308C7.38462 5.25987 7.44945 5.10334 7.56486 4.98793C7.68027 4.87253 7.83679 4.80769 8 4.80769C8.16321 4.80769 8.31974 4.87253 8.43514 4.98793C8.55055 5.10334 8.61539 5.25987 8.61539 5.42308V7.88461H11.0769C11.2401 7.88461 11.3967 7.94945 11.5121 8.06486C11.6275 8.18026 11.6923 8.33679 11.6923 8.5Z"
                fill="white"
              />
            </svg>

            {t("addVariant") || "Add Variant"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-gray-900  ">
                {t("id") || "ID"}
              </TableHead>
              <TableHead className="font-semibold text-gray-900  ">
                {t("product") || "Product"}
              </TableHead>
              <TableHead className="font-semibold text-gray-900  ">
                {t("price") || "Price"}
              </TableHead>
              <TableHead className="font-semibold text-gray-900  ">
                {t("quantity") || "Quantity"}
              </TableHead>
              <TableHead className="font-semibold text-gray-900  ">
                {t("size") || "Size"}
              </TableHead>
              <TableHead className="font-semibold text-gray-900  ">
                {t("color") || "Color"}
              </TableHead>
              <TableHead className="font-semibold text-gray-900 h-12 px-4 text-right    ">
                {t("actions") || "Actions"}
              </TableHead>
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
                    ? t("noVariantsFound") || "No variants found"
                    : "No variants on this page"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedVariants.map((variant, index) => (
                <TableRow key={variant.id || `variant-${index}`}>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {variant.id || "N/A"}
                    </span>
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
                  <TableCell className="text-right">
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
                {t("showingResults") || "Showing"} {startIndex + 1}-
                {Math.min(endIndex, totalVariants)} {t("of") || "of"}{" "}
                {totalVariants} {t("variants") || "variants"}
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
