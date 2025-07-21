import { z } from "zod";

// 1. Define the base schema for product variants FIRST
export const productVariantSchema = z.object({
  colorId: z.number().int(),
  sizeId: z.number().int(),
  price: z.number().min(0),
  quantity: z.number().int().min(0),
  imageId: z.number().int(),
  isAvailable: z.boolean().optional(),
  status: z.string().optional(),
  sku: z.string().optional(),
  discount: z.number().min(0).optional(),
});

// 2. Define the schema for creating a product
export const productCreateSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  categoryId: z.number().int(),
  brandId: z.number().int().optional(),
  images: z.array(z.number().int()).optional(),
  variants: z.array(productVariantSchema).min(1, { message: "At least one variant is required." }),
  tags: z.array(z.string()).optional(),
  status: z.string().optional(),
});

// 3. Define the schema for updating a product
export const productUpdateSchema = productCreateSchema.partial().extend({
  variants: z.array(productVariantSchema).default([]),
});
