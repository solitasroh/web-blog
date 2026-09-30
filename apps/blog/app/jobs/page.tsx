export { default } from "./_components/jobs-board";

/*
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  JobBucket,
  JobEntry,
  JobsData,
  JobTrack,
} from "@/lib/jobs";
import styles from "./jobs.module.css";

const BUCKET_ORDER: JobBucket[] = [
  "지원",
  "조건부",
  "보류",
  "통근스킵",
  "기타스킵",
];

const TRACK_ORDER: JobTrack[] = ["windows", "embedded"];

const trackDetails: Record<
  JobTrack,
  { label: string; description: string; accent: string; panel: string }
> = {
  windows: {
    label: "Windows / .NET",
    description: "C# · .NET · WPF · Host · HMI · PC 제어·툴링",
    accent: "bg-indigo-600",
    panel: "border-indigo-200 bg-indigo-50/70",
  },
  embedded: {
    label: "Embedded / MCU / BSP",
    description: "MCU FW · Embedded Linux · BSP · Kernel/Driver · SoC FW",
    accent: "bg-cyan-600",
    panel: "border-cyan-200 bg-cyan-50/70",
  },
};

const bucketStyles: Record<
  JobBucket,
  { chip: string; accent: string; dot: string }
> = {
  지원: {
    chip: "border-emerald-300 bg-emerald-100 text-emerald-900",
    accent: "border-l-emerald-500",
    dot: "bg-emerald-500",
  },
  조건부: {
    chip: "border-amber-300 bg-amber-100 text-amber-900",
    accent: "border-l-amber-500",
    dot: "bg-amber-500",
  },
  보류: {
    chip: "border-slate-300 bg-slate-200 text-slate-800",
    accent: "border-l-slate-400",
    dot: "bg-slate-400",
  },
  통근스킵: {
    chip: "border-blue-300 bg-blue-100 text-blue-950",
    accent: "border-l-blue-500",
    dot: "bg-blue-500",
  },
  기타스킵: {
    chip: "border-rose-300 bg-rose-100 text-rose-900",
    accent: "border-l-rose-400",
    dot: "bg-rose-400",
  },
};

const statusStyles: Record<JobEntry["status"], string> = {
  관심있음: "border-indigo-200 bg-indigo-50 text-indigo-800",
  지원완료: "border-violet-200 bg-violet-50 text-violet-800",
  탈락: "border-rose-200 bg-rose-50 text-rose-800",
  합격: "border-emerald-200 bg-emerald-50 text-emerald-800",
  보류: "border-slate-200 bg-slate-100 text-slate-700",
};

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

export default function JobsPage() {
  const [jobsData, setJobsData] = useState<JobsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/auth");
      if (!response.ok) {
        router.push("/admin/login");
        return false;
      }

      setAuthenticated(true);
      return true;
    } catch {
      router.push("/admin/login");
      return false;
    }
  }, [router]);

  const fetchJobsData = useCallback(async () => {
    try {
      const response = await fetch("/api/jobs");
      if (!response.ok) {
        setLoadError(true);
        return;
      }

      const data = (await response.json()) as JobsData;
      setJobsData(data);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (await checkAuth()) {
        await fetchJobsData();
      }
    };

    void initialize();
  }, [checkAuth, fetchJobsData]);

  if (!authenticated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div
          className="flex items-center gap-3 text-sm font-medium text-slate-600"
          role="status"
        >
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600" />
          회사·포지션 자료를 불러오는 중
        </div>
      </div>
    );
  }

  const companies = jobsData?.companies ?? [];
  const bucketCounts = companies.reduce(
    (counts, job) => {
      counts[job.bucket] += 1;
      return counts;
    },
    Object.fromEntries(BUCKET_ORDER.map((bucket) => [bucket, 0])) as Record<
      JobBucket,
      number
    >
  );
  const trackCounts = companies.reduce(
    (counts, job) => {
      counts[job.track] += 1;
      return counts;
    },
    { windows: 0, embedded: 0 } satisfies Record<JobTrack, number>
  );
  const lastUpdated = companies.reduce(
    (latest, job) => (job.updatedAt > latest ? job.updatedAt : latest),
    ""
  );
  const visibleBuckets = BUCKET_ORDER.filter(
    (bucket) => bucketCounts[bucket] > 0
  );

  return (
    <div
      className={`${styles.board} min-h-screen overflow-x-clip bg-slate-100 text-slate-950`}
    >
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="m-0 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-300">
              Private workspace
            </p>
            <h1 className="m-0 border-0 p-0 text-lg font-bold text-white sm:text-xl">
              관심 회사 조사
            </h1>
          </div>
          <span className="shrink-0 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-300">
            {companies.length}개 공고
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {loadError ? (
          <div
            className="rounded-xl border border-rose-200 bg-white p-6 text-sm font-medium text-rose-800"
            role="alert"
          >
            회사·포지션 자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        ) : (
          <>
            <section
              aria-label="리서치 요약"
              className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid gap-px bg-slate-200 sm:grid-cols-[1.25fr_2fr]">
                <div className="bg-white p-5">
                  <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Last verified
                  </p>
                  <p className="m-0 mt-1 text-left text-xl font-bold text-slate-950">
                    {lastUpdated ? formatDate(lastUpdated) : "—"}
                  </p>
                </div>
                <div className="bg-white p-5">
                  <p className="m-0 mb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Track navigation
                  </p>
                  <nav
                    aria-label="트랙 바로가기"
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    {TRACK_ORDER.map((track) => (
                      <a
                        key={track}
                        href={`#track-${track}`}
                        className={`group rounded-xl border p-3 text-left transition hover:brightness-95 ${trackDetails[track].panel}`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-extrabold text-slate-950">
                            {trackDetails[track].label}
                          </span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                            {trackCounts[track]}개
                          </span>
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-600">
                          {trackDetails[track].description}
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="border-t border-slate-200 bg-white px-5 py-3">
                <p className="m-0 mb-2 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Bucket summary
                </p>
                <div
                  aria-label="버킷 요약"
                  className="flex flex-wrap gap-2"
                >
                  {visibleBuckets.map((bucket) => (
                    <span
                      key={bucket}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${bucketStyles[bucket].chip}`}
                    >
                      {bucket}
                      <span aria-label={`${bucketCounts[bucket]}개`}>
                        {bucketCounts[bucket]}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              {jobsData?.commuteFilter && (
                <details className="group border-t border-slate-200 bg-slate-50">
                  <summary className="cursor-pointer px-5 py-3 text-sm font-semibold text-slate-700 marker:text-slate-400">
                    통근 필터 보기
                  </summary>
                  <p className="m-0 px-5 pb-4 text-left text-sm leading-6 text-slate-600">
                    {jobsData.commuteFilter}
                  </p>
                </details>
              )}
            </section>

            {companies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <p className="m-0 text-center text-sm font-medium text-slate-500">
                  표시할 공고가 없습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {TRACK_ORDER.map((track) => {
                  const trackCompanies = companies.filter(
                    (job) => job.track === track
                  );
                  const trackBuckets = BUCKET_ORDER.filter((bucket) =>
                    trackCompanies.some((job) => job.bucket === bucket)
                  );

                  return (
                    <section
                      id={`track-${track}`}
                      key={track}
                      className="scroll-mt-20"
                      aria-labelledby={`track-heading-${track}`}
                    >
                      <header
                        className={`mb-5 overflow-hidden rounded-2xl border ${trackDetails[track].panel}`}
                      >
                        <div
                          className={`h-1.5 ${trackDetails[track].accent}`}
                        />
                        <div className="p-5 sm:flex sm:items-end sm:justify-between sm:gap-5">
                          <div>
                            <p className="m-0 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                              Primary track
                            </p>
                            <h2
                              id={`track-heading-${track}`}
                              className="m-0 mt-1 border-0 p-0 text-left text-2xl font-black text-slate-950"
                            >
                              {trackDetails[track].label}
                            </h2>
                            <p className="m-0 mt-1 text-left text-sm text-slate-600">
                              {trackDetails[track].description}
                            </p>
                          </div>
                          <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-sm font-extrabold text-slate-700 ring-1 ring-slate-200 sm:mt-0">
                            {trackCompanies.length}개 공고
                          </span>
                        </div>
                        <nav
                          aria-label={`${trackDetails[track].label} 버킷 바로가기`}
                          className="flex flex-wrap gap-2 border-t border-slate-200/80 px-5 py-3"
                        >
                          {trackBuckets.map((bucket) => {
                            const count = trackCompanies.filter(
                              (job) => job.bucket === bucket
                            ).length;
                            return (
                              <a
                                key={bucket}
                                href={`#track-${track}-bucket-${bucket}`}
                                className={`${styles.bucketLink} inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition hover:brightness-95 ${bucketStyles[bucket].chip}`}
                              >
                                {bucket}
                                <span aria-label={`${count}개`}>{count}</span>
                              </a>
                            );
                          })}
                        </nav>
                      </header>

                      <div className="space-y-8">
                        {trackBuckets.map((bucket) => {
                          const jobs = trackCompanies
                            .filter((job) => job.bucket === bucket)
                            .sort(
                              (a, b) =>
                                Number(Boolean(b.priority)) -
                                Number(Boolean(a.priority))
                            );

                          return (
                            <section
                              id={`track-${track}-bucket-${bucket}`}
                              key={bucket}
                              className="scroll-mt-20"
                              aria-labelledby={`track-${track}-heading-${bucket}`}
                            >
                              <div className="sticky top-[61px] z-30 -mx-1 mb-3 flex items-center justify-between border-b border-slate-300 bg-slate-100/95 px-1 py-3 backdrop-blur">
                                <h3
                                  id={`track-${track}-heading-${bucket}`}
                                  className="m-0 flex items-center gap-2 border-0 p-0 text-base font-extrabold text-slate-950"
                                >
                                  <span
                                    className={`h-2.5 w-2.5 rounded-full ${bucketStyles[bucket].dot}`}
                                  />
                                  {bucket}
                                </h3>
                                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                                  {jobs.length}개
                                </span>
                              </div>

                      <div className="space-y-3">
                        {jobs.map((job) => (
                          <article
                            key={job.id}
                            className={`relative overflow-hidden rounded-xl border border-l-4 bg-white shadow-sm ${bucketStyles[bucket].accent} ${
                              job.priority
                                ? "border-emerald-400 ring-2 ring-emerald-200"
                                : "border-slate-200"
                            }`}
                          >
                            {job.priority && (
                              <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold tracking-wide text-emerald-900 sm:px-5">
                                ★ 최우선
                              </div>
                            )}
                            <div className="grid min-w-0 gap-4 p-4 sm:p-5 lg:grid-cols-[1.2fr_0.9fr_1.35fr_auto] lg:items-start">
                              <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <h3 className="m-0 border-0 p-0 text-base font-extrabold text-slate-950">
                                    {job.briefPath ? (
                                      <Link
                                        href={job.briefPath}
                                        className={styles.briefTitleLink}
                                      >
                                        {job.name}
                                      </Link>
                                    ) : (
                                      job.name
                                    )}
                                  </h3>
                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${bucketStyles[job.bucket].chip}`}
                                  >
                                    {job.bucket}
                                  </span>
                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusStyles[job.status]}`}
                                  >
                                    {job.status}
                                  </span>
                                </div>
                                <p className="m-0 break-words text-left text-sm font-semibold leading-5 text-slate-800">
                                  {job.role}
                                </p>
                              </div>

                              <dl className="grid min-w-0 grid-cols-[4rem_1fr] gap-x-2 gap-y-1 text-sm">
                                <dt className="font-semibold text-slate-500">위치</dt>
                                <dd className="m-0 break-words text-slate-800">
                                  {job.location}
                                </dd>
                                <dt className="font-semibold text-slate-500">통근</dt>
                                <dd className="m-0 break-words text-slate-800">
                                  {job.commute}
                                </dd>
                              </dl>

                              <div className="min-w-0 rounded-lg bg-slate-50 p-3">
                                <p className="m-0 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                  판단 근거
                                </p>
                                <p className="m-0 mt-1 break-words text-left text-sm leading-5 text-slate-800">
                                  {job.skipReason ||
                                    job.recommendation ||
                                    job.notes ||
                                    "추가 메모 없음"}
                                </p>
                                {job.recommendation && job.skipReason && (
                                  <p className="m-0 mt-2 break-words text-left text-xs leading-5 text-slate-600">
                                    {job.recommendation}
                                  </p>
                                )}
                                {job.notes &&
                                  job.notes !== job.skipReason &&
                                  job.notes !== job.recommendation && (
                                    <details className="mt-2">
                                      <summary className="cursor-pointer text-xs font-semibold text-slate-600">
                                        상세 메모
                                      </summary>
                                      <p className="m-0 mt-1 break-words text-left text-xs leading-5 text-slate-600">
                                        {job.notes}
                                      </p>
                                    </details>
                                  )}
                              </div>

                              <div className="flex min-w-[7.5rem] flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                                <time
                                  dateTime={job.updatedAt}
                                  className="text-xs font-semibold tabular-nums text-slate-500"
                                >
                                  수정 {formatDate(job.updatedAt)}
                                </time>
                                {job.deadline && (
                                  <span className="text-xs font-semibold tabular-nums text-rose-700">
                                    마감 {formatDate(job.deadline)}
                                  </span>
                                )}
                                {job.briefPath && (
                                  <Link
                                    href={job.briefPath}
                                    className={`${styles.briefLink} inline-flex min-h-9 items-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold transition hover:border-indigo-300 hover:bg-indigo-100`}
                                    aria-label={`${job.name} 리서치 노트 보기`}
                                  >
                                    리서치 노트 →
                                  </Link>
                                )}
                                {job.link && (
                                  <a
                                    href={job.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${styles.externalLink} inline-flex min-h-9 items-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold transition hover:bg-slate-700`}
                                    aria-label={`${job.name} ${job.role} 공고 열기`}
                                  >
                                    공고 열기 ↗
                                  </a>
                                )}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                            </section>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
*/
