import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useSendOtp } from "../hooks/useAuth";
import { useAuthStore } from "@/stores/auth.store";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});
type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const sendOtpMutation = useSendOtp();
  const setOtpContext = useAuthStore((state) => state.setOtpContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await sendOtpMutation.mutateAsync({
        email: data.email,
        purpose: "FORGOT_PASSWORD",
      });
      setOtpContext(data.email, "FORGOT_PASSWORD");
      await navigate({
        to: "/verify-otp",
      });
    } catch {
      // Mutation error is rendered below.
    }
  };

  return (
    <div>
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        Account recovery
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        Reset your password.
      </h1>
      <p className="mt-3 max-w-md leading-6 text-slate-500 dark:text-slate-400">
        We will send a six-digit verification code to your email address.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="brand-accent-soft flex h-14 w-14 items-center justify-center rounded-2xl">
          <Mail className="h-7 w-7" />
        </div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="brand-accent-focus mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.email && (
            <span className="mt-1 block text-xs text-rose-500">
              {errors.email.message}
            </span>
          )}
        </label>
        {sendOtpMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
            {sendOtpMutation.error instanceof Error
              ? sendOtpMutation.error.message
              : "Unable to send OTP."}
          </p>
        )}
        <button
          type="submit"
          disabled={sendOtpMutation.isPending}
          className="brand-primary brand-primary-hover w-full cursor-pointer rounded-xl px-4 py-3.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sendOtpMutation.isPending
            ? "Sending code..."
            : "Send verification code"}
        </button>
        <p className="text-center text-sm text-slate-500">
          <Link to="/login" className="brand-accent font-bold">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
