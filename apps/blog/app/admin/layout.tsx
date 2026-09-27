import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그 관리",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main id="main-content">{children}</main>;
}
