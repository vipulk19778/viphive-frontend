import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { useRef, useState } from "react";

import { useSendOtp, useVerifyOtp } from "../hooks/useAuth";

const OTP_LENGTH = 6;

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const { email, purpose } = useSearch({ from: "/_auth/verify-otp" });
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useSendOtp();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const updateDigit = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = nextValue;
    verifyOtpMutation.reset();
    setDigits(nextDigits);

    if (nextValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (nextValue && index === OTP_LENGTH - 1) {
      void submitOtp(nextDigits);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Backspace") return;
    event.preventDefault();
    const nextDigits = [...digits];
    if (nextDigits[index]) nextDigits[index] = "";
    else if (index > 0) {
      nextDigits[index - 1] = "";
      inputRefs.current[index - 1]?.focus();
    }
    verifyOtpMutation.reset();
    setDigits(nextDigits);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const nextDigits = Array.from(
      { length: OTP_LENGTH },
      (_, index) => pasted[index] ?? "",
    );
    verifyOtpMutation.reset();
    setDigits(nextDigits);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const submitOtp = async (nextDigits = digits) => {
    try {
      await verifyOtpMutation.mutateAsync({
        email,
        otp: nextDigits.join(""),
        purpose,
      });
      await navigate({
        to: purpose === "FORGOT_PASSWORD" ? "/reset-password" : "/",
        ...(purpose === "FORGOT_PASSWORD" && {
          search: { email, otp: nextDigits.join("") },
        }),
      });
    } catch {
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const resendOtp = () => {
    resendOtpMutation.mutate(
      { email, purpose },
      {
        onSuccess: () => {
          setDigits(Array(OTP_LENGTH).fill(""));
          verifyOtpMutation.reset();
          inputRefs.current[0]?.focus();
        },
      },
    );
  };

  return (
    <div>
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        One last step
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        Verify your email.
      </h1>
      <p className="mt-3 max-w-md leading-6 text-slate-500 dark:text-slate-400">
        Enter the 6-digit code we sent to {email}.
      </p>
      <div className="mt-8 space-y-5">
        <div className="brand-accent-soft flex h-14 w-14 items-center justify-center rounded-2xl">
          <MailCheck className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Verification code
          </p>
          <div className="mt-2 grid grid-cols-6 gap-2 sm:gap-3">
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
                aria-label={`Verification digit ${index + 1}`}
                className="brand-accent-focus h-14 w-full rounded-xl border border-slate-200 bg-slate-50 text-center text-2xl font-bold text-slate-950 outline-none transition dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            ))}
          </div>
        </div>
        {verifyOtpMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            {verifyOtpMutation.error instanceof Error
              ? verifyOtpMutation.error.message
              : "That code could not be verified."}
          </p>
        )}
        {resendOtpMutation.isSuccess && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            A new OTP has been sent.
          </p>
        )}
        {resendOtpMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            {resendOtpMutation.error instanceof Error
              ? resendOtpMutation.error.message
              : "Unable to resend OTP."}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            onClick={resendOtp}
            disabled={resendOtpMutation.isPending}
            className="brand-accent cursor-pointer font-bold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => void submitOtp()}
          disabled={
            verifyOtpMutation.isPending || digits.join("").length !== OTP_LENGTH
          }
          className="brand-primary brand-primary-hover w-full cursor-pointer rounded-xl px-4 py-3.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {verifyOtpMutation.isPending ? "Verifying OTP..." : "Verify OTP"}
        </button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="brand-accent font-bold">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
