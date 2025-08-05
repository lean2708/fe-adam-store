"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
  Tag,
  CheckCircle,
  XCircle,
  Percent,
  Calendar,
  TrendingUp
} from "lucide-react";
import type { TPromotion } from "@/types";

interface PromotionStatsProps {
  promotions: TPromotion[];
  totalElements: number;
}

export function PromotionStats({ promotions, totalElements }: PromotionStatsProps) {
  const t = useTranslations("Admin.promotions");

  // Calculate statistics from promotions
  const activePromotions = promotions.filter(promotion => promotion.status === 'ACTIVE').length;
  const inactivePromotions = promotions.filter(promotion => promotion.status === 'INACTIVE').length;
  
  // Calculate average discount
  const totalDiscount = promotions.reduce((sum, promotion) => sum + (promotion.discountPercent || 0), 0);
  const averageDiscount = promotions.length > 0 ? Math.round(totalDiscount / promotions.length) : 0;

  // Calculate current month promotions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthPromotions = promotions.filter(promotion => {
    if (!promotion.createdAt) return false;
    const createdDate = new Date(promotion.createdAt);
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length;

  const stats = [
    {
      title: t("totalPromotions"),
      value: totalElements,
      description: t("allPromotions"),
      icon: Tag,
      color: "from-blue-50 to-blue-100 border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
      valueColor: "text-blue-900"
    },
    {
      title: t("activePromotions"),
      value: activePromotions,
      description: t("active"),
      icon: CheckCircle,
      color: "from-green-50 to-green-100 border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
      valueColor: "text-green-900"
    },
    {
      title: t("inactivePromotions"),
      value: inactivePromotions,
      description: t("inactive"),
      icon: XCircle,
      color: "from-red-50 to-red-100 border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
      valueColor: "text-red-900"
    },
    {
      title: t("averageDiscount"),
      value: `${averageDiscount}%`,
      description: t("avgDiscountValue"),
      icon: Percent,
      color: "from-purple-50 to-purple-100 border-purple-200",
      iconColor: "text-purple-600",
      textColor: "text-purple-800",
      valueColor: "text-purple-900"
    },
    {
      title: t("thisMonthPromotions"),
      value: currentMonthPromotions,
      description: t("createdThisMonth"),
      icon: Calendar,
      color: "from-yellow-50 to-yellow-100 border-yellow-200",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-900"
    },
    {
      title: t("promotionTrend"),
      value: currentMonthPromotions > 0 ? "↗" : "→",
      description: currentMonthPromotions > 0 ? t("increasing") : t("stable"),
      icon: TrendingUp,
      color: "from-orange-50 to-orange-100 border-orange-200",
      iconColor: "text-orange-600",
      textColor: "text-orange-800",
      valueColor: "text-orange-900"
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br ${stat.color}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.valueColor}`}>
                {stat.value}
              </div>
              <p className={`text-xs ${stat.textColor}`}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
