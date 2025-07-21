import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(4, { message: "Username must be at least 4 characters." }),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(1, { message: "Name is required." }),
  confirmPassword: z.string().min(4, { message: "Confirm password must be at least 4 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});
