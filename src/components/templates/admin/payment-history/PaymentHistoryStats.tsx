"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
  CreditCard,
  CheckCircle,
  Clock,
  RotateCcw,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import type { TPaymentHistory } from "@/types";

interface PaymentHistoryStatsProps {
  payments: TPaymentHistory[];
  totalElements: number;
}

export function PaymentHistoryStats({
  payments,
  totalElements,
}: PaymentHistoryStatsProps) {
  const t = useTranslations("Admin.paymentHistory");

  // Calculate statistics from payments
  const paidPayments = payments.filter(
    (payment) => payment.paymentStatus === "PAID"
  ).length;
  const pendingPayments = payments.filter(
    (payment) => payment.paymentStatus === "PENDING"
  ).length;
  const refundedPayments = payments.filter(
    (payment) => payment.paymentStatus === "REFUNDED"
  ).length;
  const canceledPayments = payments.filter(
    (payment) => payment.paymentStatus === "CANCELED"
  ).length;
  const failedPayments = payments.filter(
    (payment) => payment.paymentStatus === "FAILED"
  ).length;

  const stats = [
    {
      title: t("totalPayments"),
      value: totalElements,
      description: t("recentPayments"),
      icon: CreditCard,
      color: "from-blue-50 to-blue-100 border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
      valueColor: "text-blue-900",
    },
    {
      title: t("paidPayments"),
      value: paidPayments,
      description: t("paid"),
      icon: CheckCircle,
      color: "from-green-50 to-green-100 border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
      valueColor: "text-green-900",
    },
    {
      title: t("pendingPayments"),
      value: pendingPayments,
      description: t("pending"),
      icon: Clock,
      color: "from-yellow-50 to-yellow-100 border-yellow-200",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-900",
    },
    {
      title: t("refundedPayments"),
      value: refundedPayments,
      description: t("refunded"),
      icon: RotateCcw,
      color: "from-purple-50 to-purple-100 border-purple-200",
      iconColor: "text-purple-600",
      textColor: "text-purple-800",
      valueColor: "text-purple-900",
    },
    {
      title: t("canceledPayments"),
      value: canceledPayments,
      description: t("canceled"),
      icon: XCircle,
      color: "from-red-50 to-red-100 border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
      valueColor: "text-red-900",
    },
    {
      title: t("failedPayments"),
      value: failedPayments,
      description: t("failed"),
      icon: AlertTriangle,
      color: "from-orange-50 to-orange-100 border-orange-200",
      iconColor: "text-orange-600",
      textColor: "text-orange-800",
      valueColor: "text-orange-900",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t("title")}</h2>
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
              <p className={`text-xs ${stat.textColor}`}>{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
