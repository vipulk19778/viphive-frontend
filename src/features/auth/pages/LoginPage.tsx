import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { PasswordInput } from "@/components/ui/PasswordInput";
import { useLogin } from "../hooks/useAuth";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";

export function LoginPage() {
  const navigate = useNavigate();
  const { redirectTo } = useSearch({ from: "/_auth/login" });
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
      await navigate({ to: redirectTo ?? "/" });
    } catch {
      /* mutation state renders the error */
    }
  };

  return (
    <div>
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        Welcome back
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        Welcome back to VIPHive.
      </h1>
      <p className="mt-3 max-w-md leading-6 text-slate-500 dark:text-slate-400">
        Your saved pieces, order updates, and next great find are waiting.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="brand-accent-focus mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
            autoComplete="current-password"
            {...register("password")}
            className="brand-accent-focus w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          {errors.password && (
            <span className="mt-1 block text-xs font-medium text-rose-500">
              {errors.password.message}
            </span>
          )}
        </label>
        <p className="text-right text-sm text-slate-500 dark:text-slate-400">
          <Link to="/forgot-password" className="brand-accent font-bold">
            Forgot password?
          </Link>
        </p>
        {loginMutation.isError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : "Unable to sign in."}
          </p>
        )}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="brand-primary brand-primary-hover w-full cursor-pointer rounded-xl px-4 py-3.5 font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          New to VIPHive?{" "}
          <Link
            to="/register"
            className="brand-accent font-bold hover:opacity-80"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
