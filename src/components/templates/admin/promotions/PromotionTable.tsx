"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { formatDate, getStatusColor } from "@/lib/utils";
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
import {
  Tag,
  CheckCircle,
  XCircle,
  Percent,
  Calendar,
  RefreshCw,
  Search,
  Plus,
} from "lucide-react";
import type { TPromotion } from "@/types";

interface PromotionTableProps {
  promotions: TPromotion[];
  loading: boolean;
  onEdit: (promotion: TPromotion) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onRefresh: () => void;
  onCreatePromotion: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: "ACTIVE" | "INACTIVE" | "ALL";
  onStatusFilterChange: (value: "ACTIVE" | "INACTIVE" | "ALL") => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

// Helper function to format period
const formatPeriod = (
  startDate?: string,
  endDate?: string,
  locale: string = "en"
) => {
  if (!startDate && !endDate) return "-";

  const start = startDate
    ? formatDate(startDate, locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const end = endDate
    ? formatDate(endDate, locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  if (start && end) return `${start} - ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;
  return "-";
};

export function PromotionTable({
  promotions,
  loading,
  onEdit,
  onDelete,
  onRestore,
  onRefresh,
  onCreatePromotion,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: PromotionTableProps) {
  const t = useTranslations("Admin.promotions");
  const locale = useLocale();

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return t("active");
      case "INACTIVE":
        return t("inactive");
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="p-6 border-b bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("promotionList")}
            </h2>
          </div>
          <div className="flex gap-3">
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("refresh")}
            </Button>
            <Button onClick={onCreatePromotion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t("addPromotion")}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{t("description")}</p>
        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm rounded-lg border-2 focus-within:border-blue-500 overflow-hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />{" "}
            <Input
              placeholder={t("searchPromotions")}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none rounded-none"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as "ACTIVE" | "INACTIVE" | "ALL")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allStatus")}</SelectItem>
              <SelectItem value="ACTIVE">{t("active")}</SelectItem>
              <SelectItem value="INACTIVE">{t("inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("noPromotionsFound")}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">
                    {t("id")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("name")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("discount")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("period")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("status")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("createdDate")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion, index) => (
                  <TableRow
                    key={promotion.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <TableCell className="font-medium text-gray-900">
                      #{promotion.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {promotion.code || `Promotion ${promotion.id}`}
                          </div>
                          {promotion.description && (
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {promotion.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Percent className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-purple-700">
                          {promotion.discountPercent || 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500 " />
                        <span className="text-gray-600  text-sm">
                          {formatPeriod(
                            promotion.startDate,
                            promotion.endDate,
                            locale
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(
                          promotion.status || "INACTIVE",
                          "general"
                        )}
                      >
                        {getStatusText(promotion.status || "INACTIVE")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {promotion.createdAt
                        ? formatDate(promotion.createdAt, locale, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <ActionDropdown
                        onEdit={() => onEdit(promotion)}
                        onDelete={() => onDelete(promotion.id.toString())}
                        onRestore={
                          onRestore
                            ? () => onRestore(promotion.id.toString())
                            : undefined
                        }
                        showRestore={!!onRestore}
                        translationNamespace="Admin.promotions"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end ">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalElements}
              itemsPerPage={20}
              itemName="promotions"
            />
          </div>
        )}
      </div>
    </div>
  );
}
