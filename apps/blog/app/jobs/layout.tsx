import { Metadata } from "next";

export const metadata: Metadata = {
  title: "관심 회사 조사",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
