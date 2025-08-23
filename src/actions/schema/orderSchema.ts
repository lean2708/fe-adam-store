import { PAYMENT_METHODS } from '@/enums';
import { z } from 'zod';

// Schema for individual order items
export const orderItemSchema = z.object({
  productVariantId: z
    .number()
    .min(1, { message: 'Product variant ID is required.' }),
  quantity: z
    .number()
    .int()
    .min(1, { message: 'Quantity must be at least 1.' }),
});

// Schema for calculate shipping fee order
export const shippingFeeSchema = z.object({
  addressId: z.number().min(1, { message: 'Address ID is required.' }),
  orderItems: z
    .array(orderItemSchema)
    .min(1, { message: 'At least one order item is required.' }),
});

// Main order schema based on prepareOrderData structure
export const orderSchema = z.object({
  addressId: z.number().min(1, { message: 'Address ID is required.' }),
  orderItems: z
    .array(orderItemSchema)
    .min(1, { message: 'At least one order item is required.' }),
  shippingFee: z
    .number()
    .min(0, { message: 'Shipping fee must be non-negative.' }),
  paymentMethod: z.enum(PAYMENT_METHODS),
  promotionId: z.number().optional(),
});

// Schema for creating orders
export const createOrderSchema = orderSchema;
export const calculateShippingFeeSchema = shippingFeeSchema;
