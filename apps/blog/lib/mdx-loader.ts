/**
 * 모든 MDX 파일을 정적으로 import하는 매핑
 * 빌드 타임에 모든 MDX가 번들에 포함되도록 보장
 */

import type { ComponentType } from "react";

type MDXModule = {
  default: ComponentType;
};

// 모든 MDX 파일을 정적으로 import
const mdxModules: Record<string, () => Promise<MDXModule>> = {
  "nextjs15-params-promise": () => import("../content/posts/nextjs15-params-promise.mdx"),
  "embedded-c-coding-standards": () => import("../content/posts/embedded-c-coding-standards.mdx"),
  "test-post": () => import("../content/posts/test-post.mdx"),
};

export async function loadMDX(slug: string): Promise<ComponentType | null> {
  const loader = mdxModules[slug];
  if (!loader) {
    return null;
  }
  
  try {
    const module = await loader();
    return module.default;
  } catch (error) {
    console.error(`Failed to load MDX for slug: ${slug}`, error);
    return null;
  }
}

export function getMDXSlugs(): string[] {
  return Object.keys(mdxModules);
}
