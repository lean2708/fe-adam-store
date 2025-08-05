"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import {
  CreditCard,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { TPaymentHistory } from "@/types";

interface PaymentHistoryTableProps {
  payments: TPaymentHistory[];
  loading: boolean;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'REFUNDED':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
    case 'CANCELED':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    case 'FAILED':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export function PaymentHistoryTable({ 
  payments, 
  loading, 
  onDelete, 
  onRestore 
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
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">{t("paymentTransactions")}</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {t("description")}
        </p>
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
                  <TableHead className="font-semibold text-gray-900">{t("paymentId")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("paymentMethod")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("totalAmount")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("status")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("paymentTime")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("isPrimary")}</TableHead>
                  <TableHead className="font-semibold text-gray-900">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow 
                    key={payment.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      } hover:bg-blue-50 transition-colors`}
                  >
                    <TableCell className="font-medium text-gray-900">
                      #{payment.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {payment.paymentMethod || 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {formatCurrency(payment.totalAmount || 0, locale)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={getStatusColor(payment.paymentStatus || 'PENDING')}
                      >
                        {getStatusText(payment.paymentStatus || 'PENDING')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {payment.paymentTime 
                        ? formatDate(payment.paymentTime, locale, { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {payment.isPrimary ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-700 font-medium">{t("yes")}</span>
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
                        onRestore={onRestore ? () => onRestore(payment.id.toString()) : undefined}
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
      </div>
    </div>
  );
}
