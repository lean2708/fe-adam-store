"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { AdminPagination } from "@/components/ui/pagination";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Search
} from "lucide-react";
import type { TPaymentHistory } from "@/types";

interface PaymentHistoryTableProps {
  payments: TPaymentHistory[];
  loading: boolean;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  // Search and filter props
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | "ALL";
  onStatusFilterChange: (value: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | "ALL") => void;
  // Date range props
  onDateRangeUpdate?: (values: { range: { from: Date; to: Date | undefined }; rangeCompare?: { from: Date; to: Date | undefined } }) => void;
}



export function PaymentHistoryTable({
  payments,
  loading,
  onDelete,
  onRestore,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onDateRangeUpdate
}: PaymentHistoryTableProps) {
  const t = useTranslations("Admin.paymentHistory");
  const locale = useLocale();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return t('paid');
      case 'PENDING':
        return t('pending');
      case 'REFUNDED':
        return t('refunded');
      case 'CANCELED':
        return t('canceled');
      case 'FAILED':
        return t('failed');
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("paymentTransactions")}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t("searchPayments") || "Search payments..."}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64 bg-white border-gray-300"
              />
            </div> */}
            <DateRangePicker
              onUpdate={onDateRangeUpdate}
              align="end"
              locale={locale}
              showCompare={false}
            />
            <span className="text-sm text-gray-600">
              {t("filterByStatus")}:
            </span>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                onStatusFilterChange(
                  value as
                    | "PAID"
                    | "PENDING"
                    | "REFUNDED"
                    | "CANCELED"
                    | "FAILED"
                    | "ALL"
                )
              }
            >
              <SelectTrigger className="w-[180px] bg-white border-gray-300">
                <SelectValue
                  placeholder={t("filterByStatus") || "Filter by status"}
                />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL">
                  {t("allStatus") || "All Status"}
                </SelectItem>
                <SelectItem value="PAID">{t("paid") || "Paid"}</SelectItem>
                <SelectItem value="PENDING">
                  {t("pending") || "Pending"}
                </SelectItem>
                <SelectItem value="REFUNDED">
                  {t("refunded") || "Refunded"}
                </SelectItem>
                <SelectItem value="CANCELED">
                  {t("canceled") || "Canceled"}
                </SelectItem>
                <SelectItem value="FAILED">
                  {t("failed") || "Failed"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-gray-600">{t("description")}</p>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("noPaymentsFound")}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">
                    {t("paymentId")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("paymentMethod")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("totalAmount")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("status")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("paymentTime")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("isPrimary")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow
                    key={payment.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <TableCell className="font-medium text-gray-900">
                      #{payment.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {payment.paymentMethod || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {formatCurrency(payment.totalAmount || 0, locale)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(
                          payment.paymentStatus || "PENDING",
                          "payment"
                        )}
                      >
                        {getStatusText(payment.paymentStatus || "PENDING")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {payment.paymentTime
                        ? formatDate(payment.paymentTime, locale, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {payment.isPrimary ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-700 font-medium">
                              {t("yes")}
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{t("no")}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActionDropdown
                        onEdit={undefined} // Payment history is typically read-only
                        onDelete={() => onDelete(payment.id.toString())}
                        onRestore={
                          onRestore
                            ? () => onRestore(payment.id.toString())
                            : undefined
                        }
                        showRestore={!!onRestore}
                        translationNamespace="Admin.paymentHistory"
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
              itemsPerPage={10}
              itemName="payments"
            />
          </div>
        )}
      </div>
    </div>
  );
}
