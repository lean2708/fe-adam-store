"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
  Palette,
  Package,
  Clock
} from "lucide-react";
import type { TColor } from "@/types";

interface ColorsStatsProps {
  colors: TColor[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
}

export function ColorsStats({ colors, totalElements, currentPage, totalPages }: ColorsStatsProps) {
  const t = useTranslations("Admin.colors");

  // For now, we'll assume all colors are active since the API doesn't provide status
  const activeColors = colors.length;
  const inactiveColors = 0;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">{t("totalColors")}</CardTitle>
            <Palette className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{totalElements}</div>
            <p className="text-xs text-purple-700">
              {t("availableProductColors")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">{t("activeColors")}</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{activeColors}</div>
            <p className="text-xs text-green-700">
              {t("currentlyActive")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">{t("inactiveColors")}</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{inactiveColors}</div>
            <p className="text-xs text-orange-700">
              {t("temporarilyDisabled")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
