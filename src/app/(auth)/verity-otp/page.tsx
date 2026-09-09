import { redirect } from "next/navigation";

import { VerifyOtpForm } from "@/features/auth/components/verify-otp-form";

interface VerifyOtpPageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function VerifyOtpPage({
  searchParams,
}: VerifyOtpPageProps) {
  const params = await searchParams;

  if (!params.email) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Verify your email</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter the OTP sent to {params.email}.
          </p>
        </div>

        <VerifyOtpForm email={params.email} />
      </section>
    </main>
  );
}
