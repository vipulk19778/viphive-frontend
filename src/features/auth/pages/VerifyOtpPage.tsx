import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { useVerifyOtp } from "../hooks/useAuth";
import {
  verifyOtpSchema,
  type VerifyOtpFormData,
} from "../schemas/auth.schema";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const { email, purpose } = useSearch({ from: "/verify-otp" });
  const verifyOtpMutation = useVerifyOtp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, otp: "", purpose },
  });
  const onSubmit = async (data: VerifyOtpFormData) => {
    try {
      await verifyOtpMutation.mutateAsync(data);
      await navigate({ to: "/" });
    } catch {
      /* mutation state renders the error */
    }
  };

  return (
    <AuthLayout
      eyebrow="One last step"
      title="Verify your email."
      description={`Enter the code we sent to ${email} to unlock your VIPHive account.`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400">
          <MailCheck className="h-7 w-7" />
        </div>
        <input type="hidden" {...register("email")} />
        <input type="hidden" {...register("purpose")} />
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Verification code
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            {...register("otp")}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl tracking-[0.5em] text-slate-950 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.otp && (
            <span className="mt-1 block text-xs font-medium text-rose-500">
              {errors.otp.message}
            </span>
          )}
        </label>
        {verifyOtpMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            That code could not be verified. Please try again.
          </p>
        )}
        <button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className="w-full rounded-xl bg-slate-950 px-4 py-3.5 font-bold text-white transition hover:bg-amber-400 hover:text-slate-950 disabled:opacity-50 dark:bg-amber-400 dark:text-slate-950"
        >
          {verifyOtpMutation.isPending ? "Verifying..." : "Verify email"}
        </button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="font-bold text-amber-600">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
