"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type {
  JobBucket,
  JobEntry,
  JobsData,
  JobTrack,
} from "@/lib/jobs";
import styles from "../jobs.module.css";

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
  {
    label: string;
    description: string;
    accent: string;
    panel: string;
    href: string;
  }
> = {
  windows: {
    label: "Windows / .NET",
    description: "C# · .NET · WPF · Host · HMI · PC 제어·툴링",
    accent: "bg-indigo-600",
    panel: "border-indigo-200 bg-indigo-50/70",
    href: "/jobs/windows",
  },
  embedded: {
    label: "Embedded / MCU / BSP",
    description: "MCU FW · Embedded Linux · BSP · Kernel/Driver · SoC FW",
    accent: "bg-cyan-600",
    panel: "border-cyan-200 bg-cyan-50/70",
    href: "/jobs/embedded",
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

const bucketLabels: Record<JobBucket, string> = {
  지원: "관심",
  조건부: "조건부",
  보류: "참고",
  통근스킵: "통근 제외",
  기타스킵: "검토 제외",
};

const bucketSlugs: Record<JobBucket, string> = {
  지원: "interest",
  조건부: "conditional",
  보류: "reference",
  통근스킵: "commute-excluded",
  기타스킵: "excluded",
};

const statusLabels: Record<JobEntry["status"], string> = {
  관심있음: "조사 중",
  지원완료: "후속 확인",
  탈락: "검토 종료",
  합격: "긍정 평가",
  보류: "관찰",
};

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

function LoadingState() {
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

function TrackNavigation({ activeTrack }: { activeTrack?: JobTrack }) {
  return (
    <nav
      aria-label="관심 회사 조사 페이지"
      className="flex flex-wrap gap-2 border-t border-slate-800 px-4 py-2 sm:px-6"
    >
      <Link
        href="/jobs"
        aria-current={activeTrack == null ? "page" : undefined}
        className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
          activeTrack == null
            ? "bg-white text-slate-950"
            : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        조사 홈
      </Link>
      {TRACK_ORDER.map((track) => (
        <Link
          key={track}
          href={trackDetails[track].href}
          aria-current={activeTrack === track ? "page" : undefined}
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
            activeTrack === track
              ? "bg-white text-slate-950"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          {trackDetails[track].label}
        </Link>
      ))}
    </nav>
  );
}

function JobCard({ job }: { job: JobEntry }) {
  return (
    <article
      className={`relative overflow-hidden rounded-xl border border-l-4 bg-white shadow-sm ${
        bucketStyles[job.bucket].accent
      } ${
        job.priority
          ? "border-emerald-400 ring-2 ring-emerald-200"
          : "border-slate-200"
      }`}
    >
      {job.priority && (
        <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold tracking-wide text-emerald-900 sm:px-5">
          ★ 주요 조사 대상
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
              {bucketLabels[job.bucket]}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusStyles[job.status]}`}
            >
              {statusLabels[job.status]}
            </span>
          </div>
          <p className="m-0 break-words text-left text-sm font-semibold leading-5 text-slate-800">
            {job.role}
          </p>
        </div>

        <dl className="grid min-w-0 grid-cols-[4rem_1fr] gap-x-2 gap-y-1 text-sm">
          <dt className="font-semibold text-slate-500">위치</dt>
          <dd className="m-0 break-words text-slate-800">{job.location}</dd>
          <dt className="font-semibold text-slate-500">통근</dt>
          <dd className="m-0 break-words text-slate-800">{job.commute}</dd>
        </dl>

        <div className="min-w-0 rounded-lg bg-slate-50 p-3">
          <p className="m-0 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
            조사 메모
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
              aria-label={`${job.name} ${job.role} JD 원문 열기`}
            >
              JD 원문 ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function JobsHub({ jobsData }: { jobsData: JobsData }) {
  const companies = jobsData.companies;
  const lastUpdated = companies.reduce(
    (latest, job) => (job.updatedAt > latest ? job.updatedAt : latest),
    ""
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <section
        aria-labelledby="jobs-overview"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
            Track overview
          </p>
          <h2
            id="jobs-overview"
            className="m-0 mt-1 border-0 p-0 text-2xl font-black text-slate-950"
          >
            리서치 트랙을 선택하세요
          </h2>
          <p className="m-0 mt-2 max-w-2xl text-left text-sm leading-6 text-slate-600">
            Windows/.NET과 Embedded/MCU/BSP 회사·포지션 자료를 트랙별로
            나누어 살펴봅니다.
          </p>
        </div>
        <div className="grid gap-px bg-slate-200 md:grid-cols-2">
          {TRACK_ORDER.map((track) => {
            const count = companies.filter((job) => job.track === track).length;
            const details = trackDetails[track];

            return (
              <Link
                key={track}
                href={details.href}
                className={`group relative bg-white p-5 transition hover:brightness-[0.98] sm:p-6`}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-1 ${details.accent}`}
                />
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-lg font-extrabold text-slate-950">
                      {details.label}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">
                      {details.description}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    {count}개 조사 항목
                  </span>
                </span>
                <span className="mt-5 inline-flex text-sm font-extrabold text-indigo-700">
                  트랙 리서치 열기 →
                </span>
              </Link>
            );
          })}
        </div>
        <div className="grid gap-px border-t border-slate-200 bg-slate-200 sm:grid-cols-2">
          <div className="bg-slate-50 px-5 py-4 sm:px-6">
            <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
              Research entries
            </p>
            <p className="m-0 mt-1 text-left text-lg font-extrabold text-slate-950">
              {companies.length}개 조사 항목
            </p>
          </div>
          <div className="bg-slate-50 px-5 py-4 sm:px-6">
            <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
              최근 확인
            </p>
            <p className="m-0 mt-1 text-left text-lg font-extrabold text-slate-950">
              {lastUpdated ? formatDate(lastUpdated) : "—"}
            </p>
          </div>
        </div>
        {jobsData.commuteFilter && (
          <details className="group border-t border-slate-200 bg-slate-50">
            <summary className="cursor-pointer px-5 py-3 text-sm font-semibold text-slate-700 marker:text-slate-400 sm:px-6">
              통근 필터 보기
            </summary>
            <p className="m-0 px-5 pb-4 text-left text-sm leading-6 text-slate-600 sm:px-6">
              {jobsData.commuteFilter}
            </p>
          </details>
        )}
      </section>
    </main>
  );
}

function TrackBoard({
  jobsData,
  track,
}: {
  jobsData: JobsData;
  track: JobTrack;
}) {
  const details = trackDetails[track];
  const companies = jobsData.companies.filter((job) => job.track === track);
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
  const visibleBuckets = BUCKET_ORDER.filter(
    (bucket) => bucketCounts[bucket] > 0
  );
  const lastUpdated = companies.reduce(
    (latest, job) => (job.updatedAt > latest ? job.updatedAt : latest),
    ""
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <section
        aria-label={`${details.label} 리서치 요약`}
        className={`mb-6 overflow-hidden rounded-2xl border ${details.panel} shadow-sm`}
      >
        <div className={`h-1.5 ${details.accent}`} />
        <div className="grid gap-px bg-slate-200 sm:grid-cols-[1.25fr_2fr]">
          <div className="bg-white p-5">
            <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
              Research track
            </p>
            <h2 className="m-0 mt-1 border-0 p-0 text-xl font-black text-slate-950">
              {details.label}
            </h2>
            <p className="m-0 mt-1 text-left text-xs leading-5 text-slate-600">
              {details.description}
            </p>
          </div>
          <div className="bg-white p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  최근 확인
                </p>
                <p className="m-0 mt-1 text-left text-xl font-bold text-slate-950">
                  {lastUpdated ? formatDate(lastUpdated) : "—"}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                {companies.length}개 조사 항목
              </span>
            </div>
            <nav
              aria-label="조사 분류 바로가기"
              className="mt-4 flex flex-wrap gap-2"
            >
              {visibleBuckets.map((bucket) => (
                <a
                  key={bucket}
                  href={`#research-${bucketSlugs[bucket]}`}
                  className={`${styles.bucketLink} inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition hover:brightness-95 ${bucketStyles[bucket].chip}`}
                >
                  {bucketLabels[bucket]}
                  <span aria-label={`${bucketCounts[bucket]}개`}>
                    {bucketCounts[bucket]}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>
        {jobsData.commuteFilter && (
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
            표시할 조사 항목이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {visibleBuckets.map((bucket) => {
            const jobs = companies
              .filter((job) => job.bucket === bucket)
              .sort(
                (a, b) =>
                  Number(Boolean(b.priority)) - Number(Boolean(a.priority))
              );

            return (
              <section
                id={`research-${bucketSlugs[bucket]}`}
                key={bucket}
                className="scroll-mt-28"
                aria-labelledby={`heading-${bucket}`}
              >
                <div className="sticky top-[101px] z-30 -mx-1 mb-3 flex items-center justify-between border-b border-slate-300 bg-slate-100/95 px-1 py-3 backdrop-blur">
                  <h2
                    id={`heading-${bucket}`}
                    className="m-0 flex items-center gap-2 border-0 p-0 text-base font-extrabold text-slate-950"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${bucketStyles[bucket].dot}`}
                    />
                    {bucketLabels[bucket]}
                  </h2>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                    {jobs.length}개
                  </span>
                </div>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function JobsBoard({ track }: { track?: JobTrack }) {
  const [jobsData, setJobsData] = useState<JobsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const router = useRouter();

  const initialize = useCallback(async () => {
    try {
      const authResponse = await fetch("/api/admin/auth");
      if (!authResponse.ok) {
        router.push("/admin/login");
        return;
      }

      setAuthenticated(true);
      const jobsResponse = await fetch("/api/jobs");
      if (!jobsResponse.ok) {
        setLoadError(true);
        return;
      }

      setJobsData((await jobsResponse.json()) as JobsData);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!authenticated || loading) {
    return <LoadingState />;
  }

  return (
    <div
      className={`${styles.board} min-h-screen overflow-x-clip bg-slate-100 text-slate-950`}
    >
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div>
              <p className="m-0 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-300">
                Private workspace
              </p>
              <h1 className="m-0 border-0 p-0 text-lg font-bold text-white sm:text-xl">
                {track
                  ? `${trackDetails[track].label} 회사·포지션 리서치`
                  : "관심 회사 조사"}
              </h1>
            </div>
            <span className="shrink-0 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-300">
              {track
                ? `${jobsData?.companies.filter((job) => job.track === track).length ?? 0}개 조사 항목`
                : `${jobsData?.companies.length ?? 0}개 조사 항목`}
            </span>
          </div>
          <TrackNavigation activeTrack={track} />
        </div>
      </header>

      {loadError || jobsData == null ? (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div
            className="rounded-xl border border-rose-200 bg-white p-6 text-sm font-medium text-rose-800"
            role="alert"
          >
            회사·포지션 자료를 불러오지 못했습니다. 잠시 후 다시 시도해
            주세요.
          </div>
        </main>
      ) : track ? (
        <TrackBoard jobsData={jobsData} track={track} />
      ) : (
        <JobsHub jobsData={jobsData} />
      )}
    </div>
  );
}
