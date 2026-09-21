import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import {
  verifyOtpSchema,
  type VerifyOtpFormData,
} from "../schemas/auth.schema";
import { useVerifyOtp } from "../hooks/useAuth";

export function VerifyOtpPage() {
  const navigate = useNavigate();

  const { email, purpose } = useSearch({
    from: "/verify-otp",
  });

  const verifyOtpMutation = useVerifyOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email,
      otp: "",
      purpose,
    },
  });

  const onSubmit = async (data: VerifyOtpFormData) => {
    try {
      await verifyOtpMutation.mutateAsync(data);

      await navigate({
        to: "/",
      });
    } catch {
      // Error is available through verifyOtpMutation.error.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Verify your email
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter the OTP sent to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              {...register("otp")}
              className="w-full rounded-md border px-3 py-2 text-center text-lg tracking-[0.4em] outline-none focus:ring-2 focus:ring-black"
            />

            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          {verifyOtpMutation.isError && (
            <p className="text-sm text-red-600">
              Unable to verify the OTP. Please check the OTP and try again.
            </p>
          )}

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="w-full rounded-md bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </main>
  );
}
