"use client";

import type { MouseEvent } from "react";

import {
  deleteCertificateAction,
  deleteHighlightAction,
  deletePageSectionAction,
  deletePostAction,
  deleteProjectAction,
} from "@/app/admin/actions";

type Props = {
  type: "project" | "post" | "certificate" | "highlight" | "about";
  id: number;
  label?: string;
  inline?: boolean;
};

export function AdminDeleteButton({ type, id, label = "Delete", inline = false }: Props) {
  const action = {
    project: deleteProjectAction,
    post: deletePostAction,
    certificate: deleteCertificateAction,
    highlight: deleteHighlightAction,
    about: deletePageSectionAction,
  }[type];
  const itemLabel = {
    project: "project",
    post: "post",
    certificate: "certificate",
    highlight: "highlight",
    about: "About section",
  }[type];

  const confirmDelete = (event: MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(`Delete this ${itemLabel}? This cannot be undone.`)) {
      event.preventDefault();
    }
  };

  const button = (
    <button
      type="submit"
      {...(inline ? { formAction: action } : {})}
      onClick={inline ? confirmDelete : undefined}
      className="min-h-11 cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-[#b42318] transition-[background-color,transform] duration-150 hover:bg-[#fff1f0] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b42318]/30 focus-visible:ring-offset-2"
    >
      {label}
    </button>
  );

  if (inline) {
    return <><input type="hidden" name="id" value={id} />{button}</>;
  }

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete this ${itemLabel}? This cannot be undone.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      {button}
    </form>
  );
}
