import { Metadata } from "next";

export const metadata: Metadata = {
  title: "구직 조사 노트",
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
