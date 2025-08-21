"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type {
  OrderStatsDTO,
  TopSellingDTO
} from "@/api-client/models";
import type { TRevenueByMonth } from "@/types";
import {
  exportOrderRevenueToExcel,
  fetchMonthlyRevenue,
  fetchOrderRevenueSummary,
  fetchTopSellingProducts,
} from "@/lib/data/statistics";
import { extractErrorMessage } from "@/lib/utils";
import { log } from "console";


/**
 * Get monthly revenue data
 */
export async function getMonthlyRevenueAction(
  startDate: string,
  endDate: string
): Promise<ActionResponse<TRevenueByMonth[]>> {
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
      data
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch top selling products",
    };
  }
}

/**
 * Get top selling products
 */
export async function getexportOrderRevenueToExcel(
  startDate: string,
  endDate: string
): Promise<ActionResponse<{ base64: string; filename: string; contentType: string }>> {
  try {
    const data = await exportOrderRevenueToExcel(startDate, endDate);
    
    return { success: true, data };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Xóa chi nhánh thất bại");
    console.error("Export failed:", error);
    return { success: false, message: extractedError.message };
  }
}