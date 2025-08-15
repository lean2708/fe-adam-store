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
  Search,
  Plus
} from "lucide-react";

interface PromotionHeaderProps {
  onRefresh: () => void;
  onCreatePromotion: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'ACTIVE' | 'INACTIVE' | "ALL";
  onStatusFilterChange: (value: 'ACTIVE' | 'INACTIVE' | "ALL") => void;
}

export function PromotionHeader({ 
  onRefresh, 
  onCreatePromotion,
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange 
}: PromotionHeaderProps) {
  const t = useTranslations("Admin.promotions");

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
          <Button onClick={onCreatePromotion} className="bg-black hover:bg-gray-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            {t("addPromotion")}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("searchPromotions")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as 'ACTIVE' | 'INACTIVE' | "ALL")}
        >
          <SelectTrigger className="w-[180px] bg-white border-gray-300">
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL">{t("allStatus")}</SelectItem>
            <SelectItem value="ACTIVE">{t("active")}</SelectItem>
            <SelectItem value="INACTIVE">{t("inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
