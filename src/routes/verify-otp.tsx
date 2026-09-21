import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { VerifyOtpPage } from "@/features/auth/pages/VerifyOtpPage";

const verifyOtpSearchSchema = z.object({
  email: z.string().email(),
  purpose: z.string().default("REGISTER"),
});

export const Route = createFileRoute("/verify-otp")({
  validateSearch: verifyOtpSearchSchema,
  component: VerifyOtpPage,
});
