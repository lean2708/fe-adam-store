"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Plus,
  RefreshCw,
  FolderTree
} from "lucide-react";

interface CategoriesHeaderProps {
  onRefresh: () => void;
  onCreateCategory: () => void;
}

export function CategoriesHeader({ onRefresh, onCreateCategory }: CategoriesHeaderProps) {
  const t = useTranslations("Admin.categories");

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FolderTree className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("categoriesTitle") || "Quản lý danh mục"}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("categoriesDescription") || "Quản lý danh mục sản phẩm và phân loại"}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Button onClick={onRefresh} variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refresh") || "Làm mới"}
        </Button>
        <Button onClick={onCreateCategory} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t("addCategory") || "Thêm danh mục"}
        </Button>
      </div>
    </div>
  );
}
