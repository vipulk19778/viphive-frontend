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
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Account verification
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Verify your email
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Enter the 6-digit code sent to {params.email} to finish creating
            your account.
          </p>
        </div>

        <VerifyOtpForm email={params.email} />
      </section>
    </main>
  );
}
