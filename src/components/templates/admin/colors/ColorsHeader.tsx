"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Plus,
  RefreshCw
} from "lucide-react";

interface ColorsHeaderProps {
  onRefresh: () => void;
  onCreateColor: () => void;
}

export function ColorsHeader({ onRefresh, onCreateColor }: ColorsHeaderProps) {
  const t = useTranslations("Admin.colors");

  return (
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
        <Button onClick={onCreateColor} className="bg-black hover:bg-gray-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t("addColor")}
        </Button>
      </div>
    </div>
  );
}
