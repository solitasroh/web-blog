"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type JobStatus = "관심있음" | "지원완료" | "탈락" | "합격" | "보류";
type JobBucket = "지원" | "조건부" | "보류" | "통근스킵" | "기타스킵";

type JobEntry = {
  id: string;
  name: string;
  role: string;
  location: string;
  status: JobStatus;
  bucket: JobBucket;
  commute: string;
  skipReason?: string;
  recommendation?: string;
  notes?: string;
  updatedAt: string;
};

type JobsData = {
  commuteFilter?: string;
  companies: JobEntry[];
};

const statusColors: Record<JobStatus, string> = {
  관심있음: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  지원완료: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  탈락: "bg-red-500/10 text-red-500 border-red-500/20",
  합격: "bg-green-500/10 text-green-500 border-green-500/20",
  보류: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const bucketColors: Record<JobBucket, string> = {
  지원: "bg-green-500/10 text-green-600 border-green-500/20",
  조건부: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  보류: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  통근스킵: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  기타스킵: "bg-red-500/10 text-red-600 border-red-500/20",
};

const bucketOrder: JobBucket[] = [
  "지원",
  "조건부",
  "보류",
  "통근스킵",
  "기타스킵",
];

const bucketDetails: Record<
  JobBucket,
  { description: string; border: string; dot: string }
> = {
  지원: {
    description: "우선 지원할 공고",
    border: "border-l-green-500",
    dot: "bg-green-500",
  },
  조건부: {
    description: "세부 조건 확인 후 결정",
    border: "border-l-yellow-500",
    dot: "bg-yellow-500",
  },
  보류: {
    description: "추가 검토가 필요한 공고",
    border: "border-l-gray-400",
    dot: "bg-gray-400",
  },
  통근스킵: {
    description: "허용 통근 범위 밖",
    border: "border-l-orange-500",
    dot: "bg-orange-500",
  },
  기타스킵: {
    description: "직무·스택·규모 등으로 제외",
    border: "border-l-red-500",
    dot: "bg-red-500",
  },
};

function JobCard({ job }: { job: JobEntry }) {
  return (
    <article
      className={`rounded-xl border border-border border-l-4 bg-card p-4 sm:p-5 ${
        bucketDetails[job.bucket].border
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-foreground sm:text-lg">
            {job.name}
          </h3>
          <p className="mt-0.5 font-medium text-foreground">{job.role}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
              bucketColors[job.bucket]
            }`}
          >
            {job.bucket}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
              statusColors[job.status]
            }`}
          >
            {job.status}
          </span>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 border-t border-border pt-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium text-muted">근무지</dt>
          <dd className="mt-0.5 text-foreground">{job.location}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">출퇴근</dt>
          <dd className="mt-0.5 text-foreground">{job.commute}</dd>
        </div>
        {job.skipReason && (
          <div>
            <dt className="text-xs font-medium text-muted">제외 사유</dt>
            <dd className="mt-0.5 text-foreground">{job.skipReason}</dd>
          </div>
        )}
        {job.recommendation && (
          <div>
            <dt className="text-xs font-medium text-muted">추천</dt>
            <dd className="mt-0.5 text-foreground">{job.recommendation}</dd>
          </div>
        )}
      </dl>

      {job.notes && (
        <div className="mt-3 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm leading-relaxed text-muted">
          <span className="font-medium text-foreground">메모</span>
          <p className="mt-1">{job.notes}</p>
        </div>
      )}

      <p className="mt-3 text-right text-xs text-muted">
        마지막 수정 {job.updatedAt}
      </p>
    </article>
  );
}

function BucketSection({
  bucket,
  jobs,
}: {
  bucket: JobBucket;
  jobs: JobEntry[];
}) {
  if (jobs.length === 0) {
    return null;
  }

  const headingId = `bucket-${bucket}`;
  const details = bucketDetails[bucket];

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${details.dot}`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h2 id={headingId} className="text-lg font-bold text-foreground">
              {bucket}
            </h2>
            <span className="text-sm tabular-nums text-muted">
              {jobs.length}건
            </span>
          </div>
          <p className="text-sm text-muted">{details.description}</p>
        </div>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}

export default function JobsPage() {
  const [jobsData, setJobsData] = useState<JobsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [filter, setFilter] = useState<JobBucket | "all">("all");
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (!res.ok) {
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
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobsData(data);
      }
    } catch (error) {
      console.error("Failed to fetch jobs data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        await fetchJobsData();
      }
    };
    init();
  }, [checkAuth, fetchJobsData]);

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted">로딩 중...</div>
      </div>
    );
  }

  const companies = jobsData?.companies || [];
  const filteredCompanies =
    filter === "all"
      ? companies
      : companies.filter((job) => job.bucket === filter);
  const visibleBuckets = filter === "all" ? bucketOrder : [filter];

  const bucketCounts = companies.reduce(
    (acc, job) => {
      acc[job.bucket] = (acc[job.bucket] || 0) + 1;
      return acc;
    },
    {} as Record<JobBucket, number>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <h1 className="text-xl font-bold text-foreground">구직 조사 노트</h1>
            <Link
              href="/"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              ← 블로그로
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            취업 조사 대시보드
          </h2>
          <p className="text-sm text-muted mb-3">
            개인 구직 활동 메모 (비공개 페이지)
          </p>
          {jobsData?.commuteFilter && (
            <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm text-muted">
              <span className="font-medium text-foreground">🚇 통근 필터:</span>{" "}
              {jobsData.commuteFilter}
            </div>
          )}
        </div>

        <div
          className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4"
          aria-label="버킷 필터"
        >
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === "all"
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-muted hover:text-foreground"
            }`}
          >
            전체 <span className="tabular-nums">({companies.length})</span>
          </button>
          {bucketOrder.map((bucket) => (
              <button
                type="button"
                key={bucket}
                onClick={() => setFilter(bucket)}
                aria-pressed={filter === bucket}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === bucket
                    ? bucketColors[bucket]
                    : "border-border bg-card text-muted hover:text-foreground"
                }`}
              >
                {bucket}{" "}
                <span className="tabular-nums">
                  ({bucketCounts[bucket] || 0})
                </span>
              </button>
            ))}
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-muted mb-4">
              {filter === "all"
                ? "아직 조사한 회사가 없습니다."
                : `${filter} 카테고리의 회사가 없습니다.`}
            </p>
            <p className="text-sm text-muted">
              <code className="bg-muted/10 px-2 py-1 rounded">
                content/jobs/data.json
              </code>{" "}
              파일을 수정하여 데이터를 추가하세요.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {visibleBuckets.map((bucket) => (
              <BucketSection
                key={bucket}
                bucket={bucket}
                jobs={companies.filter((job) => job.bucket === bucket)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 p-4 rounded-lg bg-muted/5 border border-muted/10 text-sm text-muted">
          <p className="font-medium mb-1">📝 데이터 업데이트 방법:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>
              <code className="bg-muted/10 px-1.5 py-0.5 rounded text-xs">
                apps/blog/content/jobs/data.json
              </code>{" "}
              파일 편집
            </li>
            <li>Git commit 및 push</li>
            <li>배포 후 이 페이지 새로고침</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
