import fs from "fs";
import path from "path";

export type JobStatus =
  | "관심있음"
  | "지원완료"
  | "탈락"
  | "합격"
  | "보류";

export type JobEntry = {
  id: string;
  name: string;
  status: JobStatus;
  commute: string;
  skipReason?: string;
  recommendation?: string;
  notes?: string;
  updatedAt: string;
};

export type JobsData = {
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
    return data;
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
