import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";

import { z } from "zod";

const loginSearchSchema = z.object({
  redirectTo: z.enum(["/checkout"]).optional(),
});

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: loginSearchSchema,
});
