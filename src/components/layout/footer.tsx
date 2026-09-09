import { Logo } from "@/components/common/logo";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="flex flex-col items-center gap-3 px-6 py-6 text-center text-sm text-muted-foreground">
        <Logo className="text-base text-foreground" />
        <span>© {new Date().getFullYear()} VIPHive. All rights reserved.</span>
      </div>
    </footer>
  );
}
