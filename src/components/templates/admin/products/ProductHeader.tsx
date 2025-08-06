"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Plus,
  RefreshCw
} from "lucide-react";

interface ProductHeaderProps {
  onRefresh: () => void;
  onCreateProduct: () => void;
}

export function ProductHeader({ onRefresh, onCreateProduct }: ProductHeaderProps) {
  const t = useTranslations("Admin.products");

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t("productsTitle") || "Quản lý sản phẩm"}
        </h1>
        <p className="text-gray-600 mt-1">
          {t("productsDescription") || "Quản lý sản phẩm bao gồm biến thể, màu sắc, kích cỡ, giá cả và tồn kho"}
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onRefresh} variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refresh") || "Refresh"}
        </Button>
        <Button onClick={onCreateProduct} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t("addProduct") || "Thêm sản phẩm"}
        </Button>
      </div>
    </div>
  );
}
