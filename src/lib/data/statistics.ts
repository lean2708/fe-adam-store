import { ControllerFactory } from "./factory-api-client";
import type { 
  RevenueByMonthDTO, 
  OrderStatsDTO, 
  TopSellingDTO 
} from "@/api-client/models";

/**
 * Get monthly revenue data
 */
export async function fetchMonthlyRevenue(
  startDate: string,
  endDate: string
): Promise<RevenueByMonthDTO[]> {
  const controller = await ControllerFactory.getStatisticsController();
  const response = await controller.getMonthlyRevenue({
    startDate,
    endDate
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch monthly revenue");
  }

  return response.data.result || [];
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
