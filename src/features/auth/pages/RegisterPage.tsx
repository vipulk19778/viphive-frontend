import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { useRegister } from "../hooks/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);

      await navigate({
        to: "/verify-otp",
        search: {
          email: data.email,
          purpose: "REGISTER",
        },
      });
    } catch {
      // Error is available through registerMutation.error.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Create your account
          </h1>

          <p className="mt-1 text-sm text-gray-500">Join VIPHive today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name")}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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
              autoComplete="new-password"
              {...register("password")}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {registerMutation.isError && (
            <p className="text-sm text-red-600">
              Unable to create your account. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-md bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
