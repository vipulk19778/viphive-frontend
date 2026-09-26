import {
  createContext,
  useContext,
  useEffect,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) throw new Error("Dialog components must be used inside Dialog");
  return context;
}

type DialogProps = DialogContextValue & { children: ReactNode };

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

type DialogContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function DialogContent({
  className = "",
  children,
  ...props
}: DialogContentProps) {
  const { open, onOpenChange } = useDialog();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[10px]"
        onMouseDown={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900",
          className,
        )}
        onMouseDown={(event) => event.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

export function DialogTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-bold text-slate-950 dark:text-white",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400",
        className,
      )}
      {...props}
    />
  );
}

export function DialogClose({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = useDialog();
  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
}
