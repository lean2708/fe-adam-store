import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  imageUrl: z.string().optional(),
});

export const categoryUpdateSchema = categorySchema.partial();
