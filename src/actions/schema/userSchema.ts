import { z } from "zod";

// Base user schema for common fields
const baseUserSchema = z.object({
  name: z
    .string()
    .min(1, "Tên người dùng là bắt buộc")
    .min(2, "Tên người dùng phải có ít nhất 2 ký tự")
    .max(100, "Tên người dùng không được vượt quá 100 ký tự"),
  
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Địa chỉ email không hợp lệ")
    .max(255, "Email không được vượt quá 255 ký tự"),
  
  roleIds: z
    .array(z.number().int().positive())
    .min(1, "Ít nhất một vai trò là bắt buộc"),
  
  dob: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ngày sinh không hợp lệ",
    }),
  
  gender: z
    .enum(["MALE", "FEMALE", "OTHER"])
    .optional(),
});

// Schema for creating a new user
export const userCreateSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
  
  confirmPassword: z
    .string()
    .min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  }
);

// Schema for updating a user (password is optional)
export const userUpdateSchema = baseUserSchema.extend({
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 0 || val.length >= 6, {
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    })
    .refine((val) => !val || val.length <= 100, {
      message: "Mật khẩu không được vượt quá 100 ký tự",
    }),

  confirmPassword: z
    .string()
    .optional(),
}).refine(
  (data) => {
    // If password is provided and not empty, confirmPassword must match
    if (data.password && data.password.trim().length > 0) {
      return data.password === data.confirmPassword;
    }
    return true;
  },
  {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  }
);

// Combined schema for forms (handles both create and update)
export const userFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tên người dùng là bắt buộc")
      .min(2, "Tên người dùng phải có ít nhất 2 ký tự")
      .max(100, "Tên người dùng không được vượt quá 100 ký tự"),
    
    email: z
      .string()
      .min(1, "Email là bắt buộc")
      .email("Địa chỉ email không hợp lệ")
      .max(255, "Email không được vượt quá 255 ký tự"),
    
    password: z
      .string()
      .optional(),
    
    confirmPassword: z
      .string()
      .optional(),
    
    roleIds: z
      .array(z.number().int().positive())
      .min(1, "Ít nhất một vai trò là bắt buộc"),
    
    dob: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Ngày sinh không hợp lệ",
      }),
    
    gender: z
      .enum(["MALE", "FEMALE", "OTHER"])
      .optional(),
    
    // Helper field to determine if this is a create or update operation
    isEditing: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // For create operations, password is required
      if (!data.isEditing) {
        return data.password && data.password.length >= 6;
      }
      // For update operations, password is optional
      return true;
    },
    {
      message: "Mật khẩu là bắt buộc và phải có ít nhất 6 ký tự",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      // If password is provided, confirmPassword must match
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    }
  );

// Type exports
export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;

// Transform form data to API request format
export function transformUserFormToCreateRequest(data: UserFormData) {
  return {
    name: data.name,
    email: data.email,
    password: data.password!,
    roleIds: data.roleIds,
    dob: data.dob,
    gender: data.gender,
  };
}

export function transformUserFormToUpdateRequest(data: UserFormData) {
  const updateData: any = {
    name: data.name,
    roleIds: data.roleIds,
    dob: data.dob,
    gender: data.gender,
  };
  
  // Only include password if it's provided
  if (data.password && data.password.length > 0) {
    updateData.password = data.password;
  }
  
  return updateData;
}
