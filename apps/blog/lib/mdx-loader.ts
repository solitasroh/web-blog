import type { ComponentType } from "react";

type MDXModule = {
  default: ComponentType;
};

export async function loadMDX(slug: string): Promise<ComponentType | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  try {
    const mdxModule = (await import(
      `../content/posts/${slug}.mdx`
    )) as MDXModule;
    return mdxModule.default;
  } catch (error) {
    console.error(`Failed to load MDX for slug: ${slug}`, error);
    return null;
  }
}
