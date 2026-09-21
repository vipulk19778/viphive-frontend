import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useChangePassword, useSendAuthOtp } from "../hooks/useAuth";

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

export function ChangePasswordPage() {
  const sendOtpMutation = useSendAuthOtp();
  const sendOtp = sendOtpMutation.mutate;
  const changePasswordMutation = useChangePassword();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpInfo, setOtpInfo] = useState<string>("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    sendOtp(
      { purpose: "CHANGE_PASSWORD" },
      {
        onSuccess: () => setOtpInfo("Verification code sent."),
        onError: () => setOtpInfo(""),
      },
    );
  }, [sendOtp]);

  const otpErrorMessage =
    changePasswordMutation.isError &&
    changePasswordMutation.error instanceof Error &&
    /otp|code/i.test(changePasswordMutation.error.message)
      ? changePasswordMutation.error.message
      : "";

  const passwordErrorMessage =
    changePasswordMutation.isError &&
    changePasswordMutation.error instanceof Error &&
    !/otp|code/i.test(changePasswordMutation.error.message)
      ? changePasswordMutation.error.message
      : "";

  const updateDigit = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value.replace(/\D/g, "").slice(-1);
    if (otpInfo) setOtpInfo("");
    if (changePasswordMutation.isError) changePasswordMutation.reset();
    setDigits(next);
    if (next[index] && index < OTP_LENGTH - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await changePasswordMutation.mutateAsync({
        otp: digits.join(""),
        newPassword: data.newPassword,
      });
      setOtpInfo("");
      setDigits(Array(OTP_LENGTH).fill(""));
      reset();
    } catch {
      // Normalized API error is rendered below.
    }
  };

  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
        Account security
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        Change your password.
      </h1>
      <p className="mt-3 max-w-md leading-6 text-slate-500 dark:text-slate-400">
        We sent a verification code to your logged-in email address.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5B942]/15 text-[#DFA62E] dark:bg-[#F5B942]/15 dark:text-[#F5C451]">
          <KeyRound className="h-7 w-7" />
        </div>
        {sendOtpMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
            {sendOtpMutation.error instanceof Error
              ? sendOtpMutation.error.message
              : "Unable to send OTP."}
          </p>
        )}
        {!!otpInfo && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {otpInfo}
          </p>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Verification code
          </p>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value)}
                inputMode="numeric"
                maxLength={1}
                aria-label={`Password change OTP digit ${index + 1}`}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-bold text-slate-950 outline-none focus:border-[#F5B942] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            ))}
          </div>
          {!!otpErrorMessage && (
            <p className="mt-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
              {otpErrorMessage}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            changePasswordMutation.reset();
            setOtpInfo("");
            sendOtp(
              { purpose: "CHANGE_PASSWORD" },
              {
                onSuccess: () => setOtpInfo("Verification code sent."),
                onError: () => setOtpInfo(""),
              },
            );
          }}
          disabled={sendOtpMutation.isPending}
          className="cursor-pointer text-sm font-bold text-amber-600 disabled:cursor-not-allowed"
        >
          {sendOtpMutation.isPending ? "Sending..." : "Resend code"}
        </button>
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
          Confirm new password
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
        {changePasswordMutation.isSuccess && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            Password changed successfully.
          </p>
        )}
        {!!passwordErrorMessage && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
            {passwordErrorMessage || "Unable to change password."}
          </p>
        )}
        <button
          type="submit"
          disabled={
            changePasswordMutation.isPending ||
            digits.join("").length !== OTP_LENGTH
          }
          className="w-full cursor-pointer rounded-xl bg-slate-950 px-4 py-3.5 font-bold text-white transition hover:bg-[#F5B942] hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#F5B942] dark:text-slate-950 dark:hover:bg-[#E5A52E]"
        >
          {changePasswordMutation.isPending
            ? "Changing password..."
            : "Change password"}
        </button>
        <Link
          to="/profile"
          className="block text-center text-sm font-bold text-amber-600"
        >
          Back to profile
        </Link>
      </form>
    </div>
  );
}
