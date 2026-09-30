import type { Metadata } from "next";
import JobsBoard from "../_components/ranked-jobs-board";

export const metadata: Metadata = {
  title: "Embedded / MCU / BSP 회사·포지션 리서치",
};

export default function EmbeddedJobsPage() {
  return <JobsBoard track="embedded" />;
}
