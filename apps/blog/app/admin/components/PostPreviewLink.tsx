"use client";

import Link from "next/link";
import { useState } from "react";

type PostPreviewLinkProps = {
  slug: string;
  draft: boolean;
  draftsExposed: boolean;
  previewBaseUrl: string | null;
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
  draftsExposed,
  previewBaseUrl,
  variant = "icon",
}: PostPreviewLinkProps) {
  const [showGuidance, setShowGuidance] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewPath = `/posts/${slug}`;
  const canPreviewHere = !draft || draftsExposed;
  const previewHref = canPreviewHere
    ? previewPath
    : previewBaseUrl
      ? `${previewBaseUrl}${previewPath}`
      : null;
  const className =
    variant === "icon"
      ? "p-2 rounded-lg text-muted hover:text-foreground hover:bg-accent/10 transition-colors"
      : "px-3 py-2 rounded-lg border border-border text-foreground hover:bg-accent/10 transition-colors text-sm";
  const label = draft ? "초안 미리보기" : "미리보기";

  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(previewPath);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {previewHref ? (
        <Link
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          title={label}
          aria-label={variant === "icon" ? label : undefined}
        >
          {variant === "icon" ? <EyeIcon /> : label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setShowGuidance(true)}
          className={className}
          title="초안 미리보기 안내"
          aria-label={variant === "icon" ? "초안 미리보기 안내" : undefined}
        >
          {variant === "icon" ? <EyeIcon /> : "초안 미리보기 안내"}
        </button>
      )}

      {showGuidance && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="draft-preview-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2
              id="draft-preview-title"
              className="text-xl font-bold text-foreground"
            >
              Production에서는 초안을 표시하지 않습니다
            </h2>
            <p className="mt-3 text-sm text-muted">
              Preview 배포 또는 로컬 개발 서버에서 아래 경로를 열면 렌더링된
              포스트와 Draft 배지를 확인할 수 있습니다. 초안 목록은{" "}
              <code>/drafts</code>에서 볼 수 있습니다.
            </p>

            <div className="mt-5 flex gap-2">
              <input
                value={previewPath}
                readOnly
                aria-label="초안 미리보기 경로"
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
              />
              <button
                type="button"
                onClick={copyPath}
                className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent-light"
              >
                {copied ? "복사됨" : "경로 복사"}
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuidance(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-accent/10"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
