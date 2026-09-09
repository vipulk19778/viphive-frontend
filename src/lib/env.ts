import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("VIPHive"),

  NEXT_PUBLIC_API_URL: z.string().url(),

  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,

  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,

  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
});
