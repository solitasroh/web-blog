"use client";

import Link from "next/link";

type PostPreviewLinkProps = {
  slug: string;
  draft: boolean;
  variant?: "icon" | "button";
};

function EyeIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

export default function PostPreviewLink({
  slug,
  draft,
  variant = "icon",
}: PostPreviewLinkProps) {
  const previewHref = draft
    ? `/admin/posts/${slug}?preview=1`
    : `/posts/${slug}`;
  const className =
    variant === "icon"
      ? "p-2 rounded-lg text-muted hover:text-foreground hover:bg-accent/10 transition-colors"
      : "px-3 py-2 rounded-lg border border-border text-foreground hover:bg-accent/10 transition-colors text-sm";
  const label = draft ? "관리자 초안 미리보기" : "공개 포스트 미리보기";

  return (
    <Link
      href={previewHref}
      target={draft ? undefined : "_blank"}
      rel={draft ? undefined : "noopener noreferrer"}
      className={className}
      title={label}
      aria-label={variant === "icon" ? label : undefined}
    >
      {variant === "icon" ? <EyeIcon /> : label}
    </Link>
  );
}
