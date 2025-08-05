"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
  Building,
  MapPin,
  Clock
} from "lucide-react";
import type { TBranch } from "@/types";

interface BranchesStatsProps {
  branches: TBranch[];
}

export function BranchesStats({ branches }: BranchesStatsProps) {
  const t = useTranslations("Admin.branches");

  const activeBranches = branches.filter(b => b.status === 'ACTIVE').length;
  const inactiveBranches = branches.filter(b => b.status !== 'ACTIVE').length;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">{t("totalBranches")}</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{branches.length}</div>
            <p className="text-xs text-blue-700">
              {t("activeStoreLocations")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">{t("activeBranches")}</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{activeBranches}</div>
            <p className="text-xs text-green-700">
              {t("currentlyOperational")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">{t("inactiveBranches")}</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{inactiveBranches}</div>
            <p className="text-xs text-orange-700">
              {t("temporarilyClosed")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
