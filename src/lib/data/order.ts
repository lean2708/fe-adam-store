import {
  GetOrdersForUserOrderStatusEnum,
  type OrderResponse,
  type PageResponseOrderResponse,
  type OrderRequest,
  type ShippingRequest,
  type PaymentCallbackRequest,
  type OrderAddressRequest
} from "@/api-client";
import { SearchOrdersForAdminOrderStatusEnum } from "@/api-client/apis/order-controller-api";
import { ControllerFactory } from "./factory-api-client";

/**
 * Helper to get an instance of OrderControllerApi with NextAuth using factory.
 */
async function getOrderController() {
  return await ControllerFactory.getOrderController();
}

/**
 * Calculate shipping fee for an order.
 */
export async function calculateShippingFeeApi(shippingRequest: ShippingRequest) {
  const api = await getOrderController();
  const response = await api.calculateShippingFee({ shippingRequest });
  return response.data.result;
}

/**
 * Cancel an order by ID.
 */
export async function cancelOrderApi(orderId: number) {
  const api = await getOrderController();
  const response = await api.cancelOrder({ orderId });
  return response.data.result;
}

/**
 * Create a new order.
 */
export async function createOrderApi(orderRequest: OrderRequest) {
  const api = await getOrderController();
  const response = await api.create1({ orderRequest });
  return response.data.result;
}

/**
 * Delete an order by ID (admin).
 */
export async function deleteOrderApi(id: number) {
  const api = await getOrderController();
  const response = await api.delete7({ id });
  return response.data.code === 0;
}

/**
 * Fetch all orders (admin).
 */
// export async function fetchAllOrdersApi(page?: number, size?: number, sort?: string[]) {
//   const api = await getOrderController();
//   const response = await api.fetchAll11({ page, size, sort });
//   // Optionally transform each order
//   return response.data.result;
// }

export async function fetchAllOrdersUserApi(status: GetOrdersForUserOrderStatusEnum) {
  const api = await getOrderController();
  const response = await api.getOrdersForUser({ orderStatus: status });
  return response.data.result;
}
/**
 * Fetch order detail by ID.
 */
export async function fetchOrderDetailByIdApi(id: number) {
  const api = await getOrderController();
  const response = await api.fetchDetailById1({ id });
  return response.data.result;
}

/**
 * Pay for an order via VNPAY.
 */
export async function payOrderApi(orderId: number) {
  const api = await getOrderController();
  const response = await api.pay({ orderId });
  return response.data.result;
}

/**
 * Payment callback handler for order.
 */
export async function payCallbackHandlerApi(paymentCallbackRequest: PaymentCallbackRequest) {
  const api = await getOrderController();
  const response = await api.payCallbackHandler({ paymentCallbackRequest });
  return response.data.result;
}

/**
 * Retry payment for an order.
 */
export async function retryPaymentApi(orderId: number) {
  const api = await getOrderController();
  const response = await api.retryPayment({ orderId });
  return response.data.result;
}

/**
 * Search orders for current user or admin.
 */
// export async function searchOrderApi(page?: number, size?: number, sort?: string[], search?: string[]) {
//   const api = await getOrderController();
//   const response = await api.searchOrder({ page, size, sort, search });
//   return response.data.result;
// }

/**
 * Update address for an order.
 */
export async function updateOrderAddressApi(orderId: number, orderAddressRequest: OrderAddressRequest) {
  const api = await getOrderController();
  const response = await api.updateAddress({ orderId, orderAddressRequest });
  return response.data.result;
}

/**
 * Search orders for admin with filtering
 */
export async function searchOrdersForAdmin(
  startDate: string,
  endDate: string,
  page: number = 0,
  size: number = 10,
  sort: string[] = ["id,desc"],
  orderStatus?: SearchOrdersForAdminOrderStatusEnum
): Promise<PageResponseOrderResponse> {
  const controller = await ControllerFactory.getOrderController();
  const response = await controller.searchOrdersForAdmin({
    startDate,
    endDate,
    page,
    size,
    sort,
    orderStatus
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to search orders");
  }

  return response.data.result!;
}

/**
 * Get order details by ID
 */
export async function fetchOrderById(id: number): Promise<OrderResponse> {
  const controller = await ControllerFactory.getOrderController();
  const response = await controller.fetchDetailById1({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch order details");
  }

  return response.data.result!;
}

/**
 * Delete an order (admin only)
 */
export async function deleteOrder(id: number): Promise<void> {
  const controller = await ControllerFactory.getOrderController();
  const response = await controller.delete7({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to delete order");
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: number): Promise<OrderResponse> {
  const controller = await ControllerFactory.getOrderController();
  const response = await controller.cancelOrder({ orderId });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to cancel order");
  }

  return response.data.result!;
}
