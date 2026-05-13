import { ReactNode } from "react";

import { adminInputControlClass } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

export { adminButtonPrimaryClass, adminInputControlClass, adminLinkOutlineClass } from "@/components/admin/admin-styles";

export function AdminErrorBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p
      className="mt-3 rounded-lg border border-[#f3c2c2] bg-[#fff2f2] px-3 py-2 text-sm text-[#9f2d2d]"
      role="alert"
    >
      {message}
    </p>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  required = false,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium text-[#424242]">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={adminInputControlClass}
      />
    </label>
  );
}

export function TextareaField({
  label,
  name,
  defaultValue,
  rows,
  required = false,
  className = "",
  textareaClassName = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows: number;
  required?: boolean;
  className?: string;
  textareaClassName?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium text-[#424242]">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
        className={cn(adminInputControlClass, "min-h-[6rem] resize-y font-sans", textareaClassName)}
      />
    </label>
  );
}

export type SelectOption = { value: string; label: string };

function normalizeSelectOptions(options: (string | SelectOption)[]): SelectOption[] {
  return options.map((opt) =>
    typeof opt === "string"
      ? { value: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, " ") }
      : opt,
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  className,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: (string | SelectOption)[];
  className?: string;
}) {
  const normalized = normalizeSelectOptions(options);

  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium text-[#424242]">{label}</span>
      <select name={name} defaultValue={defaultValue} className={cn(adminInputControlClass, "cursor-pointer")}>
        {normalized.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked = false,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#d5d5d5] bg-white px-4 py-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#424242]/20 has-[:focus-visible]:ring-offset-2">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 shrink-0 rounded border-[#d5d5d5] text-[#424242] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#424242]/30 focus-visible:ring-offset-2"
      />
      <span className="font-medium text-[#424242]">{label}</span>
    </label>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-[#424242]">{title}</h2>
      {description ? <p className="mt-2 text-sm text-[#666666]">{description}</p> : null}
      {children}
    </div>
  );
}
