import { ControllerFactory } from "./factory-api-client";
import type {
  RevenueByMonthDTO,
  OrderStatsDTO,
  TopSellingDTO
} from "@/api-client/models";
import type { TRevenueByMonth } from "@/types";
import { transformRevenueByMonthArrayToTRevenueByMonthArray } from "./transform/statistics";
import { log } from "console";

/**
 * Get monthly revenue data
 */
export async function fetchMonthlyRevenue(
  startDate: string,
  endDate: string
): Promise<TRevenueByMonth[]> {
  const controller = await ControllerFactory.getStatisticsController();
  const response = await controller.getMonthlyRevenue({
    startDate,
    endDate
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch monthly revenue");
  }

  const apiData = response.data.result || [];
  return transformRevenueByMonthArrayToTRevenueByMonthArray(apiData);
}

/**
 * Get order and revenue summary
 */
export async function fetchOrderRevenueSummary(
  startDate: string,
  endDate: string
): Promise<OrderStatsDTO> {
  const controller = await ControllerFactory.getStatisticsController();
  const response = await controller.getOrderRevenueSummary({
    startDate,
    endDate
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch order revenue summary");
  }

  return response.data.result || { totalOrders: 0, totalRevenue: 0 };
}



/**
 * Get top selling products
 */
export async function fetchTopSellingProducts(
  startDate: string,
  endDate: string
): Promise<TopSellingDTO[]> {
  const controller = await ControllerFactory.getStatisticsController();
  const response = await controller.getTopSellingProducts({
    startDate,
    endDate
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch top selling products");
  }

  return response.data.result || [];
}

export async function exportOrderRevenueToExcel(
  startDate: string,
  endDate: string
): Promise<{ base64: string; filename: string; contentType: string }> {
  const controller = await ControllerFactory.getStatisticsController();

  // Use arraybuffer in Node
  const response = await controller.exportOrderRevenueToExcel(
    { startDate, endDate },
    { responseType: "arraybuffer" }
  );

  const filename = filenameFromDisposition(
    response.headers["content-disposition"] as string | undefined,
    `order_revenue_${startDate}_to_${endDate}.xlsx`
  );

  const contentType =
    (response.headers["content-type"] as string) ||
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  
  // Encode to base64 for safe serialization back to the client
  const base64 = Buffer.from(response.data).toString("base64");
  return { base64, filename, contentType };
}
function filenameFromDisposition(h?: string, fallback?: string) {
  if (!h) return fallback || "export.xlsx";
  const star = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(h);
  if (star?.[1]) return decodeURIComponent(star[1].replace(/"/g, ""));
  const plain = /filename="?([^";]+)"?/i.exec(h);
  return (plain && plain[1]) || fallback || "export.xlsx";
}

