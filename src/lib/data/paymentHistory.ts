import { ControllerFactory } from "./factory-api-client";
import type {
  PageResponsePaymentHistoryResponse
} from "@/api-client/models";

/**
 * Search payment histories for admin
 */
export async function searchPaymentHistories(
  startDate: string,
  endDate: string,
  page: number = 0,
  size: number = 10,
  sort: string[] = ["paymentTime,desc"],
  paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED'
): Promise<PageResponsePaymentHistoryResponse> {
  const controller = await ControllerFactory.getPaymentHistoryController();
  const response = await controller.searchPaymentHistories({
    startDate,
    endDate,
    page,
    size,
    sort,
    paymentStatus: paymentStatus as any
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to search payment histories");
  }

  return response.data.result || { 
    page: 0, 
    size: 0, 
    totalPages: 0, 
    totalItems: 0, 
    items: [] 
  };
}

/**
 * Delete payment history
 */
export async function deletePaymentHistory(id: number): Promise<void> {
  const controller = await ControllerFactory.getPaymentHistoryController();
  const response = await controller.delete6({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to delete payment history");
  }
}
