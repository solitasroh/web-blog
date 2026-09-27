/**
 * 환경 기반 초안 표시 여부 결정
 * - Preview/Development: 초안 포스트 표시
 * - Production: 초안 포스트 숨김
 */
export function shouldExposeDrafts(): boolean {
  // Vercel preview 환경
  if (process.env.VERCEL_ENV === "preview") {
    return true;
  }

  // 로컬 개발 환경
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // Production 환경에서는 초안 숨김
  return false;
}

/**
 * 현재 환경이 production인지 확인
 */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production" || 
         (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview");
}
