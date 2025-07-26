import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email().min(1, { message: 'Email is required.' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters.' }),
});

export const signUpSchema = signInSchema
  .extend({
    name: z.string().min(1, { message: 'Name is required.' }),
    confirmPassword: z
      .string()
      .min(4, { message: 'Confirm password must be at least 4 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export const verifyRegistrationSchema = z.object({
  verifyCodeRequest: z.string().min(1, 'Code is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.email().min(1, { message: 'Email is required.' }),
});

export const verifyForgotPasswordSchema = z.object({
  verificationCode: z.string().min(1, 'Code is required'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(4, { message: 'Password must be at least 4 characters.' }),
    confirmPassword: z
      .string()
      .min(4, { message: 'Confirm password must be at least 4 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });
