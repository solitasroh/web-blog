import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    img: (props) => (
      <Image
        src={props.src || ""}
        alt={props.alt || ""}
        width={800}
        height={400}
        className="rounded-md mx-auto my-6"
      />
    ),
  };
}
