import type { Metadata } from "next";
import JobsBoard from "../_components/ranked-jobs-board";

export const metadata: Metadata = {
  title: "Windows / .NET 회사·포지션 리서치",
};

export default function WindowsJobsPage() {
  return <JobsBoard track="windows" />;
}
