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

  const filteredCompanies =
    filter === "all"
      ? jobsData?.companies || []
      : jobsData?.companies.filter((job) => job.bucket === filter) || [];

  const bucketCounts = (jobsData?.companies || []).reduce(
    (acc, job) => {
      acc[job.bucket] = (acc[job.bucket] || 0) + 1;
      return acc;
    },
    {} as Record<JobBucket, number>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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

      <main className="max-w-6xl mx-auto px-6 py-8">
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

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-accent text-white"
                : "bg-muted/10 text-muted hover:bg-muted/20"
            }`}
          >
            전체 ({jobsData?.companies.length || 0})
          </button>
          {(["지원", "조건부", "보류", "통근스킵", "기타스킵"] as JobBucket[]).map(
            (bucket) => (
              <button
                key={bucket}
                onClick={() => setFilter(bucket)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === bucket
                    ? "bg-accent text-white"
                    : "bg-muted/10 text-muted hover:bg-muted/20"
                }`}
              >
                {bucket} ({bucketCounts[bucket] || 0})
              </button>
            )
          )}
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
          <div className="space-y-4">
            {filteredCompanies.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-foreground">
                        {job.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full border ${
                          bucketColors[job.bucket]
                        }`}
                      >
                        {job.bucket}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full border ${
                          statusColors[job.status]
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="mb-3 text-sm">
                      <div className="font-medium text-foreground">{job.role}</div>
                      <div className="text-muted">📍 {job.location}</div>
                    </div>

                    <div className="space-y-2 text-sm text-muted">
                      <div>
                        <span className="font-medium">출퇴근:</span> {job.commute}
                      </div>

                      {job.skipReason && (
                        <div>
                          <span className="font-medium">제외 사유:</span>{" "}
                          {job.skipReason}
                        </div>
                      )}

                      {job.recommendation && (
                        <div>
                          <span className="font-medium">추천:</span>{" "}
                          {job.recommendation}
                        </div>
                      )}

                      {job.notes && (
                        <div className="mt-3 p-3 rounded-lg bg-muted/5 border border-muted/10">
                          <span className="font-medium">메모:</span>
                          <p className="mt-1">{job.notes}</p>
                        </div>
                      )}

                      <div className="text-xs text-muted/70 mt-2">
                        마지막 수정: {job.updatedAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
