import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  COMPANY_SCALE_LABELS,
  RECOMMENDATION_GRADE_LABELS,
} from "@/lib/job-ranking";
import { getJobById, getJobsData } from "@/lib/jobs";

const AUTH_COOKIE_NAME = "admin_session";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return getJobsData().companies.map(({ id }) => ({ id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);

  return {
    title: job ? `${job.name} 회사 리서치` : "회사 리서치",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CompanyResearchPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const job = getJobById(id);

  if (job == null) {
    notFound();
  }

  const cookieStore = await cookies();
  if (!cookieStore.get(AUTH_COOKIE_NAME)?.value) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-800 bg-slate-950 text-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="m-0 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-300">
              Private workspace
            </p>
            <p className="m-0 text-left text-base font-bold text-white">
              {job.name} 회사 리서치
            </p>
          </div>
          <Link
            href={`/jobs/${job.track}`}
            className="shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white no-underline transition hover:border-slate-500 hover:bg-slate-800 hover:text-white hover:no-underline"
          >
            ← {job.track === "windows" ? "Windows / .NET" : "Embedded / MCU / BSP"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-8">
            <p className="m-0 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Company research
            </p>
            <h1 className="m-0 mt-2 border-0 p-0 text-3xl font-black text-slate-950">
              {job.name}
            </h1>
            <p className="m-0 mt-2 text-left text-base font-semibold text-slate-700">
              {job.role}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-bold text-violet-900">
                {COMPANY_SCALE_LABELS[job.companyScale]}
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-900">
                {RECOMMENDATION_GRADE_LABELS[job.recommendationGrade]}
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-slate-200 md:grid-cols-2">
            <section className="bg-white p-5 sm:p-8" aria-labelledby="scale">
              <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Company scale
              </p>
              <h2
                id="scale"
                className="m-0 mt-1 border-0 p-0 text-xl font-black text-slate-950"
              >
                {COMPANY_SCALE_LABELS[job.companyScale]}
              </h2>
              <p className="m-0 mt-3 text-left text-sm leading-6 text-slate-700">
                {job.scaleBasis}
              </p>
            </section>

            <section
              className="bg-white p-5 sm:p-8"
              aria-labelledby="recommendation"
            >
              <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Recommendation grade
              </p>
              <h2
                id="recommendation"
                className="m-0 mt-1 border-0 p-0 text-xl font-black text-slate-950"
              >
                {RECOMMENDATION_GRADE_LABELS[job.recommendationGrade]}
              </h2>
              <p className="m-0 mt-3 text-left text-sm leading-6 text-slate-700">
                {job.gradeBasis}
              </p>
            </section>
          </div>

          <div className="grid gap-6 border-t border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 sm:p-8">
            <section aria-labelledby="research-target">
              <h2
                id="research-target"
                className="m-0 border-0 p-0 text-sm font-extrabold text-slate-950"
              >
                조사 대상
              </h2>
              <dl className="mt-3 grid grid-cols-[4rem_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="font-semibold text-slate-500">직무</dt>
                <dd className="m-0 text-slate-800">{job.role}</dd>
                <dt className="font-semibold text-slate-500">위치</dt>
                <dd className="m-0 text-slate-800">{job.location}</dd>
                <dt className="font-semibold text-slate-500">트랙</dt>
                <dd className="m-0 text-slate-800">
                  {job.track === "windows"
                    ? "Windows / .NET"
                    : "Embedded / MCU / BSP"}
                </dd>
              </dl>
            </section>

            <section aria-labelledby="research-record">
              <h2
                id="research-record"
                className="m-0 border-0 p-0 text-sm font-extrabold text-slate-950"
              >
                조사 기록
              </h2>
              <dl className="mt-3 grid grid-cols-[4rem_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="font-semibold text-slate-500">검증일</dt>
                <dd className="m-0 text-slate-800">
                  {job.verifiedAt ?? "미확인"}
                </dd>
                <dt className="font-semibold text-slate-500">수정일</dt>
                <dd className="m-0 text-slate-800">{job.updatedAt}</dd>
              </dl>
              {job.link && (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white no-underline transition hover:bg-slate-700 hover:text-white hover:no-underline"
                >
                  원문 자료 열기 ↗
                </a>
              )}
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
