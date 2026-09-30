import fs from "fs";
import path from "path";
import { hasJobBrief } from "@/lib/job-briefs";

export type JobStatus =
  | "관심있음"
  | "지원완료"
  | "탈락"
  | "합격"
  | "보류";

export type JobBucket =
  | "지원"
  | "조건부"
  | "보류"
  | "통근스킵"
  | "기타스킵";

export type JobTrack = "windows" | "embedded";

export type JobEntry = {
  id: string;
  name: string;
  role: string;
  location: string;
  status: JobStatus;
  bucket: JobBucket;
  track: JobTrack;
  commute: string;
  skipReason?: string;
  recommendation?: string;
  notes?: string;
  link?: string;
  deadline?: string;
  verifiedAt?: string;
  priority?: boolean;
  briefPath?: string;
  updatedAt: string;
};

export type JobsData = {
  commuteFilter?: string;
  companies: JobEntry[];
};

const jobsDataPath = path.join(process.cwd(), "content", "jobs", "data.json");

export function getJobsData(): JobsData {
  if (!fs.existsSync(jobsDataPath)) {
    return { companies: [] };
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

export function getJobsByStatus(status: JobStatus): JobEntry[] {
  const data = getJobsData();
  return data.companies.filter((job) => job.status === status);
}

export function getJobById(id: string): JobEntry | null {
  const data = getJobsData();
  return data.companies.find((job) => job.id === id) || null;
}
