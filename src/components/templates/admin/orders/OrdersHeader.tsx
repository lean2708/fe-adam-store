"use client";

import { Button } from "@/components/ui/button";
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
  ShoppingCart
} from "lucide-react";
import { SearchOrdersForAdminOrderStatusEnum } from "@/types";

interface OrdersHeaderProps {
  onRefresh: () => void;
  statusFilter: SearchOrdersForAdminOrderStatusEnum | "ALL";
  onStatusFilterChange: (value: SearchOrdersForAdminOrderStatusEnum | "ALL") => void;
}

export function OrdersHeader({
  onRefresh,
  statusFilter,
  onStatusFilterChange
}: OrdersHeaderProps) {
  const t = useTranslations("Admin.orders");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            <p className="text-gray-600 mt-1">
              {t("description")}
            </p>
          </div>
        </div>
        <div className="flex gap-3 ">
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as SearchOrdersForAdminOrderStatusEnum | "ALL")}
          >
            <SelectTrigger className="w-[180px] bg-white border-gray-300">
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">{t("allStatus")}</SelectItem>
              <SelectItem value="PENDING">{t("pending")}</SelectItem>
              <SelectItem value="PROCESSING">{t("processing")}</SelectItem>
              <SelectItem value="SHIPPED">{t("shipped")}</SelectItem>
              <SelectItem value="DELIVERED">{t("delivered")}</SelectItem>
              <SelectItem value="CANCELLED">{t("cancelled")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onRefresh} variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("refresh")}
          </Button>
        </div>
      </div>
    </div>
  );
}
