import {
  COMPANY_SCALE_ORDER,
  RECOMMENDATION_GRADE_ORDER,
} from "@/lib/job-ranking";
import { getJobsData, sortJobsByScaleAndGrade } from "@/lib/jobs";
import { generateStaticParams } from "@/app/jobs/[id]/page";

describe("jobs research ranking", () => {
  const jobsData = getJobsData();

  it("uses documented company scale and recommendation grade fields", () => {
    expect(jobsData.rankingModel.organization).toContain("회사 규모");
    expect(jobsData.rankingModel.organization).toContain("추천 등급");

    for (const job of jobsData.companies) {
      expect(COMPANY_SCALE_ORDER).toContain(job.companyScale);
      expect(RECOMMENDATION_GRADE_ORDER).toContain(job.recommendationGrade);
      expect(job.scaleBasis).not.toHaveLength(0);
      expect(job.gradeBasis).not.toHaveLength(0);
    }
  });

  it("does not expose the former disposition fields", () => {
    for (const job of jobsData.companies) {
      const fields = job as unknown as Record<string, unknown>;

      expect(fields).not.toHaveProperty("bucket");
      expect(fields).not.toHaveProperty("status");
      expect(fields).not.toHaveProperty("commute");
      expect(fields).not.toHaveProperty("skipReason");
      expect(fields).not.toHaveProperty("priority");
    }
  });

  it("removes Rootech entries", () => {
    expect(
      jobsData.companies.some(
        (job) =>
          job.id.toLowerCase().includes("rootech") || job.name.includes("루텍")
      )
    ).toBe(false);
  });

  it("creates a detail route for every research entry", () => {
    expect(generateStaticParams()).toEqual(
      jobsData.companies.map(({ id }) => ({ id }))
    );
  });

  it("sorts by scale and then higher recommendation grade", () => {
    const sorted = sortJobsByScaleAndGrade(jobsData.companies);

    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];
      const previousScale = COMPANY_SCALE_ORDER.indexOf(previous.companyScale);
      const currentScale = COMPANY_SCALE_ORDER.indexOf(current.companyScale);

      expect(previousScale).toBeLessThanOrEqual(currentScale);
      if (previousScale === currentScale) {
        expect(
          RECOMMENDATION_GRADE_ORDER.indexOf(previous.recommendationGrade)
        ).toBeLessThanOrEqual(
          RECOMMENDATION_GRADE_ORDER.indexOf(current.recommendationGrade)
        );
      }
    }
  });
});
