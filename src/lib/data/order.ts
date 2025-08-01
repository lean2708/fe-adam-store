
import { GetOrdersForUserOrderStatusEnum, OrderControllerApi } from "@/api-client";
import { getAuthConfiguration } from "@/api-client/init-auth-config";
/**
 * Helper to get an instance of OrderControllerApi with auth config.
 */
async function getOrderController() {
  return new OrderControllerApi(await getAuthConfiguration());
}
/**
 * Helper to get an instance of OrderControllerApi with NextAuth.
 */


// Example transform function (customize as needed)
function transformOrderResponse(apiOrder: any) {
  // Map API order response to your app's order type if needed
  return apiOrder;
}

/**
 * Calculate shipping fee for an order.
 */
export async function calculateShippingFeeApi(shippingRequest: any) {
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
export async function createOrderApi(orderRequest: any) {
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
 * Fetch all orders (client).
 */
// Nếu enum nằm riêng

export async function fetchAllOrdersUserApi(status: GetOrdersForUserOrderStatusEnum) {
  const api = await getOrderController();
  const response = await api.getOrdersForUser({ orderStatus: status });
  return response.data.result;
}
/*
 * Fetch all orders (admin).
 */
// export async function fetchAllOrdersApi(page?: number, size?: number, sort?: string[]) {
//   const api = await getOrderController();
//   const response = await api.fetchAll11({ page, size, sort });
//   // Optionally transform each order
//   return response.data.result;
// }

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
export async function payCallbackHandlerApi(paymentCallbackRequest: any) {
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
export async function updateOrderAddressApi(orderId: number, orderAddressRequest: any) {
  const api = await getOrderController();
  const response = await api.updateAddress({ orderId, orderAddressRequest });
  return response.data.result;
}
