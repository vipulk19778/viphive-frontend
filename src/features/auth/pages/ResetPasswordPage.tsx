import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useResetPassword } from "../hooks/useAuth";
import { useAuthStore } from "@/stores/auth.store";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { otpEmail: email, verifiedOtp: otp } = useAuthStore();
  const clearOtpContext = useAuthStore((state) => state.clearOtpContext);
  const resetPasswordMutation = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await resetPasswordMutation.mutateAsync({
        email: email ?? "",
        otp: otp ?? "",
        newPassword: data.newPassword,
      });
      clearOtpContext();
      await navigate({ to: "/login" });
    } catch {
      // Mutation error is rendered below the password fields.
    }
  };

  return (
    <div>
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        Account recovery
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        Create New Password
      </h1>
      <p className="mt-3 max-w-md leading-6 text-slate-500 dark:text-slate-400">
        Choose a new password for your VIPHive account.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="brand-accent-soft flex h-14 w-14 items-center justify-center rounded-2xl">
          <KeyRound className="h-7 w-7" />
        </div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          New password
          <input
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
            className="brand-accent-focus mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.newPassword && (
            <span className="mt-1 block text-xs text-rose-500">
              {errors.newPassword.message}
            </span>
          )}
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Confirm password
          <input
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="brand-accent-focus mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.confirmPassword && (
            <span className="mt-1 block text-xs text-rose-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>
        {resetPasswordMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            {resetPasswordMutation.error instanceof Error
              ? resetPasswordMutation.error.message
              : "Unable to reset password."}
          </p>
        )}
        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="brand-primary brand-primary-hover w-full cursor-pointer rounded-xl px-4 py-3.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resetPasswordMutation.isPending
            ? "Saving password..."
            : "Reset Password"}
        </button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="brand-accent font-bold">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
