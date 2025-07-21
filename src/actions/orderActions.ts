"use server";

import {
  cancelOrderApi,
  // No API for reject/accept/complete in provided data layer, so leave those as not implemented
} from "@/lib/data/order";

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
