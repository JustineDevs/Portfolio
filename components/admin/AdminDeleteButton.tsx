"use client";

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
};

export function AdminDeleteButton({ type, id, label = "Delete" }: Props) {
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

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete this ${itemLabel}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-md px-2 py-1.5 text-sm font-medium text-[#b42318] transition-colors hover:bg-[#fff1f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b42318]/30 focus-visible:ring-offset-2"
      >
        {label}
      </button>
    </form>
  );
}
