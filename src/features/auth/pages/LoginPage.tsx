import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { useLogin } from "../hooks/useAuth";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      await navigate({ to: "/" });
    } catch {
      /* mutation state renders the error */
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your world."
      description="Your saved pieces, order updates, and next great find are waiting."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.email && (
            <span className="mt-1 block text-xs font-medium text-rose-500">
              {errors.email.message}
            </span>
          )}
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Password
          <input
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.password && (
            <span className="mt-1 block text-xs font-medium text-rose-500">
              {errors.password.message}
            </span>
          )}
        </label>
        {loginMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            Unable to sign in. Check your credentials and try again.
          </p>
        )}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-xl bg-slate-950 px-4 py-3.5 font-bold text-white transition hover:bg-amber-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-400 dark:text-slate-950"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          New to VIPHive?{" "}
          <Link
            to="/register"
            className="font-bold text-amber-600 hover:text-amber-500"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
