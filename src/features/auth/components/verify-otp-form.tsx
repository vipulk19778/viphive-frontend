"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ClipboardEvent, FormEvent, KeyboardEvent } from "react";

import { verifyOtpSchema } from "../schemas/auth.schema";

import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/services/api/auth.api";
import { logger } from "@/lib/logger";

import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth.slice";

interface VerifyOtpFormProps {
  email: string;
}

function getOtpErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const responseData = error.data;

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }
  }

  return "That code could not be verified. Check the code and try again.";
}

export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const autoSubmittedRef = useRef(false);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();

  useEffect(() => {
    if (resendCooldown === 0) return;

    const timer = window.setInterval(() => {
      setResendCooldown((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const otp = otpDigits.join("");

  useEffect(() => {
    if (otp.length === 6 && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      void verifyOtp({ email, otp })
        .unwrap()
        .then((response) => {
          if (response.user) dispatch(setCredentials(response.user));
          router.push("/");
        })
        .catch((error) => {
          logger.error("OTP verification failed:", error);
          setSubmitError(getOtpErrorMessage(error));
        });
    }
  }, [dispatch, email, otp, router, verifyOtp]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);
    autoSubmittedRef.current = false;
    setSubmitError("");

    if (digit && index < 5) focusInput(index + 1);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedDigits) return;

    setOtpDigits(
      Array.from({ length: 6 }, (_, index) => pastedDigits[index] ?? ""),
    );
    autoSubmittedRef.current = false;
    focusInput(Math.min(pastedDigits.length, 5));
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      const nextDigits = [...otpDigits];
      nextDigits[index - 1] = "";
      setOtpDigits(nextDigits);
      focusInput(index - 1);
    }

    if (event.key === "ArrowLeft" && index > 0) focusInput(index - 1);
    if (event.key === "ArrowRight" && index < 5) focusInput(index + 1);
  };

  const handleFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitError("");
      const result = verifyOtpSchema.safeParse({ email, otp });

      if (!result.success) {
        setSubmitError(
          result.error.issues[0]?.message ?? "Enter a valid 6-digit code.",
        );
        return;
      }

      try {
        const response = await verifyOtp(result.data).unwrap();

        if (response.user) {
          dispatch(setCredentials(response.user));
        }

        router.push("/");
      } catch (error) {
        logger.error("OTP verification failed:", error);
        setSubmitError(getOtpErrorMessage(error));
      }
    },
    [dispatch, email, otp, router, verifyOtp],
  );

  const handleResend = async () => {
    if (resendCooldown > 0 || isSending) return;

    setResendMessage("");
    setSubmitError("");
    try {
      await sendOtp({ email }).unwrap();
      setResendCooldown(30);
      setResendMessage("A new code was sent. Check your inbox.");
    } catch (error) {
      logger.error("OTP resend failed:", error);
      setResendMessage("We could not resend the code. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" id="otp-label">
              Verification code
            </label>
            <span className="text-xs text-muted-foreground">6 digits</span>
          </div>

          <div
            className="mt-3 grid grid-cols-6 gap-2 sm:gap-3"
            role="group"
            aria-labelledby="otp-label"
          >
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${index + 1} of 6`}
                maxLength={1}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value)}
                onPaste={handlePaste}
                onKeyDown={(event) => handleKeyDown(index, event)}
                disabled={isLoading}
                className="aspect-square w-full rounded-xl border bg-background text-center text-xl font-semibold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 sm:text-2xl"
              />
            ))}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            The code expires shortly. You can paste all six digits at once.
          </p>
        </div>

        {submitError && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Verifying code..." : "Verify email"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={isSending || resendCooldown > 0}
        className="w-full text-sm text-muted-foreground underline underline-offset-4 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
      >
        {isSending
          ? "Sending..."
          : resendCooldown > 0
            ? `Resend available in ${resendCooldown}s`
            : "Resend OTP"}
      </button>

      {resendMessage && (
        <p role="status" className="text-center text-sm text-muted-foreground">
          {resendMessage}
        </p>
      )}
    </div>
  );
}
