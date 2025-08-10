"use server";

import { GetOrdersForUserOrderStatusEnum } from "@/api-client";
import {
  cancelOrderApi,
  fetchAllOrdersUserApi,
  updateOrderAddressApi,
  searchOrdersForAdmin,
  fetchOrderById,
  deleteOrder,
  cancelOrder,
} from "@/lib/data/order";
import type { ActionResponse } from "@/lib/types/actions";
import type {
  OrderResponse,
  PageResponseOrderResponse
} from "@/api-client/models";
import { SearchOrdersForAdminOrderStatusEnum } from "@/api-client/apis/order-controller-api";

/**
 * Cancel an order by ID using API.
 */
export async function cancelOrderAction(orderId: string) {
  try {
    await cancelOrderApi(Number(orderId));
    return { status: 200, message: "Order canceled" };
  } catch (error) {
    return { status: 500, message: "Server error! Try later", error };
  }
}
export async function getAllOrderUserAction(status: string) {
  try {
    const orders = await fetchAllOrdersUserApi(status as GetOrdersForUserOrderStatusEnum);
    console.log(orders)
    return {
      status: 200,
      orders,
    };
  } catch (error) {
    return {
      status: 500,
      message: "server error",
      error,
    };
  }
}
export async function updateAddressForOrderByID(orderId: number, addressId: number) {
  try {
    const orders = await updateOrderAddressApi(orderId, {
      addressId: addressId
    });
    return {
      status: 200,
      orders,
    };
  } catch (error) {
    return {
      status: 500,
      message: "server error",
      error,
    };
  }
}
export async function rejectOrderAction(orderId: string) {
  // Not implemented: No API for reject order
  return { status: 501, message: "Reject order API not implemented" };
}

export async function acceptOrderAction(orderId: string) {
  // Not implemented: No API for accept order
  return { status: 501, message: "Accept order API not implemented" };
}

export async function completeOrderAction(orderId: string) {
  // Not implemented: No API for complete order
  return { status: 501, message: "Complete order API not implemented" };
}

// Admin Actions

/**
 * Search orders for admin
 */
export async function searchOrdersForAdminAction(
  startDate: string,
  endDate: string,
  page: number = 0,
  size: number = 10,
  sort: string[] = ["id,desc"],
  orderStatus?: SearchOrdersForAdminOrderStatusEnum
): Promise<ActionResponse<PageResponseOrderResponse>> {
  try {
    const data = await searchOrdersForAdmin(startDate, endDate, page, size, sort, orderStatus);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

/**
 * Get order details by ID
 */
export async function getOrderDetailsAction(
  id: number
): Promise<ActionResponse<OrderResponse>> {
  try {
    const data = await fetchOrderById(id);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch order details",
    };
  }
}

/**
 * Delete an order (admin only)
 */
export async function deleteOrderAction(
  id: number
): Promise<ActionResponse<void>> {
  try {
    await deleteOrder(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete order",
    };
  }
}

/**
 * Cancel an order (admin)
 */
export async function cancelOrderAdminAction(
  orderId: number
): Promise<ActionResponse<OrderResponse>> {
  try {
    const data = await cancelOrder(orderId);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to cancel order",
    };
  }
}
