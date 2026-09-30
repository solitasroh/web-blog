import fs from "fs";
import path from "path";
import { hasJobBrief } from "@/lib/job-briefs";

export type JobTrack = "windows" | "embedded";
export type CompanyScale = "large" | "medium" | "small" | "unknown";
export type RecommendationGrade = "A" | "B" | "C" | "unknown";

export const COMPANY_SCALE_ORDER: CompanyScale[] = [
  "large",
  "medium",
  "small",
  "unknown",
];
export const RECOMMENDATION_GRADE_ORDER: RecommendationGrade[] = [
  "A",
  "B",
  "C",
  "unknown",
];

export type RankingModel = {
  organization: string;
  companyScale: Record<CompanyScale, string>;
  recommendationGrade: Record<RecommendationGrade, string>;
};

export type JobEntry = {
  id: string;
  name: string;
  role: string;
  location: string;
  companyScale: CompanyScale;
  scaleBasis: string;
  recommendationGrade: RecommendationGrade;
  gradeBasis: string;
  track: JobTrack;
  link?: string;
  deadline?: string;
  verifiedAt?: string;
  briefPath?: string;
  updatedAt: string;
};

export type JobsData = {
  rankingModel: RankingModel;
  companies: JobEntry[];
};

const jobsDataPath = path.join(process.cwd(), "content", "jobs", "data.json");

export function getJobsData(): JobsData {
  if (!fs.existsSync(jobsDataPath)) {
    return {
      rankingModel: {
        organization: "",
        companyScale: {
          large: "",
          medium: "",
          small: "",
          unknown: "",
        },
        recommendationGrade: {
          A: "",
          B: "",
          C: "",
          unknown: "",
        },
      },
      companies: [],
    };
  }

  try {
    const fileContents = fs.readFileSync(jobsDataPath, "utf8");
    const data = JSON.parse(fileContents) as JobsData;
    return {
      ...data,
      companies: data.companies.map((job) =>
        hasJobBrief(job.id)
          ? { ...job, briefPath: `/jobs/${job.id}` }
          : job
      ),
    };
  } catch (error) {
    console.error("Error reading jobs data:", error);
    return { companies: [] };
  }
}

export function getJobById(id: string): JobEntry | null {
  const data = getJobsData();
  return data.companies.find((job) => job.id === id) || null;
}

export function sortJobsByScaleAndGrade(jobs: JobEntry[]): JobEntry[] {
  return jobs.toSorted((a, b) => {
    const scaleDifference =
      COMPANY_SCALE_ORDER.indexOf(a.companyScale) -
      COMPANY_SCALE_ORDER.indexOf(b.companyScale);
    const gradeDifference =
      RECOMMENDATION_GRADE_ORDER.indexOf(a.recommendationGrade) -
      RECOMMENDATION_GRADE_ORDER.indexOf(b.recommendationGrade);

    return (
      scaleDifference ||
      gradeDifference ||
      a.name.localeCompare(b.name, "ko")
    );
  });
}
