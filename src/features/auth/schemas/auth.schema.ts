import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),

  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name is too long"),

  email: z.string().trim().email("Enter a valid email address"),

  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must contain 6 digits"),
});

export const sendOtpSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export type SendOtpFormValues = z.infer<typeof sendOtpSchema>;
