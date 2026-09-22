import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuthStore } from "@/stores/auth.store";

import {
  useChangePassword,
  useSendAuthOtp,
  useVerifyAuthOtp,
} from "../hooks/useAuth";

const OTP_LENGTH = 6;

const changePasswordSchema = z
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

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const maskEmail = (email = "") => {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  return `${localPart.slice(0, 1)}${"*".repeat(Math.max(localPart.length - 1, 3))}@${domain}`;
};

export function ChangePasswordPage() {
  const user = useAuthStore((state) => state.user);
  const sendOtpMutation = useSendAuthOtp();
  const verifyOtpMutation = useVerifyAuthOtp();
  const changePasswordMutation = useChangePassword();
  const [step, setStep] = useState<"send" | "verify" | "password">("send");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const sendOtp = () => {
    sendOtpMutation.mutate(
      { purpose: "CHANGE_PASSWORD" },
      {
        onSuccess: () => {
          setDigits(Array(OTP_LENGTH).fill(""));
          verifyOtpMutation.reset();
          setStep("verify");
          window.setTimeout(() => inputRefs.current[0]?.focus(), 0);
        },
      },
    );
  };

  const updateDigit = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value.replace(/\D/g, "").slice(-1);
    verifyOtpMutation.reset();
    setDigits(next);
    if (next[index] && index < OTP_LENGTH - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Backspace") return;
    event.preventDefault();
    const next = [...digits];
    if (next[index]) next[index] = "";
    else if (index > 0) {
      next[index - 1] = "";
      inputRefs.current[index - 1]?.focus();
    }
    verifyOtpMutation.reset();
    setDigits(next);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    setDigits(
      Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] ?? ""),
    );
    verifyOtpMutation.reset();
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const verifyOtp = () => {
    verifyOtpMutation.mutate(
      { otp: digits.join(""), purpose: "CHANGE_PASSWORD" },
      { onSuccess: () => setStep("password") },
    );
  };

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await changePasswordMutation.mutateAsync({
        otp: digits.join(""),
        newPassword: data.newPassword,
      });
      reset();
      setDigits(Array(OTP_LENGTH).fill(""));
    } catch {
      // Mutation error is rendered below the password fields.
    }
  };

  return (
    <div className="min-w-0">
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        Account security
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        {step === "send" && "Change Password"}
        {step === "verify" && "Verify it's you"}
        {step === "password" && "Create New Password"}
      </h1>
      <p className="mt-3 max-w-md leading-6 text-slate-500 dark:text-slate-400">
        {step === "send" && "We'll send a verification code to"}
        {step === "verify" && "Enter the 6-digit code sent to"}
        {step === "password" && "Choose a strong password for your account."}
      </p>
      {step !== "password" && (
        <p className="mt-1 break-all text-sm font-semibold text-slate-700 dark:text-slate-200">
          {maskEmail(user?.email)}
        </p>
      )}

      <div className="mt-8 space-y-5">
        <div className="brand-accent-soft flex h-14 w-14 items-center justify-center rounded-2xl">
          <KeyRound className="h-7 w-7" />
        </div>

        {step === "send" && (
          <>
            {sendOtpMutation.isError && (
              <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
                {getErrorMessage(sendOtpMutation.error, "Unable to send OTP.")}
              </p>
            )}
            <button
              type="button"
              onClick={sendOtp}
              disabled={sendOtpMutation.isPending}
              className="brand-primary brand-primary-hover w-full cursor-pointer rounded-xl px-4 py-3.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <div>
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    value={digit}
                    onChange={(event) => updateDigit(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    aria-label={`Password change OTP digit ${index + 1}`}
                    className="brand-accent-focus h-12 w-full rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-bold text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                ))}
              </div>
              {verifyOtpMutation.isError && (
                <p className="mt-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
                  {getErrorMessage(
                    verifyOtpMutation.error,
                    "That code could not be verified.",
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={sendOtpMutation.isPending}
                  className="brand-accent cursor-pointer font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </span>
            </div>
            <button
              type="button"
              onClick={verifyOtp}
              disabled={
                verifyOtpMutation.isPending ||
                digits.join("").length !== OTP_LENGTH
              }
              className="brand-primary brand-primary-hover w-full cursor-pointer rounded-xl px-4 py-3.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verifyOtpMutation.isPending ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === "password" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              New password
              <PasswordInput
                autoComplete="new-password"
                {...register("newPassword")}
                className="brand-accent-focus w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              {errors.newPassword && (
                <span className="mt-1 block text-xs text-rose-500">
                  {errors.newPassword.message}
                </span>
              )}
            </label>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Confirm password
              <PasswordInput
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="brand-accent-focus w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              {errors.confirmPassword && (
                <span className="mt-1 block text-xs text-rose-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </label>
            {changePasswordMutation.isError && (
              <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
                {getErrorMessage(
                  changePasswordMutation.error,
                  "Unable to change password.",
                )}
              </p>
            )}
            {changePasswordMutation.isSuccess && (
              <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                Password changed successfully.
              </p>
            )}
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="brand-primary brand-primary-hover w-full cursor-pointer rounded-xl px-4 py-3.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changePasswordMutation.isPending
                ? "Changing password..."
                : "Change Password"}
            </button>
          </form>
        )}

        <Link
          to="/profile"
          className="brand-accent block text-center text-sm font-bold"
        >
          Back to profile
        </Link>
      </div>
    </div>
  );
}
