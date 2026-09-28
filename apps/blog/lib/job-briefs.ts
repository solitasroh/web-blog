import fs from "fs";
import path from "path";
import type { ComponentType } from "react";

const JOB_ID_PATTERN = /^[a-z0-9-]+$/;
const briefsDirectory = path.join(process.cwd(), "content", "jobs", "briefs");

type MarkdownModule = {
  default: ComponentType;
};

export function getJobBriefIds(): string[] {
  if (!fs.existsSync(briefsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(briefsDirectory)
    .filter((filename) => filename.endsWith(".md") && filename !== "INDEX.md")
    .map((filename) => filename.replace(/\.md$/, ""))
    .filter((id) => JOB_ID_PATTERN.test(id))
    .sort();
}

export function hasJobBrief(id: string): boolean {
  if (!JOB_ID_PATTERN.test(id)) {
    return false;
  }

  return fs.existsSync(path.join(briefsDirectory, `${id}.md`));
}

export function getJobBriefSource(id: string): string | null {
  if (!hasJobBrief(id)) {
    return null;
  }

  return fs.readFileSync(path.join(briefsDirectory, `${id}.md`), "utf8");
}

export async function loadJobBrief(
  id: string
): Promise<ComponentType | null> {
  if (!hasJobBrief(id)) {
    return null;
  }

  try {
    const markdownModule = (await import(
      `../content/jobs/briefs/${id}.md`
    )) as MarkdownModule;
    return markdownModule.default;
  } catch (error) {
    console.error(`Failed to load job brief: ${id}`, error);
    return null;
  }
}
