import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { CodeBlock } from "./app/components/CodeBlock";

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
    // rehype-pretty-code가 생성하는 figure 태그를 CodeBlock으로 래핑
    figure: (props) => {
      // data-rehype-pretty-code-figure 속성이 있는 경우에만 CodeBlock 적용
      if ("data-rehype-pretty-code-figure" in props) {
        return <CodeBlock>{<figure {...props} />}</CodeBlock>;
      }
      return <figure {...props} />;
    },
  };
}
