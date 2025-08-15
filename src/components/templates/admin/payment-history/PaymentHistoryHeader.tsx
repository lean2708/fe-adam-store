"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  Search
} from "lucide-react";

interface PaymentHistoryHeaderProps {
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | "ALL";
  onStatusFilterChange: (value: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | "ALL") => void;
}

export function PaymentHistoryHeader({ 
  onRefresh, 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange 
}: PaymentHistoryHeaderProps) {
  const t = useTranslations("Admin.paymentHistory");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t("title")}</h1>
          <p className="text-gray-600 mt-1">
            {t("description")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onRefresh} variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("refresh")}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("searchPayments")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED' | "ALL")}
        >
          <SelectTrigger className="w-[180px] bg-white border-gray-300">
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL">{t("allStatus")}</SelectItem>
            <SelectItem value="PAID">{t("paid")}</SelectItem>
            <SelectItem value="PENDING">{t("pending")}</SelectItem>
            <SelectItem value="REFUNDED">{t("refunded")}</SelectItem>
            <SelectItem value="CANCELED">{t("canceled")}</SelectItem>
            <SelectItem value="FAILED">{t("failed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
