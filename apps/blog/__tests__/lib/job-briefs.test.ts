import {
  getJobBriefIds,
  getJobBriefSource,
  hasJobBrief,
} from "@/lib/job-briefs";
import { getJobsData } from "@/lib/jobs";
import { generateStaticParams } from "@/app/jobs/[id]/page";

const EXPECTED_BRIEF_IDS = [
  "apsystem",
  "asml-cymer-sqa",
  "cognex-korea",
  "deepx",
  "dentium",
  "etas-korea",
  "fadu",
  "furiosa-ai",
  "hyundai-autoever",
  "mobilint",
  "nextin",
  "ourien-medical-imaging-wpf",
  "rebellions",
  "semifive",
  "suprema",
  "telechips",
  "vieworks",
  "wonik-ips",
  "zaram-tech",
];

describe("job briefs", () => {
  it("loads the company research brief ids", () => {
    expect(getJobBriefIds()).toEqual(EXPECTED_BRIEF_IDS);
  });

  it("loads Korean markdown for a known company", () => {
    const source = getJobBriefSource("nextin");

    expect(source).toContain("# 넥스틴 — 회사·포지션 리서치");
    expect(source).toContain("## 회사 개요");
    expect(hasJobBrief("nextin")).toBe(true);
  });

  it("rejects unknown and unsafe ids", () => {
    expect(getJobBriefSource("unknown-company")).toBeNull();
    expect(getJobBriefSource("../data")).toBeNull();
    expect(hasJobBrief("../data")).toBe(false);
  });

  it("adds detail links only to jobs with briefs", () => {
    const jobs = getJobsData().companies;

    expect(jobs.find((job) => job.id === "nextin")?.briefPath).toBe(
      "/jobs/nextin"
    );
    expect(jobs.find((job) => job.id === "seoul-robotics")?.briefPath).toBe(
      undefined
    );
  });

  it("generates a detail route for every known brief", () => {
    expect(generateStaticParams()).toEqual(
      EXPECTED_BRIEF_IDS.map((id) => ({ id }))
    );
  });
});
