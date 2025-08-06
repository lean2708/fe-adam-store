import { z } from "zod";

export const productVariantSchema = z.object({
  productId: z.number().int().positive("Product ID is required"),
  colorId: z.number().int().positive("Color ID is required"),
  sizeId: z.number().int().positive("Size ID is required"),
  price: z.number().min(0, "Price must be non-negative"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
});

export const productVariantUpdateSchema = z.object({
  price: z.number().min(0, "Price must be non-negative").optional(),
  quantity: z.number().int().min(0, "Quantity must be non-negative").optional(),
});

export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
export type ProductVariantUpdateFormData = z.infer<typeof productVariantUpdateSchema>;
