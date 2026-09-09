import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  label?: string;
  className?: string;
  inverse?: boolean;
};

export function Logo({
  href = "/",
  label = "VIPHive",
  className,
  inverse = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", className)}
      aria-label={label}
    >
      <span
        className={cn(
          "relative block h-10 w-30 shrink-0 overflow-hidden rounded-md bg-black shadow-sm",
          inverse && "ring-1 ring-primary-foreground/30",
        )}
      >
        <Image
          src="/VIPHive_logo.png"
          alt=""
          fill
          sizes="160px"
          className="object-contain"
          priority
        />
      </span>
    </Link>
  );
}
