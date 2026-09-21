import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  email: z.string().trim().email("Please enter a valid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),

  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),

  purpose: z.string().min(1, "OTP purpose is required"),
});

export const sendOtpSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),

  purpose: z.string().min(1, "OTP purpose is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type SendOtpFormData = z.infer<typeof sendOtpSchema>;
