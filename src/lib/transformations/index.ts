import type { ColorResponse, PaymentHistoryResponse, PromotionResponse } from "@/api-client/models";
import type { TColor, TPaymentHistory, TPromotion } from "@/types";

/**
 * Transform ColorResponse to TColor
 */
export function transformColorResponse(colorResponse: ColorResponse): TColor {
  return {
    id: colorResponse.id || 0,
    name: colorResponse.name || "",
    variants: [] // Will be populated when needed
  };
}

/**
 * Transform array of ColorResponse to array of TColor
 */
export function transformColorResponses(colorResponses: ColorResponse[]): TColor[] {
  return colorResponses.map(transformColorResponse);
}

/**
 * Transform PaymentHistoryResponse to TPaymentHistory
 */
export function transformPaymentHistoryResponse(paymentHistoryResponse: PaymentHistoryResponse): TPaymentHistory {
  return {
    id: paymentHistoryResponse.id || 0,
    isPrimary: paymentHistoryResponse.isPrimary,
    paymentMethod: paymentHistoryResponse.paymentMethod,
    totalAmount: paymentHistoryResponse.totalAmount,
    paymentStatus: paymentHistoryResponse.paymentStatus as TPaymentHistory['paymentStatus'],
    paymentTime: paymentHistoryResponse.paymentTime
  };
}

/**
 * Transform array of PaymentHistoryResponse to array of TPaymentHistory
 */
export function transformPaymentHistoryResponses(paymentHistoryResponses: PaymentHistoryResponse[]): TPaymentHistory[] {
  return paymentHistoryResponses.map(transformPaymentHistoryResponse);
}

/**
 * Transform PromotionResponse to TPromotion
 */
export function transformPromotionResponse(promotionResponse: PromotionResponse): TPromotion {
  return {
    id: promotionResponse.id || 0,
    code: promotionResponse.code,
    description: promotionResponse.description,
    discountPercent: promotionResponse.discountPercent,
    startDate: promotionResponse.startDate,
    endDate: promotionResponse.endDate,
    status: promotionResponse.status as TPromotion['status'],
    createdBy: promotionResponse.createdBy,
    createdAt: promotionResponse.createdAt
  };
}

/**
 * Transform array of PromotionResponse to array of TPromotion
 */
export function transformPromotionResponses(promotionResponses: PromotionResponse[]): TPromotion[] {
  return promotionResponses.map(transformPromotionResponse);
}
