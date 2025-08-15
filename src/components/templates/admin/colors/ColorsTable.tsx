"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { AdminPagination } from "@/components/ui/pagination";
import { Palette, RefreshCw, Plus } from "lucide-react";
import type { TColor } from "@/types";

interface ColorsTableProps {
  colors: TColor[];
  loading: boolean;
  onEdit: (color: TColor) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onRefresh: () => void;
  onCreateColor: () => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

// Helper function to get color value from color name
const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    // English colors
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    purple: "#a855f7",
    pink: "#ec4899",
    orange: "#f97316",
    black: "#000000",
    white: "#ffffff",
    gray: "#6b7280",
    grey: "#6b7280",
    brown: "#a3a3a3",
    navy: "#1e3a8a",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    lime: "#84cc16",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    rose: "#f43f5e",
    emerald: "#10b981",
    sky: "#0ea5e9",
    amber: "#f59e0b",
    slate: "#64748b",
    // Vietnamese colors
    đỏ: "#ef4444",
    xanh: "#3b82f6",
    lục: "#22c55e",
    vàng: "#eab308",
    tím: "#a855f7",
    hồng: "#ec4899",
    cam: "#f97316",
    đen: "#000000",
    trắng: "#ffffff",
    xám: "#6b7280",
    nâu: "#a3a3a3",
  };

  const lowerName = colorName.toLowerCase().trim();
  return colorMap[lowerName] || "#6b7280"; // Default to gray if color not found
};

export function ColorsTable({
  colors,
  loading,
  onEdit,
  onDelete,
  onRestore,
  onRefresh,
  onCreateColor,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: ColorsTableProps) {
  const t = useTranslations("Admin.colors");
  const locale = useLocale();

  return (
    <div>
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("productColors")}
            </h2>
          </div>
          <div className="flex gap-3">
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("refresh")}
            </Button>
            <Button onClick={onCreateColor} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t("addColor")}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">{t("listOfAllColors")}</p>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : colors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("noColorsFound")}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">
                    {t("id")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("name")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("color")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("status")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("creator")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colors.map((color, index) => (
                  <TableRow
                    key={color.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <TableCell className="font-medium text-gray-900">
                      {color.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {color.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                          style={{
                            backgroundColor: getColorValue(color.name || ""),
                          }}
                          title={`Color: ${color.name}`}
                        />
                        <span className="text-sm text-gray-600 font-mono">
                          {getColorValue(color.name || "")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                      >
                        ACTIVE
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">System</TableCell>
                    <TableCell>
                      <ActionDropdown
                        onEdit={() => onEdit(color)}
                        onDelete={() => onDelete(color.id.toString())}
                        onRestore={
                          onRestore
                            ? () => onRestore(color.id.toString())
                            : undefined
                        }
                        showRestore={!!onRestore}
                        translationNamespace="Admin.colors"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalElements}
              itemsPerPage={20}
              itemName="colors"
            />
          </div>
        )}
      </div>
    </div>
  );
}
