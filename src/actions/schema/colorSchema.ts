import { z } from "zod";

export const colorSchema = z.object({
  name: z
    .string()
    .min(1, "Tên màu không được để trống")
    .min(2, "Tên màu phải có ít nhất 2 ký tự")
    .max(50, "Tên màu không được vượt quá 50 ký tự")
    .regex(/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]+$/, "Tên màu chỉ được chứa chữ cái và khoảng trắng"),
});

export const updateColorSchema = z.object({
  name: z
    .string()
    .min(2, "Tên màu phải có ít nhất 2 ký tự")
    .max(50, "Tên màu không được vượt quá 50 ký tự")
    .regex(/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]+$/, "Tên màu chỉ được chứa chữ cái và khoảng trắng")
    .optional(),
});

export type ColorFormData = z.infer<typeof colorSchema>;
export type UpdateColorFormData = z.infer<typeof updateColorSchema>;
