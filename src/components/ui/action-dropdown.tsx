"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, RotateCcw, Eye } from "lucide-react";
import { useTranslations } from "next-intl";

interface ActionDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onViewDetails?: () => void;
  showRestore?: boolean;
  disabled?: boolean;
  translationNamespace?: string;
  customEditIcon?: React.ComponentType<{ className?: string }>;
  customEditLabel?: string;
}

export function ActionDropdown({
  onEdit,
  onDelete,
  onRestore,
  onViewDetails,
  showRestore = false,
  disabled = false,
  translationNamespace = "Admin.branches",
  customEditIcon,
  customEditLabel
}: ActionDropdownProps) {
  const t = useTranslations(translationNamespace);

  const EditIcon = customEditIcon || Edit;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          disabled={disabled}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg">
        {onViewDetails && (
          <DropdownMenuItem
            onClick={onViewDetails}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span>
              {translationNamespace.includes("products") ? t("viewDetails") || "Chi tiết" : t("viewDetails")}
            </span>
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem
            onClick={onEdit}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
          >
            <EditIcon className="h-4 w-4" />
            <span>
              {customEditLabel ||
                (translationNamespace.includes("branches") ? t("editBranch") :
                 translationNamespace.includes("colors") ? t("editColor") :
                 translationNamespace.includes("orders") ? t("editOrder") :
                 translationNamespace.includes("promotions") ? t("editPromotion") :
                 t("viewDetails"))
              }
            </span>
          </DropdownMenuItem>
        )}
        
        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 hover:text-red-700 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span className = "">
              {translationNamespace.includes("branches") ? t("deleteBranch") :
               translationNamespace.includes("colors") ? t("deleteColor") :
               translationNamespace.includes("orders") ? t("deleteOrder") :
               translationNamespace.includes("promotions") ? t("deletePromotion") :
               translationNamespace.includes("products") ? t("deleteProduct") :
               t("deletePayment")}
            </span>
          </DropdownMenuItem>
        )}
        
        {showRestore && onRestore && (
          <DropdownMenuItem
            onClick={onRestore}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-green-50 hover:text-green-700 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>
              {translationNamespace.includes("branches") ? t("restoreBranch") :
               translationNamespace.includes("colors") ? t("restoreColor") :
               translationNamespace.includes("orders") ? t("restoreOrder") :
               translationNamespace.includes("promotions") ? t("restorePromotion") :
               t("restorePayment")}
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
