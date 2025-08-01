"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type {
  RevenueByMonthDTO,
  OrderStatsDTO,
  TopSellingDTO
} from "@/api-client/models";
import {
  fetchMonthlyRevenue,
  fetchOrderRevenueSummary,
  fetchTopSellingProducts
} from "@/lib/data/statistics";


/**
 * Get monthly revenue data
 */
export async function getMonthlyRevenueAction(
  startDate: string,
  endDate: string
): Promise<ActionResponse<RevenueByMonthDTO[]>> {
  try {
    const data = await fetchMonthlyRevenue(startDate, endDate);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch monthly revenue",
    };
  }
}

/**
 * Get order and revenue summary
 */
export async function getOrderRevenueSummaryAction(
  startDate: string,
  endDate: string
): Promise<ActionResponse<OrderStatsDTO>> {
  try {
    const data = await fetchOrderRevenueSummary(startDate, endDate);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch order revenue summary",
    };
  }
}

/**
 * Get top selling products
 */
export async function getTopSellingProductsAction(
  startDate: string,
  endDate: string
): Promise<ActionResponse<TopSellingDTO[]>> {
  try {
    const data = await fetchTopSellingProducts(startDate, endDate);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch top selling products",
    };
  }
}
