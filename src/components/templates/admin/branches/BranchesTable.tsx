"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { formatDate, getStatusColor } from "@/lib/utils";
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
import { MapPin, Building, Phone, Plus, RefreshCw } from "lucide-react";
import type { TBranch } from "@/types";
import { Button } from "@/components/ui/button";

interface BranchesTableProps {
  branches: TBranch[];
  loading: boolean;
  onEdit: (branch: TBranch) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onRefresh: () => void;
  onCreateBranch: () => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export function BranchesTable({
  branches,
  loading,
  onEdit,
  onDelete,
  onRestore,
  onRefresh,
  onCreateBranch,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: BranchesTableProps) {
  const t = useTranslations("Admin.branches");
  const locale = useLocale();
  return (
    <div>
      <div className="p-6 border-b bg-gray-50 dark:bg-gray-800 ">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-3">
            <Building className="h-5 w-5 " />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("storeBranches")}
            </h2>
          </div>
          <div className="flex gap-3">
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("refresh") || "Làm mới"}
            </Button>
            <Button
              onClick={onCreateBranch}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("addBranch")}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{t("listOfAllBranches")}</p>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("noBranchesFound")}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 ">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 ">
                  <TableHead className="font-semibold text-gray-900">
                    {t("id")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("name")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("phoneNumber")}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    {t("location")}
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
                {branches.map((branch, index) => (
                  <TableRow
                    key={branch.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <TableCell className="font-medium text-gray-900">
                      {branch.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {branch.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-500 " />
                        <span className="">{branch.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm ">{branch.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(
                          branch.status || "INACTIVE",
                          "general"
                        )}
                      >
                        {t(branch.status || "INACTIVE") ||
                          branch.status ||
                          "INACTIVE"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {branch.createdBy ? branch.createdBy : "N/A"}
                    </TableCell>
                    <TableCell>
                      <ActionDropdown
                        onEdit={() => onEdit(branch)}
                        onDelete={() => onDelete(branch.id)}
                        onRestore={
                          onRestore ? () => onRestore(branch.id) : undefined
                        }
                        showRestore={!!onRestore}
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
              itemName="branches"
            />
          </div>
        )}
      </div>
    </div>
  );
}
