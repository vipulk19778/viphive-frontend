"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from "../schemas/auth.schema";

import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/services/api/auth.api";

import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth.slice";

interface VerifyOtpFormProps {
  email: string;
}

export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  const onSubmit = async (values: VerifyOtpFormValues) => {
    try {
      const response = await verifyOtp(values).unwrap();

      if (response.user) {
        dispatch(setCredentials(response.user));
      }

      router.push("/");
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp({ email }).unwrap();
    } catch (error) {
      console.error("OTP resend failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("email")} />

        <div>
          <label htmlFor="otp" className="block text-sm font-medium">
            OTP
          </label>

          <input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            {...register("otp")}
            className="mt-1 w-full rounded-md border px-3 py-2 tracking-[0.4em]"
          />

          {errors.otp && (
            <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={isSending}
        className="w-full text-sm underline disabled:opacity-50"
      >
        {isSending ? "Sending..." : "Resend OTP"}
      </button>
    </div>
  );
}
