"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Ruler,
  RefreshCw,
  Package
} from "lucide-react";
import { fetchAllSizesAction } from "@/actions/sizeActions";
import type { SizeResponse } from "@/api-client/models";
import { AdminPagination } from "@/components/ui/pagination";

export default function SizesAdminPage() {
  const t = useTranslations("Admin.sizes");
  const [sizes, setSizes] = useState<SizeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Load sizes on component mount
  useEffect(() => {
    loadSizes(0);
  }, []);

  const loadSizes = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchAllSizesAction(page, 20);
      if (result.success && result.data) {
        setSizes(result.data || []);
        setTotalPages(result.actionSizeResponse?.totalPages || 0);
        setTotalElements(result.actionSizeResponse?.totalItems || 0);
        setCurrentPage(page);
      } else {
        toast.error(result.message || "Failed to load sizes");
      }
    } catch {
      toast.error("Failed to load sizes");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadSizes(currentPage);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadSizes(newPage);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refresh")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalSizes")}</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElements}</div>
            <p className="text-xs text-muted-foreground">
              {t("availableProductSizes")}
            </p>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("currentPage")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPage + 1}</div>
            <p className="text-xs text-muted-foreground">
              {t("ofPages", { totalPages })}
            </p>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("itemsPerPage")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sizes.length}</div>
            <p className="text-xs text-muted-foreground">
              {t("showingOnCurrentPage")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sizes Table */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            {t("productSizes")}
          </CardTitle>
          <CardDescription>
            {t("listOfAllAvailableSizes")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sizes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Ruler className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("noSizesFound")}</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("id")}</TableHead>
                    <TableHead>{t("name")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sizes.map((size) => (
                    <TableRow key={size.id}>
                      <TableCell className="font-medium">
                        {size.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {size.name}
                          </Badge>
                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalElements}
                itemsPerPage={20}
                itemName="sizes"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
