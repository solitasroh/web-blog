import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  getJobBriefIds,
  hasJobBrief,
  loadJobBrief,
} from "@/lib/job-briefs";
import { getJobById } from "@/lib/jobs";

const AUTH_COOKIE_NAME = "admin_session";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return getJobBriefIds().map((id) => ({ id }));
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
    title: job ? `${job.name} 리서치 노트` : "회사 리서치 노트",
  };
}

export default async function JobBriefPage({ params }: { params: Params }) {
  const { id } = await params;
  const job = getJobById(id);

  if (job == null || !hasJobBrief(id)) {
    notFound();
  }

  const cookieStore = await cookies();
  if (!cookieStore.get(AUTH_COOKIE_NAME)?.value) {
    redirect("/admin/login");
  }

  const Brief = await loadJobBrief(id);
  if (Brief == null) {
    notFound();
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
              {job.name} 회사·포지션 리서치
            </p>
          </div>
          <Link
            href={`/jobs/${job.track}`}
            className="shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white no-underline transition hover:border-slate-500 hover:bg-slate-800 hover:text-white hover:no-underline"
          >
            ← {job.track === "windows" ? "Windows / .NET" : "Embedded / MCU / BSP"} 리서치
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:px-10 sm:py-10">
          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-6 prose-headings:text-slate-950 prose-p:text-left prose-a:break-words prose-a:text-indigo-700 prose-a:underline prose-th:whitespace-nowrap prose-strong:text-slate-950">
            <Brief />
          </div>
        </article>
      </main>
    </div>
  );
}
