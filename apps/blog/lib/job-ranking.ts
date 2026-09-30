export type JobTrack = "windows" | "embedded";
export type CompanyScale = "large" | "medium" | "small" | "unknown";
export type RecommendationGrade = "A" | "B" | "C" | "unknown";

export const COMPANY_SCALE_ORDER = [
  "large",
  "medium",
  "small",
  "unknown",
] as const satisfies readonly CompanyScale[];

export const RECOMMENDATION_GRADE_ORDER = [
  "A",
  "B",
  "C",
  "unknown",
] as const satisfies readonly RecommendationGrade[];

export const COMPANY_SCALE_LABELS: Record<CompanyScale, string> = {
  large: "대규모",
  medium: "중견 규모",
  small: "중소 규모",
  unknown: "규모 미확인",
};

export const RECOMMENDATION_GRADE_LABELS: Record<
  RecommendationGrade,
  string
> = {
  A: "추천 A",
  B: "추천 B",
  C: "추천 C",
  unknown: "추천도 미확인",
};

type RankedCompany = {
  companyScale: CompanyScale;
  recommendationGrade: RecommendationGrade;
};

export function compareCompanyRanking(
  a: RankedCompany,
  b: RankedCompany
): number {
  const scaleDifference =
    COMPANY_SCALE_ORDER.indexOf(a.companyScale) -
    COMPANY_SCALE_ORDER.indexOf(b.companyScale);
  const gradeDifference =
    RECOMMENDATION_GRADE_ORDER.indexOf(a.recommendationGrade) -
    RECOMMENDATION_GRADE_ORDER.indexOf(b.recommendationGrade);

  return scaleDifference || gradeDifference;
}
