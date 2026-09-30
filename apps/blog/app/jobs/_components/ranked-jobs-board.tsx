"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  CompanyScale,
  JobEntry,
  JobsData,
  JobTrack,
  RecommendationGrade,
} from "@/lib/jobs";
import styles from "../jobs.module.css";

const TRACK_ORDER: JobTrack[] = ["windows", "embedded"];
const COMPANY_SCALE_ORDER: CompanyScale[] = [
  "large",
  "medium",
  "small",
  "unknown",
];
const RECOMMENDATION_GRADE_ORDER: RecommendationGrade[] = [
  "A",
  "B",
  "C",
  "unknown",
];

const trackDetails: Record<
  JobTrack,
  { label: string; description: string; accent: string; panel: string; href: string }
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

const scaleDetails: Record<
  CompanyScale,
  { label: string; chip: string; accent: string; dot: string }
> = {
  large: {
    label: "대규모",
    chip: "border-violet-300 bg-violet-100 text-violet-900",
    accent: "border-l-violet-500",
    dot: "bg-violet-500",
  },
  medium: {
    label: "중견 규모",
    chip: "border-blue-300 bg-blue-100 text-blue-900",
    accent: "border-l-blue-500",
    dot: "bg-blue-500",
  },
  small: {
    label: "중소 규모",
    chip: "border-cyan-300 bg-cyan-100 text-cyan-900",
    accent: "border-l-cyan-500",
    dot: "bg-cyan-500",
  },
  unknown: {
    label: "규모 미확인",
    chip: "border-slate-300 bg-slate-100 text-slate-700",
    accent: "border-l-slate-400",
    dot: "bg-slate-400",
  },
};

const gradeDetails: Record<
  RecommendationGrade,
  { label: string; chip: string }
> = {
  A: {
    label: "추천 A",
    chip: "border-emerald-300 bg-emerald-100 text-emerald-900",
  },
  B: {
    label: "추천 B",
    chip: "border-lime-300 bg-lime-100 text-lime-900",
  },
  C: {
    label: "추천 C",
    chip: "border-amber-300 bg-amber-100 text-amber-900",
  },
  unknown: {
    label: "추천도 미확인",
    chip: "border-slate-300 bg-slate-100 text-slate-700",
  },
};

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

function countBy<T extends string>(
  companies: JobEntry[],
  values: readonly T[],
  select: (job: JobEntry) => T
) {
  return Object.fromEntries(
    values.map((value) => [
      value,
      companies.filter((job) => select(job) === value).length,
    ])
  ) as Record<T, number>;
}

function sortByRecommendation(companies: JobEntry[]) {
  return companies.toSorted((a, b) => {
    const gradeDifference =
      RECOMMENDATION_GRADE_ORDER.indexOf(a.recommendationGrade) -
      RECOMMENDATION_GRADE_ORDER.indexOf(b.recommendationGrade);

    return gradeDifference || a.name.localeCompare(b.name, "ko");
  });
}

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div
        className="flex items-center gap-3 text-sm font-medium text-slate-600"
        role="status"
      >
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600" />
        회사 리서치를 불러오는 중
      </div>
    </div>
  );
}

function TrackNavigation({ activeTrack }: { activeTrack?: JobTrack }) {
  return (
    <nav
      aria-label="회사 리서치 페이지"
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
        리서치 홈
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
  const scale = scaleDetails[job.companyScale];
  const grade = gradeDetails[job.recommendationGrade];

  return (
    <article
      className={`overflow-hidden rounded-xl border border-l-4 bg-white shadow-sm ${scale.accent} ${
        job.recommendationGrade === "A"
          ? "border-emerald-400 ring-2 ring-emerald-200"
          : "border-slate-200"
      }`}
    >
      <div className="grid min-w-0 gap-4 p-4 sm:p-5 lg:grid-cols-[1.1fr_0.8fr_1.5fr_auto] lg:items-start">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="m-0 border-0 p-0 text-base font-extrabold text-slate-950">
              {job.briefPath ? (
                <Link href={job.briefPath} className={styles.briefTitleLink}>
                  {job.name}
                </Link>
              ) : (
                job.name
              )}
            </h3>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${scale.chip}`}
            >
              {scale.label}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${grade.chip}`}
            >
              {grade.label}
            </span>
          </div>
          <p className="m-0 break-words text-left text-sm font-semibold leading-5 text-slate-800">
            {job.role}
          </p>
        </div>

        <dl className="grid min-w-0 grid-cols-[3rem_1fr] gap-x-2 gap-y-1 text-sm">
          <dt className="font-semibold text-slate-500">위치</dt>
          <dd className="m-0 break-words text-slate-800">{job.location}</dd>
        </dl>

        <dl className="grid min-w-0 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
          <div>
            <dt className="font-bold text-slate-500">추천 등급 근거</dt>
            <dd className="m-0 mt-1 leading-5 text-slate-800">
              {job.gradeBasis}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-slate-500">규모 근거</dt>
            <dd className="m-0 mt-1 leading-5 text-slate-800">
              {job.scaleBasis}
            </dd>
          </div>
        </dl>

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
  );
}

function RankingSummary({
  companies,
  jobsData,
}: {
  companies: JobEntry[];
  jobsData: JobsData;
}) {
  const scaleCounts = countBy(
    companies,
    COMPANY_SCALE_ORDER,
    (job) => job.companyScale
  );
  const gradeCounts = countBy(
    companies,
    RECOMMENDATION_GRADE_ORDER,
    (job) => job.recommendationGrade
  );

  return (
    <section
      aria-labelledby="ranking-model"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
          Ranking model
        </p>
        <h2
          id="ranking-model"
          className="m-0 mt-1 border-0 p-0 text-2xl font-black text-slate-950"
        >
          회사 규모와 추천 등급으로 정리한 리서치
        </h2>
        <p className="m-0 mt-2 max-w-3xl text-left text-sm leading-6 text-slate-600">
          {jobsData.rankingModel.organization} 근거가 부족한 값은 추정하지 않고
          미확인으로 표시합니다.
        </p>
      </div>
      <div className="grid gap-px bg-slate-200 md:grid-cols-2">
        <div className="bg-white p-5 sm:p-6">
          <h3 className="text-sm font-extrabold text-slate-900">회사 규모</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {COMPANY_SCALE_ORDER.map((scale) => (
              <span
                key={scale}
                className={`rounded-full border px-2.5 py-1 text-xs font-bold ${scaleDetails[scale].chip}`}
                title={jobsData.rankingModel.companyScale[scale]}
              >
                {scaleDetails[scale].label} {scaleCounts[scale]}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white p-5 sm:p-6">
          <h3 className="text-sm font-extrabold text-slate-900">추천 등급</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {RECOMMENDATION_GRADE_ORDER.map((grade) => (
              <span
                key={grade}
                className={`rounded-full border px-2.5 py-1 text-xs font-bold ${gradeDetails[grade].chip}`}
                title={jobsData.rankingModel.recommendationGrade[grade]}
              >
                {gradeDetails[grade].label} {gradeCounts[grade]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function JobsHub({ jobsData }: { jobsData: JobsData }) {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <RankingSummary companies={jobsData.companies} jobsData={jobsData} />
      <section
        aria-labelledby="track-overview"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <h2
            id="track-overview"
            className="m-0 border-0 p-0 text-xl font-black text-slate-950"
          >
            기술 트랙별 회사 리서치
          </h2>
        </div>
        <div className="grid gap-px bg-slate-200 md:grid-cols-2">
          {TRACK_ORDER.map((track) => {
            const details = trackDetails[track];
            const companies = jobsData.companies.filter(
              (job) => job.track === track
            );

            return (
              <Link
                key={track}
                href={details.href}
                className="group relative bg-white p-5 transition hover:brightness-[0.98] sm:p-6"
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
                    {companies.length}개
                  </span>
                </span>
                <span className="mt-5 inline-flex text-sm font-extrabold text-indigo-700">
                  규모·추천도 순위 보기 →
                </span>
              </Link>
            );
          })}
        </div>
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
  const companies = useMemo(
    () => jobsData.companies.filter((job) => job.track === track),
    [jobsData.companies, track]
  );
  const visibleScales = COMPANY_SCALE_ORDER.filter((scale) =>
    companies.some((job) => job.companyScale === scale)
  );

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <div className={`rounded-2xl border ${details.panel}`}>
        <div className={`h-1.5 ${details.accent}`} />
        <div className="p-5">
          <p className="m-0 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
            Company ranking
          </p>
          <h2 className="m-0 mt-1 border-0 p-0 text-xl font-black text-slate-950">
            {details.label}
          </h2>
          <p className="m-0 mt-2 text-sm leading-6 text-slate-600">
            규모가 큰 분류부터 표시하고, 같은 규모에서는 추천 등급이 높은
            회사를 먼저 표시합니다.
          </p>
          <nav aria-label="회사 규모 바로가기" className="mt-4 flex flex-wrap gap-2">
            {visibleScales.map((scale) => {
              const count = companies.filter(
                (job) => job.companyScale === scale
              ).length;
              return (
                <a
                  key={scale}
                  href={`#scale-${scale}`}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition hover:brightness-95 ${scaleDetails[scale].chip}`}
                >
                  {scaleDetails[scale].label} {count}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {visibleScales.map((scale) => {
        const jobs = sortByRecommendation(
          companies.filter((job) => job.companyScale === scale)
        );
        return (
          <section
            id={`scale-${scale}`}
            key={scale}
            className="scroll-mt-28"
            aria-labelledby={`heading-${scale}`}
          >
            <div className="sticky top-[101px] z-30 -mx-1 mb-3 flex items-center justify-between border-b border-slate-300 bg-slate-100/95 px-1 py-3 backdrop-blur">
              <h2
                id={`heading-${scale}`}
                className="m-0 flex items-center gap-2 border-0 p-0 text-base font-extrabold text-slate-950"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${scaleDetails[scale].dot}`}
                />
                {scaleDetails[scale].label}
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
    </main>
  );
}

export default function RankedJobsBoard({ track }: { track?: JobTrack }) {
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
                  ? `${trackDetails[track].label} 회사 리서치`
                  : "회사 규모·추천도 리서치"}
              </h1>
            </div>
            <span className="shrink-0 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-300">
              {track
                ? `${jobsData?.companies.filter((job) => job.track === track).length ?? 0}개`
                : `${jobsData?.companies.length ?? 0}개`}
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
            회사 리서치를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
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
