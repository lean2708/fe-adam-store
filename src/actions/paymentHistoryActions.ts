"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type { TPaymentHistory } from "@/types";
import {
  searchPaymentHistories,
  deletePaymentHistory
} from "@/lib/data/paymentHistory";
import { transformPaymentHistoryResponses } from "@/lib/data/transfer";

/**
 * Search payment histories for admin
 */
export async function searchPaymentHistoriesAction(
  startDate: string,
  endDate: string,
  page: number = 0,
  size: number = 10,
  sort: string[] = ["paymentTime,desc"],
  paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED'
): Promise<ActionResponse<{ items: TPaymentHistory[]; totalItems: number; totalPages: number }>> {
  try {
    const data = await searchPaymentHistories(
      startDate,
      endDate,
      page,
      size,
      sort,
      paymentStatus
    );
    return {
      success: true,
      data: {
        items: transformPaymentHistoryResponses(data.items || []),
        totalItems: data.totalItems || 0,
        totalPages: data.totalPages || 0
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to search payment histories",
    };
  }
}

/**
 * Delete payment history
 */
export async function deletePaymentHistoryAction(
  id: number
): Promise<ActionResponse<void>> {
  try {
    await deletePaymentHistory(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete payment history",
    };
  }
}
