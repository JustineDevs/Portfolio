"use client";

import { useFormStatus } from "react-dom";

import { adminButtonPrimaryClass } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
};

export function AdminFormSubmitButton({ children, pendingLabel = "Saving…", className }: Props) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={cn(adminButtonPrimaryClass, className)}>
      {pending ? pendingLabel : children}
    </button>
  );
}
