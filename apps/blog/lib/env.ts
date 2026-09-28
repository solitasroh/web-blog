/**
 * 환경 기반 초안 표시 여부 결정
 * - Preview/Development: 초안 포스트 표시
 * - Production: 초안 포스트 숨김
 * 
 * Vercel 환경 변수:
 * - VERCEL_ENV: "production", "preview", or "development"
 * - NEXT_PUBLIC_VERCEL_ENV: 클라이언트에서도 사용 가능한 버전
 */
export function shouldExposeDrafts(): boolean {
  // Vercel preview 환경 (우선순위 높음)
  const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (vercelEnv === "preview" || vercelEnv === "development") {
    return true;
  }

  // 로컬 개발 환경
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // Production 환경에서는 초안 숨김
  return false;
}

export type DraftPreviewConfig = {
  draftsExposed: boolean;
  previewBaseUrl: string | null;
};

/**
 * 관리자 CMS에서 사용할 초안 미리보기 설정
 * - Preview/Development에서는 현재 배포의 상대 경로를 사용
 * - Production에서는 DRAFT_PREVIEW_URL이 설정된 경우에만 해당 배포로 연결
 */
export function getDraftPreviewConfig(): DraftPreviewConfig {
  const configuredUrl = process.env.DRAFT_PREVIEW_URL?.trim();
  let previewBaseUrl: string | null = null;

  if (configuredUrl) {
    try {
      const url = new URL(configuredUrl);
      if (url.protocol === "https:" || url.protocol === "http:") {
        previewBaseUrl = url.toString().replace(/\/$/, "");
      }
    } catch {
      // 잘못된 URL은 링크로 노출하지 않고 안내 UI를 사용한다.
    }
  }

  return {
    draftsExposed: shouldExposeDrafts(),
    previewBaseUrl,
  };
}

/**
 * 현재 환경이 production인지 확인
 */
export function isProduction(): boolean {
  const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;
  return vercelEnv === "production" || 
         (process.env.NODE_ENV === "production" && vercelEnv !== "preview" && vercelEnv !== "development");
}
