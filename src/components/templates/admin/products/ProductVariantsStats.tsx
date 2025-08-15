"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import type { TProduct } from "@/types";

interface ProductVariantsStatsProps {
  variants: TProduct[];
  totalElements: number;
}

export function ProductVariantsStats({ variants, totalElements }: ProductVariantsStatsProps) {
  const t = useTranslations("Admin.products");
  const locale = useLocale();

  const activeProducts = variants.filter(p => p.status === 'ACTIVE').length;
  const inactiveProducts = variants.filter(p => p.status === 'INACTIVE').length;
  const availableProducts = variants.filter(p => p.isAvailable).length;

  // Calculate total variants across all products
  const totalVariants = variants.reduce((sum, product) => {
    return sum + (product.colors?.reduce((colorSum, color) =>
      colorSum + (color.variants?.length || 0), 0) || 0);
  }, 0);

  // Calculate total stock across all variants
  const totalStock = variants.reduce((sum, product) => {
    return sum + (product.colors?.reduce((colorSum, color) =>
      colorSum + (color.variants?.reduce((variantSum, variant) =>
        variantSum + (variant.quantity || 0), 0) || 0), 0) || 0);
  }, 0);

  // Calculate average price across all variants
  const allVariants = variants.flatMap(product =>
    product.colors?.flatMap(color => color.variants || []) || []
  );
  const averagePrice = allVariants.length > 0
    ? allVariants.reduce((sum, variant) => sum + (variant.price || 0), 0) / allVariants.length
    : 0;

  const stats = [
    {
      title: t("totalProducts") || "Tổng sản phẩm",
      value: totalElements.toString(),
      icon: Package,
      description: `${activeProducts} ${t("activeProducts") || "hoạt động"}, ${inactiveProducts} ${t("inactiveProducts") || "không hoạt động"}`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("totalVariants") || "Tổng biến thể",
      value: totalVariants.toString(),
      icon: DollarSign,
      description: t("allColorsSizes") || "Tất cả màu sắc và kích cỡ",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: t("totalStock") || "Tổng tồn kho",
      value: totalStock.toString(),
      icon: TrendingUp,
      description: `${availableProducts} ${t("availableProducts") || "sản phẩm có sẵn"}`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: t("averagePrice") || "Giá trung bình",
      value: formatCurrency(averagePrice, locale),
      icon: AlertTriangle,
      description: t("acrossAllVariants") || "Trên tất cả biến thể",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-white dark:bg-gray-800 border border-border rounded-lg shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
