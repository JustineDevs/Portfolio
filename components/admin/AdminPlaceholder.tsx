import { ReactNode } from "react";

export function AdminPlaceholder({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-[#424242]">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#555555]">{description}</p>
      </section>

      {children ? (
        children
      ) : (
        <section className="rounded-2xl border border-dashed border-[#d5d5d5] bg-[#fafafa] p-6 text-sm text-[#666666]">
          CRUD UI lands in a later phase. The auth guard and route scaffold are in place.
        </section>
      )}
    </main>
  );
}
