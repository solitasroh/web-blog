"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          문제가 발생했습니다
        </h1>
        <p className="text-muted mb-6">
          {error.message || "페이지를 불러오는 중 오류가 발생했습니다."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-colors"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
