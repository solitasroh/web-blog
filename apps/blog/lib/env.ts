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

/**
 * 현재 환경이 production인지 확인
 */
export function isProduction(): boolean {
  const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;
  return vercelEnv === "production" || 
         (process.env.NODE_ENV === "production" && vercelEnv !== "preview" && vercelEnv !== "development");
}
