import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { useRef, useState } from "react";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { useVerifyOtp } from "../hooks/useAuth";

const OTP_LENGTH = 6;

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const { email, purpose } = useSearch({ from: "/verify-otp" });
  const verifyOtpMutation = useVerifyOtp();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const submitOtp = async (nextDigits: string[]) => {
    const otp = nextDigits.join("");
    if (otp.length !== OTP_LENGTH || verifyOtpMutation.isPending) return;

    try {
      await verifyOtpMutation.mutateAsync({ email, otp, purpose });
      await navigate({ to: "/" });
    } catch {
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const updateDigit = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = nextValue;
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
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
    setDigits(nextDigits);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    if (pasted.length === OTP_LENGTH) void submitOtp(nextDigits);
  };

  return (
    <AuthLayout
      eyebrow="One last step"
      title="Verify your email."
      description={`Enter the 6-digit code we sent to ${email}.`}
    >
      <div className="space-y-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400">
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
                className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 text-center text-2xl font-bold text-slate-950 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            ))}
          </div>
        </div>
        {verifyOtpMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            That code could not be verified. Please try again.
          </p>
        )}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="font-bold text-amber-600">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
