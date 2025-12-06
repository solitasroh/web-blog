import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    img: (props) => (
      <Image
        src={props.src || "/placeholder.png"}
        alt={props.alt || "블로그 이미지"}
        width={800}
        height={400}
        className="rounded-md mx-auto my-6"
        style={{ width: "100%", height: "auto" }}
      />
    ),
  };
}
