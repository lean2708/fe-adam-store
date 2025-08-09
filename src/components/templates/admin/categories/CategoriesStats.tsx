"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
  FolderTree,
  FolderOpen,
  FolderX,
  BarChart3
} from "lucide-react";
import type { TCategory } from "@/types";

interface CategoriesStatsProps {
  categories: TCategory[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
}

export function CategoriesStats({ categories, totalElements, currentPage, totalPages }: CategoriesStatsProps) {
  const t = useTranslations("Admin.categories");

  // Calculate stats
  const activeCategories = categories.filter(category => category.status === 'ACTIVE').length;
  const inactiveCategories = categories.filter(category => category.status === 'INACTIVE').length;
  const currentPageStart = currentPage * 20 + 1;
  const currentPageEnd = Math.max(1, Math.min((currentPage + 1) * 20, totalElements));

  const stats = [
    {
      title: t("totalCategories") || "Tổng danh mục",
      value: totalElements.toLocaleString(),
      icon: FolderTree,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t("activeCategories") || "Danh mục hoạt động",
      value: activeCategories.toLocaleString(),
      icon: FolderOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t("inactiveCategories") || "Danh mục không hoạt động",
      value: inactiveCategories.toLocaleString(),
      icon: FolderX,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: t("currentPage") || "Trang hiện tại",
      value: `${currentPageStart}-${currentPageEnd}`,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
