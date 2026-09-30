import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사 규모·추천도 리서치",
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
