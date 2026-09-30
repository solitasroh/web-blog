import fs from "fs";
import path from "path";
import {
  compareCompanyRanking,
  type CompanyScale,
  type JobTrack,
  type RecommendationGrade,
} from "@/lib/job-ranking";

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
  updatedAt: string;
};

export type JobsData = {
  rankingModel: RankingModel;
  companies: JobEntry[];
};

const jobsDataPath = path.join(process.cwd(), "content", "jobs", "data.json");

function emptyJobsData(): JobsData {
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

export function getJobsData(): JobsData {
  if (!fs.existsSync(jobsDataPath)) {
    return emptyJobsData();
  }

  try {
    const fileContents = fs.readFileSync(jobsDataPath, "utf8");
    return JSON.parse(fileContents) as JobsData;
  } catch (error) {
    console.error("Error reading jobs data:", error);
    return emptyJobsData();
  }
}

export function getJobById(id: string): JobEntry | null {
  const data = getJobsData();
  return data.companies.find((job) => job.id === id) || null;
}

export function sortJobsByScaleAndGrade(jobs: JobEntry[]): JobEntry[] {
  return jobs.toSorted(compareCompanyRanking);
}

export type {
  CompanyScale,
  JobTrack,
  RecommendationGrade,
} from "@/lib/job-ranking";
