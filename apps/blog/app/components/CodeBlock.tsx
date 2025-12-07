"use client";

import { useState, useRef, useCallback, ReactNode } from "react";

interface CodeBlockProps {
  children: ReactNode;
}

// 복사 아이콘 SVG
function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

// 체크 아이콘 SVG
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(async () => {
    if (!preRef.current) return;

    // figure 내부의 pre > code에서 텍스트 추출
    const codeElement = preRef.current.querySelector("pre code");
    if (!codeElement) return;

    // data-line 속성을 가진 span들에서 텍스트 추출 (라인 번호 제외)
    const lines = codeElement.querySelectorAll("[data-line]");
    let text = "";

    if (lines.length > 0) {
      text = Array.from(lines)
        .map((line) => {
          // 라인 내의 실제 코드 텍스트만 추출
          return line.textContent || "";
        })
        .join("\n");
    } else {
      // fallback: 전체 텍스트
      text = codeElement.textContent || "";
    }

    try {
      await navigator.clipboard.writeText(text.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, []);

  return (
    <div className="code-block-wrapper" ref={preRef}>
      {children}
      <button
        className={`code-copy-button ${copied ? "copied" : ""}`}
        onClick={handleCopy}
        aria-label={copied ? "복사됨" : "코드 복사"}
        title={copied ? "복사됨!" : "코드 복사"}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}
