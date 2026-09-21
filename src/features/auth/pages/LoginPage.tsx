import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      await navigate({ to: "/" });
    } catch {
      // Error is already available through loginMutation.error.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>

          <p className="mt-1 text-sm text-gray-500">
            Sign in to your VIPHive account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {loginMutation.isError && (
            <p className="text-sm text-red-600">
              Unable to sign in. Please check your credentials and try again.
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-md bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
