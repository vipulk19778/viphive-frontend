import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useResetPassword } from "../hooks/useAuth";

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
  const { email, otp } = useSearch({ from: "/_auth/reset-password" });
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
        email,
        otp,
        newPassword: data.newPassword,
      });
      await navigate({ to: "/login" });
    } catch {
      // Mutation error is rendered below the password fields.
    }
  };

  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
        Account recovery
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        Create New Password
      </h1>
      <p className="mt-3 max-w-md leading-6 text-slate-500 dark:text-slate-400">
        Choose a new password for your VIPHive account.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5B942]/15 text-[#DFA62E] dark:text-[#F5C451]">
          <KeyRound className="h-7 w-7" />
        </div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          New password
          <input
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-[#F5B942] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-[#F5B942] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
          <Link to="/login" className="font-bold text-amber-600">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
