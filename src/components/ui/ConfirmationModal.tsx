import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Button } from "./button";

type ConfirmationModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  isPending = false,
  onOpenChange,
  onConfirm,
}: ConfirmationModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-bold text-slate-950 dark:text-white">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close confirmation"
                className="cursor-pointer rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="secondary" disabled={isPending}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button variant="danger" onClick={onConfirm} disabled={isPending}>
              {isPending ? "Deleting..." : confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
