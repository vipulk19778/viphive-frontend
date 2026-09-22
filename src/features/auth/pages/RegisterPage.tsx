import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { PasswordInput } from "@/components/ui/PasswordInput";
import { useRegister } from "../hooks/useAuth";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { useAuthStore } from "@/stores/auth.store";

export function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const setOtpContext = useAuthStore((state) => state.setOtpContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      setOtpContext(data.email, "REGISTER");
      await navigate({
        to: "/verify-otp",
      });
    } catch {
      /* mutation state renders the error */
    }
  };
  return (
    <div>
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        Join the hive
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        Make room for better finds.
      </h1>
      <p className="mt-3 max-w-md leading-6 text-slate-500 dark:text-slate-400">
        Create your account to keep your collection, checkout, and orders
        beautifully organized.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Name
          <input
            autoComplete="name"
            {...register("name")}
            className="brand-accent-focus mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.name && (
            <span className="mt-1 block text-xs font-medium text-rose-500">
              {errors.name.message}
            </span>
          )}
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="brand-accent-focus mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.email && (
            <span className="mt-1 block text-xs font-medium text-rose-500">
              {errors.email.message}
            </span>
          )}
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Password
          <PasswordInput
            autoComplete="new-password"
            {...register("password")}
            className="brand-accent-focus w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.password && (
            <span className="mt-1 block text-xs font-medium text-rose-500">
              {errors.password.message}
            </span>
          )}
        </label>
        {registerMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            {registerMutation.error instanceof Error
              ? registerMutation.error.message
              : "Unable to create your account. Please try again."}
          </p>
        )}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="brand-primary brand-primary-hover w-full cursor-pointer rounded-xl px-4 py-3.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {registerMutation.isPending
            ? "Creating account..."
            : "Create account"}
        </button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="brand-accent font-bold">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
