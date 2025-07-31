import { z } from "zod";

export const branchSchema = z.object({
  name: z
    .string()
    .min(1, "Tên chi nhánh không được để trống")
    .min(2, "Tên chi nhánh phải có ít nhất 2 ký tự")
    .max(100, "Tên chi nhánh không được vượt quá 100 ký tự"),
  
  location: z
    .string()
    .min(1, "Địa chỉ không được để trống")
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(255, "Địa chỉ không được vượt quá 255 ký tự"),
  
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ")
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(15, "Số điện thoại không được vượt quá 15 số"),
});

export const updateBranchSchema = z.object({
  name: z
    .string()
    .min(2, "Tên chi nhánh phải có ít nhất 2 ký tự")
    .max(100, "Tên chi nhánh không được vượt quá 100 ký tự")
    .optional(),
  
  location: z
    .string()
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(255, "Địa chỉ không được vượt quá 255 ký tự")
    .optional(),
  
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ")
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(15, "Số điện thoại không được vượt quá 15 số")
    .optional(),
});

export type BranchFormData = z.infer<typeof branchSchema>;
export type UpdateBranchFormData = z.infer<typeof updateBranchSchema>;
